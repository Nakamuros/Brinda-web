package com.brinda.api.catalog.service;

import com.brinda.api.catalog.dto.CategoryResponse;
import com.brinda.api.catalog.dto.PageResponse;
import com.brinda.api.catalog.dto.PublicProductResponse;
import com.brinda.api.catalog.model.Product;
import com.brinda.api.combo.repository.ComboItemRepository;
import com.brinda.api.catalog.repository.CategoryRepository;
import com.brinda.api.catalog.repository.ProductRepository;
import com.brinda.api.catalog.repository.ProductSpecifications;
import com.brinda.api.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

/** Lectura pública del catálogo. */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CatalogService {

    static final int MAX_PAGE_SIZE = 50;

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ComboItemRepository comboItemRepository;
    private final Clock clock;

    public List<CategoryResponse> categories() {
        return categoryRepository.findByActiveTrueOrderByDisplayOrderAscNameAsc().stream()
                .map(CategoryResponse::from).toList();
    }

    public PageResponse<PublicProductResponse> products(String categorySlug, String text, Boolean featured,
                                                         Boolean onOffer, int page, int size) {
        OffsetDateTime now = OffsetDateTime.now(clock);
        Specification<Product> spec = ProductSpecifications.activeCategory()
                .and(ProductSpecifications.available());
        if (categorySlug != null && !categorySlug.isBlank()) {
            spec = spec.and(ProductSpecifications.inCategorySlug(categorySlug));
        }
        if (text != null && !text.isBlank()) {
            spec = spec.and(ProductSpecifications.nameContains(text));
        }
        if (Boolean.TRUE.equals(featured)) {
            spec = spec.and(ProductSpecifications.featured());
        }
        if (Boolean.TRUE.equals(onOffer)) {
            spec = spec.and(ProductSpecifications.onOffer(now));
        }
        spec = spec.and(ProductSpecifications.catalogOrder(now));
        var pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), MAX_PAGE_SIZE));
        Page<Product> result = productRepository.findAll(spec, pageable);
        List<UUID> comboIds = result.getContent().stream().filter(Product::isCombo).map(Product::getId).toList();
        Map<UUID, List<PublicProductResponse.Line>> contents = comboIds.isEmpty() ? Map.of() : contents(comboIds);
        return PageResponse.of(result, p -> PublicProductResponse.from(p, now, contents.get(p.getId())));
    }

    public PublicProductResponse product(String slug) {
        return productRepository.findBySlug(slug)
                .filter(p -> p.getCategory().isActive() && p.isAvailable())
                .map(p -> PublicProductResponse.from(p, OffsetDateTime.now(clock),
                        p.isCombo() ? contents(List.of(p.getId())).get(p.getId()) : null))
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));
    }

    private Map<UUID, List<PublicProductResponse.Line>> contents(List<UUID> comboIds) {
        return comboItemRepository.findByComboIdInOrderByIdAsc(comboIds).stream()
                .collect(Collectors.groupingBy(i -> i.getCombo().getId(),
                        Collectors.mapping(i -> new PublicProductResponse.Line(i.getProduct().getName(), i.getQuantity()),
                                Collectors.toList())));
    }
}
