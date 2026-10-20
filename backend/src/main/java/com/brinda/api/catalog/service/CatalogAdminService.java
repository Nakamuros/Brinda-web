package com.brinda.api.catalog.service;

import com.brinda.api.catalog.dto.AdminProductResponse;
import com.brinda.api.catalog.dto.CategoryRequest;
import com.brinda.api.catalog.dto.CategoryResponse;
import com.brinda.api.catalog.dto.PageResponse;
import com.brinda.api.catalog.dto.OfferRequest;
import com.brinda.api.catalog.dto.ProductRequest;
import com.brinda.api.catalog.dto.PromoRequest;
import com.brinda.api.catalog.dto.ProductVisibility;
import com.brinda.api.catalog.dto.VisibilityRequest;
import com.brinda.api.catalog.model.Category;
import com.brinda.api.catalog.model.Product;
import com.brinda.api.catalog.model.ProductType;
import com.brinda.api.catalog.repository.CategoryRepository;
import com.brinda.api.catalog.repository.ProductRepository;
import com.brinda.api.catalog.repository.ProductSpecifications;
import com.brinda.api.shared.audit.AuditService;
import com.brinda.api.shared.exception.BusinessRuleException;
import com.brinda.api.shared.exception.ResourceNotFoundException;
import com.brinda.api.shared.util.SlugUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.function.Predicate;

