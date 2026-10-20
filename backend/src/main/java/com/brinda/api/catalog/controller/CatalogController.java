package com.brinda.api.catalog.controller;

import com.brinda.api.catalog.dto.CategoryResponse;
import com.brinda.api.catalog.dto.PageResponse;
import com.brinda.api.catalog.dto.PublicProductResponse;
import com.brinda.api.catalog.service.CatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Catálogo público: solo lectura. */
@RestController
@RequestMapping("/api/v1/catalog")
@RequiredArgsConstructor
public class CatalogController {

    private final CatalogService service;

    @GetMapping("/categories")
    public List<CategoryResponse> categories() {
        return service.categories();
    }

    @GetMapping("/products")
    public PageResponse<PublicProductResponse> products(@RequestParam(required = false) String category,
                                                         @RequestParam(required = false, name = "q") String text,
                                                         @RequestParam(required = false) Boolean featured,
                                                         @RequestParam(required = false) Boolean onOffer,
                                                         @RequestParam(defaultValue = "0") int page,
                                                         @RequestParam(defaultValue = "12") int size) {
        return service.products(category, text, featured, onOffer, page, size);
    }

    @GetMapping("/products/{slug}")
    public PublicProductResponse product(@PathVariable String slug) {
        return service.product(slug);
    }
}
