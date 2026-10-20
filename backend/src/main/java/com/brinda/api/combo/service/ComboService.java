package com.brinda.api.combo.service;

import com.brinda.api.catalog.dto.AdminProductResponse;
import com.brinda.api.catalog.dto.ProductRequest;
import com.brinda.api.catalog.model.Category;
import com.brinda.api.catalog.model.Product;
import com.brinda.api.catalog.model.ProductType;
import com.brinda.api.catalog.repository.CategoryRepository;
import com.brinda.api.catalog.repository.ProductRepository;
import com.brinda.api.catalog.service.CatalogAdminService;
import com.brinda.api.combo.dto.BuildComboRequest;
import com.brinda.api.combo.dto.ComboDetailResponse;
import com.brinda.api.combo.dto.ComboUpdateRequest;
import com.brinda.api.combo.dto.CreateComboRequest;
import com.brinda.api.combo.model.ComboItem;
import com.brinda.api.combo.repository.ComboItemRepository;
import com.brinda.api.inventory.service.InventoryService;
import com.brinda.api.inventory.service.StockLine;
import com.brinda.api.shared.audit.AuditService;
import com.brinda.api.shared.exception.BusinessRuleException;
import com.brinda.api.shared.exception.ResourceNotFoundException;
import com.brinda.api.shared.util.SlugUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Combos pre-armados: un producto con stock propio y composición fija. Armar mueve stock (no es venta);
 * venderlo y anular la venta usa el flujo normal de pedidos.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class ComboService {

    static final String COMBO_CATEGORY_SLUG = "combos-y-promociones";

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ComboItemRepository comboItemRepository;
    private final InventoryService inventoryService;
    private final CatalogAdminService catalogAdminService;
    private final AuditService auditService;
    private final Clock clock;

    public ComboDetailResponse create(CreateComboRequest req, UUID actor, String ip) {
        if (req.maxStock() < req.minStock()) {
            throw new BusinessRuleException("El stock máximo no puede ser menor que el mínimo");
        }
        Map<UUID, Product> components = loadComponents(req);
        Category category = categoryRepository.findBySlug(COMBO_CATEGORY_SLUG)
                .orElseThrow(() -> new BusinessRuleException("Falta la categoría de combos"));

        Product combo = new Product();
        combo.setProductType(ProductType.COMBO);
        combo.setCategory(category);
        combo.setName(req.name().trim());
        combo.setSlug(SlugUtil.unique(req.name(), productRepository::existsBySlug));
        combo.setDescription(blankToNull(req.description()));
        combo.setPrice(req.price());
        combo.setImageUrl(blankToNull(req.imageUrl()));
        combo.setMinStock(req.minStock());
        combo.setMaxStock(req.maxStock());
        combo.setAvailable(req.available());
        combo.setFeatured(req.featured());
        productRepository.save(combo);

        List<ComboItem> items = req.items().stream()
                .map(i -> new ComboItem(combo, components.get(i.productId()), i.quantity())).toList();
        comboItemRepository.saveAll(items);
        auditService.record(actor, "COMBO_CREATE", "products", combo.getId().toString(), ip,
                "units " + req.unitsToBuild() + "; items: " + items.stream()
                        .map(i -> i.getProduct().getName() + " x" + i.getQuantity()).collect(Collectors.joining(", ")));

        buildUnits(combo, items, req.unitsToBuild(), null, actor, ip);
        return detail(combo.getId());
    }

    /** "Armar más": todo o nada; si a un componente no le alcanza, el error dice cuál y cuánto hay. */
    public ComboDetailResponse build(UUID comboId, BuildComboRequest req, UUID actor, String ip) {
        Product combo = findCombo(comboId);
        List<ComboItem> items = comboItemRepository.findByComboIdOrderByIdAsc(comboId);
        buildUnits(combo, items, req.units(), blankToNull(req.reason()), actor, ip);
        return detail(comboId);
    }

    @Transactional(readOnly = true)
    public ComboDetailResponse detail(UUID comboId) {
        Product combo = findCombo(comboId);
        List<ComboItem> items = comboItemRepository.findByComboIdOrderByIdAsc(comboId);
        int buildable = ComboCalculator.buildableNow(items.stream()
                .map(i -> new ComboCalculator.Component(i.getProduct().getStockQuantity(), i.getQuantity())).toList());
        return new ComboDetailResponse(AdminProductResponse.from(combo, OffsetDateTime.now(clock)),
                items.stream().map(ComboDetailResponse.Line::from).toList(), buildable);
    }

    /** Nombre, descripción, foto, precio, oferta, umbrales y visibilidad. Rechaza composición y stock. */
    public ComboDetailResponse update(UUID comboId, ComboUpdateRequest req, UUID actor, String ip) {
        if (req.items() != null || req.stockQuantity() != null) {
            throw new BusinessRuleException("La composición y el stock de un combo no se pueden editar. "
                    + "Para otro contenido crea otro combo; el stock cambia armando, vendiendo o con ajustes.");
        }
        Product combo = findCombo(comboId);
        catalogAdminService.updateProduct(comboId, new ProductRequest(combo.getCategory().getId(), combo.getSku(),
                req.name(), req.description(), req.price(), req.discountPrice(), req.offerEndsAt(), req.imageUrl(),
                req.minStock(), req.maxStock(), req.available(), req.featured()), actor, ip);
        return detail(comboId);
    }

    private void buildUnits(Product combo, List<ComboItem> items, int units, String reason, UUID actor, String ip) {
        List<StockLine> perCombo = items.stream()
                .map(i -> new StockLine(i.getProduct().getId(), i.getQuantity())).toList();
        String consumed = inventoryService.buildCombo(combo.getId(), units, perCombo, reason, actor);
        auditService.record(actor, "COMBO_BUILD", "products", combo.getId().toString(), ip,
                "+" + units + " units, consumed: " + consumed);
    }

    private Map<UUID, Product> loadComponents(CreateComboRequest req) {
        List<UUID> ids = req.items().stream().map(CreateComboRequest.Item::productId).toList();
        if (ids.stream().distinct().count() != ids.size()) {
            throw new BusinessRuleException("Hay productos repetidos en la composición");
        }
        Map<UUID, Product> products = productRepository.findAllById(ids).stream()
                .collect(Collectors.toMap(Product::getId, Function.identity()));
        if (products.size() != ids.size()) {
            throw new BusinessRuleException("Algún producto de la composición no existe");
        }
        if (products.values().stream().anyMatch(Product::isCombo)) {
            throw new BusinessRuleException("Un combo no puede contener otro combo");
        }
        return products;
    }

    private Product findCombo(UUID id) {
        return productRepository.findById(id).filter(Product::isCombo)
                .orElseThrow(() -> new ResourceNotFoundException("Combo no encontrado"));
    }

    private static String blankToNull(String s) {
        return s == null || s.isBlank() ? null : s.trim();
    }
}