/** Gestión del catálogo desde el panel /admin. Nada se borra: se desactiva. */
@Service
@RequiredArgsConstructor
@Transactional
public class CatalogAdminService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final AuditService auditService;
    private final Clock clock;

    // ---------- Categorías ----------

    @Transactional(readOnly = true)
    public List<CategoryResponse> categories() {
        return categoryRepository.findAllByOrderByDisplayOrderAscNameAsc().stream()
                .map(CategoryResponse::from).toList();
    }

    public CategoryResponse createCategory(CategoryRequest req, UUID actor, String ip) {
        if (categoryRepository.existsByNameIgnoreCase(req.name().trim())) {
            throw new BusinessRuleException("Ya existe una categoría con ese nombre");
        }
        Category c = new Category();
        c.setSlug(uniqueSlug(req.name(), categoryRepository::existsBySlug));
        apply(c, req);
        categoryRepository.save(c);
        auditService.record(actor, "CATEGORY_CREATE", "categories", String.valueOf(c.getId()), ip);
        return CategoryResponse.from(c);
    }

    public CategoryResponse updateCategory(Long id, CategoryRequest req, UUID actor, String ip) {
        Category c = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada"));
        if (categoryRepository.existsByNameIgnoreCaseAndIdNot(req.name().trim(), id)) {
            throw new BusinessRuleException("Ya existe una categoría con ese nombre");
        }
        apply(c, req);   // el slug no cambia al renombrar: se conservan las URLs
        auditService.record(actor, "CATEGORY_UPDATE", "categories", String.valueOf(id), ip);
        return CategoryResponse.from(c);
    }

    private void apply(Category c, CategoryRequest req) {
        c.setName(req.name().trim());
        c.setDescription(blankToNull(req.description()));
        c.setIconUrl(blankToNull(req.iconUrl()));
        c.setActive(req.active());
        c.setDisplayOrder(req.displayOrder());
    }

    // ---------- Productos ----------

    @Transactional(readOnly = true)
    public PageResponse<AdminProductResponse> products(Long categoryId, String text, ProductVisibility visibility,
                                                       Boolean onOffer, Boolean lowStock, ProductType type, int page, int size) {
        Specification<Product> spec = Specification.where(null);
        if (categoryId != null) {
            spec = spec.and((root, q, cb) -> cb.equal(root.get("category").get("id"), categoryId));
        }
        if (text != null && !text.isBlank()) {
            spec = spec.and(ProductSpecifications.nameContains(text));
        }
        if (visibility == ProductVisibility.VISIBLE) {
            spec = spec.and(ProductSpecifications.available());
        } else if (visibility == ProductVisibility.HIDDEN) {
            spec = spec.and(ProductSpecifications.hidden());
        }
        if (Boolean.TRUE.equals(onOffer)) {
            spec = spec.and(ProductSpecifications.onOffer(now()));
        }
        if (type != null) {
            spec = spec.and(ProductSpecifications.ofType(type));
        }
        if (Boolean.TRUE.equals(lowStock)) {
            spec = spec.and(ProductSpecifications.lowStock());
        }
        var pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), CatalogService.MAX_PAGE_SIZE),
                Sort.by("name", "id"));
        return PageResponse.of(productRepository.findAll(spec, pageable), p -> AdminProductResponse.from(p, now()));
    }

    @Transactional(readOnly = true)
    public AdminProductResponse product(UUID id) {
        return AdminProductResponse.from(find(id), now());
    }

    public AdminProductResponse createProduct(ProductRequest req, UUID actor, String ip) {
        validate(req, null);
        checkOffer(req.price(), req.discountPrice(), req.offerEndsAt(), null);
        Product p = new Product();
        p.setSlug(uniqueSlug(req.name(), productRepository::existsBySlug));
        apply(p, req);
        productRepository.save(p);
        auditService.record(actor, "PRODUCT_CREATE", "products", p.getId().toString(), ip);
        if (p.getDiscountPrice() != null) {
            auditService.record(actor, "OFFER_SET", "products", p.getId().toString(), ip, offerDetails(p));
        }
        return AdminProductResponse.from(p, now());
    }

    public AdminProductResponse updateProduct(UUID id, ProductRequest req, UUID actor, String ip) {
        Product p = find(id);
        validate(req, id);
        checkOffer(req.price(), req.discountPrice(), req.offerEndsAt(), p);
        rejectOfferIfPromo(p, req.discountPrice());
        boolean priceChanged = p.getPrice().compareTo(req.price()) != 0;
        String priceDetails = priceChanged ? "price " + p.getPrice() + " -> " + req.price() : null;
        boolean offerChanged = !sameOffer(p, req.discountPrice(), req.offerEndsAt());
        String offerBefore = offerDetails(p);
        apply(p, req);
        if (priceChanged) {
            auditService.record(actor, "PRICE_CHANGE", "products", id.toString(), ip, priceDetails);
        }
        if (offerChanged) {
            auditService.record(actor, p.getDiscountPrice() == null ? "OFFER_CLEAR" : "OFFER_SET", "products",
                    id.toString(), ip, p.getDiscountPrice() == null ? offerBefore + " -> none" : offerDetails(p));
        }
        if (!priceChanged && !offerChanged) {
            auditService.record(actor, "PRODUCT_UPDATE", "products", id.toString(), ip);
        }
        return AdminProductResponse.from(p, now());
    }

    /** Fija o cambia la oferta: precio y fecha de fin obligatorios, y la fecha debe ser futura. */
    public AdminProductResponse setOffer(UUID id, OfferRequest req, UUID actor, String ip) {
        Product p = find(id);
        rejectOfferIfPromo(p, req.discountPrice());
        checkOffer(p.getPrice(), req.discountPrice(), req.endsAt(), null);
        p.setDiscountPrice(req.discountPrice());
        p.setOfferEndsAt(req.endsAt());
        auditService.record(actor, "OFFER_SET", "products", id.toString(), ip, offerDetails(p));
        return AdminProductResponse.from(p, now());
    }

    /** Quita la oferta (UPDATE de columnas; el producto no se borra). */
    public AdminProductResponse clearOffer(UUID id, UUID actor, String ip) {
        Product p = find(id);
        if (p.getDiscountPrice() == null) {
            throw new BusinessRuleException("El producto no tiene una oferta");
        }
        String before = offerDetails(p);
        p.setDiscountPrice(null);
        p.setOfferEndsAt(null);
        auditService.record(actor, "OFFER_CLEAR", "products", id.toString(), ip, before + " -> none");
        return AdminProductResponse.from(p, now());
    }

    /** Fija "lleva N paga M": fecha de fin obligatoria y futura; excluyente con la oferta de precio. */
    public AdminProductResponse setPromo(UUID id, PromoRequest req, UUID actor, String ip) {
        Product p = find(id);
        if (req.buy() <= req.pay()) {
            throw new BusinessRuleException("En \"lleva N, paga M\", N debe ser mayor que M");
        }
        if (p.getDiscountPrice() != null) {
            throw new BusinessRuleException("El producto tiene una oferta de precio. Quítala antes de fijar una promoción");
        }
        if (!req.endsAt().isAfter(now())) {
            throw new BusinessRuleException("La fecha de fin de la promoción debe ser futura");
        }
        p.setPromoBuy((short) req.buy());
        p.setPromoPay((short) req.pay());
        p.setPromoEndsAt(req.endsAt());
        auditService.record(actor, "PROMO_SET", "products", id.toString(), ip, promoDetails(p));
        return AdminProductResponse.from(p, now());
    }

    /** Quita la promoción (UPDATE de columnas; el producto no se borra). */
    public AdminProductResponse clearPromo(UUID id, UUID actor, String ip) {
        Product p = find(id);
        if (p.getPromoBuy() == null) {
            throw new BusinessRuleException("El producto no tiene una promoción");
        }
        String before = promoDetails(p);
        p.setPromoBuy(null);
        p.setPromoPay(null);
        p.setPromoEndsAt(null);
        auditService.record(actor, "PROMO_CLEAR", "products", id.toString(), ip, before + " -> none");
        return AdminProductResponse.from(p, now());
    }

    private static void rejectOfferIfPromo(Product p, BigDecimal discount) {
        if (discount != null && p.getPromoBuy() != null) {
            throw new BusinessRuleException(
                    "El producto tiene una promoción \"lleva N, paga M\". Quítala antes de fijar una oferta de precio");
        }
    }

    private static String promoDetails(Product p) {
        return "buy " + p.getPromoBuy() + " pay " + p.getPromoPay()
                + (p.getPromoEndsAt() == null ? " no end" : " until " + p.getPromoEndsAt());
    }

    private OffsetDateTime now() {
        return OffsetDateTime.now(clock);
    }

    /**
     * Reglas de la oferta. Si {@code current} ya tiene exactamente esta oferta (p. ej. vencida o sin fecha de
     * datos antiguos), se tolera para poder editar otros campos del producto sin reescribirla.
     */
    private void checkOffer(BigDecimal price, BigDecimal discount, OffsetDateTime endsAt, Product current) {
        if (discount == null) {
            if (endsAt != null) {
                throw new BusinessRuleException("La fecha de fin requiere un precio de oferta");
            }
            return;
        }
        if (discount.compareTo(price) >= 0) {
            throw new BusinessRuleException("El precio de oferta debe ser menor que el precio normal");
        }
        if (current != null && sameOffer(current, discount, endsAt)) {
            return;
        }
        if (endsAt == null) {
            throw new BusinessRuleException("La oferta requiere fecha y hora de fin");
        }
        if (!endsAt.isAfter(now())) {
            throw new BusinessRuleException("La fecha de fin de la oferta debe ser futura");
        }
    }

    private static boolean sameOffer(Product p, BigDecimal discount, OffsetDateTime endsAt) {
        boolean sameEnd = p.getOfferEndsAt() == null ? endsAt == null
                : endsAt != null && p.getOfferEndsAt().isEqual(endsAt);
        return sameMoney(p.getDiscountPrice(), discount) && sameEnd;
    }

    private static String offerDetails(Product p) {
        return p.getDiscountPrice() == null ? null : "price " + p.getPrice() + ", offer " + p.getDiscountPrice()
                + (p.getOfferEndsAt() == null ? " no end" : " until " + p.getOfferEndsAt());
    }

    private Product find(UUID id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));
    }

    /** Todo o nada: si algún id no existe no se cambia nada. Un registro de auditoría por producto modificado. */
    public int setVisibility(VisibilityRequest req, UUID actor, String ip) {
        List<UUID> ids = req.ids().stream().distinct().toList();
        List<Product> products = productRepository.findAllById(ids);
        if (products.size() != ids.size()) {
            throw new BusinessRuleException("Algún producto indicado no existe");
        }
        boolean available = req.available();
        int changed = 0;
        for (Product p : products) {
            if (p.isAvailable() != available) {
                String details = "available " + p.isAvailable() + " -> " + available;
                p.setAvailable(available);
                auditService.record(actor, available ? "PRODUCT_SHOW" : "PRODUCT_HIDE", "products",
                        p.getId().toString(), ip, details);
                changed++;
            }
        }
        return changed;
    }

    private static boolean sameMoney(BigDecimal a, BigDecimal b) {
        return a == null || b == null ? a == b : a.compareTo(b) == 0;
    }

    private void validate(ProductRequest req, UUID currentId) {
        if (req.maxStock() < req.minStock()) {
            throw new BusinessRuleException("El stock máximo no puede ser menor que el mínimo");
        }
        String sku = blankToNull(req.sku());
        if (sku != null && (currentId == null ? productRepository.existsBySku(sku)
                : productRepository.existsBySkuAndIdNot(sku, currentId))) {
            throw new BusinessRuleException("Ya existe un producto con ese SKU");
        }
    }

    private void apply(Product p, ProductRequest req) {
        p.setCategory(categoryRepository.findById(req.categoryId())
                .orElseThrow(() -> new BusinessRuleException("La categoría indicada no existe")));
        p.setSku(blankToNull(req.sku()));
        p.setName(req.name().trim());
        p.setDescription(blankToNull(req.description()));
        p.setPrice(req.price());
        p.setDiscountPrice(req.discountPrice());
        p.setOfferEndsAt(req.offerEndsAt());
        p.setImageUrl(blankToNull(req.imageUrl()));
        p.setMinStock(req.minStock());
        p.setMaxStock(req.maxStock());
        p.setAvailable(req.available());
        p.setFeatured(req.featured());
    }

    private static String uniqueSlug(String name, Predicate<String> exists) {
        return SlugUtil.unique(name, exists);
    }

    private static String blankToNull(String s) {
        return s == null || s.isBlank() ? null : s.trim();
    }
}
