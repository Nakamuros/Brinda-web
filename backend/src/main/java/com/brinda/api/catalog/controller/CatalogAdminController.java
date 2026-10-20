package com.brinda.api.catalog.controller;

import com.brinda.api.auth.security.AuthenticatedUser;
import com.brinda.api.catalog.dto.AdminProductResponse;
import com.brinda.api.catalog.dto.CategoryRequest;
import com.brinda.api.catalog.dto.CategoryResponse;
import com.brinda.api.catalog.dto.OfferRequest;
import com.brinda.api.catalog.dto.PageResponse;
import com.brinda.api.catalog.dto.ProductRequest;
import com.brinda.api.catalog.dto.ProductVisibility;
import com.brinda.api.catalog.dto.PromoRequest;
import com.brinda.api.catalog.dto.VisibilityRequest;
import com.brinda.api.catalog.model.ProductType;
import com.brinda.api.catalog.service.CatalogAdminService;
import com.brinda.api.shared.util.ClientIp;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class CatalogAdminController {

    private final CatalogAdminService service;

    @GetMapping("/categories")
    public List<CategoryResponse> categories() {
        return service.categories();
    }

    @PostMapping("/categories")
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryResponse createCategory(@Valid @RequestBody CategoryRequest req,
                                           @AuthenticationPrincipal AuthenticatedUser user, HttpServletRequest http) {
        return service.createCategory(req, user.id(), ClientIp.of(http));
    }

    @PutMapping("/categories/{id}")
    public CategoryResponse updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryRequest req,
                                           @AuthenticationPrincipal AuthenticatedUser user, HttpServletRequest http) {
        return service.updateCategory(id, req, user.id(), ClientIp.of(http));
    }

    @GetMapping("/products")
    public PageResponse<AdminProductResponse> products(@RequestParam(required = false) Long categoryId,
                                                        @RequestParam(required = false, name = "q") String text,
                                                        @RequestParam(required = false) ProductVisibility visibility,
                                                        @RequestParam(required = false) Boolean onOffer,
                                                        @RequestParam(required = false) Boolean lowStock,
                                                        @RequestParam(required = false) ProductType type,
                                                        @RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "20") int size) {
        return service.products(categoryId, text, visibility, onOffer, lowStock, type, page, size);
    }

    @PostMapping("/products/visibility")
    public VisibilityResponse visibility(@Valid @RequestBody VisibilityRequest req,
                                         @AuthenticationPrincipal AuthenticatedUser user, HttpServletRequest http) {
        return new VisibilityResponse(service.setVisibility(req, user.id(), ClientIp.of(http)));
    }

    public record VisibilityResponse(int changed) {
    }

    @GetMapping("/products/{id}")
    public AdminProductResponse product(@PathVariable UUID id) {
        return service.product(id);
    }

    @PostMapping("/products")
    @ResponseStatus(HttpStatus.CREATED)
    public AdminProductResponse createProduct(@Valid @RequestBody ProductRequest req,
                                              @AuthenticationPrincipal AuthenticatedUser user, HttpServletRequest http) {
        return service.createProduct(req, user.id(), ClientIp.of(http));
    }

    @PutMapping("/products/{id}/offer")
    public AdminProductResponse setOffer(@PathVariable UUID id, @Valid @RequestBody OfferRequest req,
                                         @AuthenticationPrincipal AuthenticatedUser user, HttpServletRequest http) {
        return service.setOffer(id, req, user.id(), ClientIp.of(http));
    }

    @DeleteMapping("/products/{id}/offer")
    public AdminProductResponse clearOffer(@PathVariable UUID id,
                                           @AuthenticationPrincipal AuthenticatedUser user, HttpServletRequest http) {
        return service.clearOffer(id, user.id(), ClientIp.of(http));
    }

    @PutMapping("/products/{id}/promo")
    public AdminProductResponse setPromo(@PathVariable UUID id, @Valid @RequestBody PromoRequest req,
                                         @AuthenticationPrincipal AuthenticatedUser user, HttpServletRequest http) {
        return service.setPromo(id, req, user.id(), ClientIp.of(http));
    }

    @DeleteMapping("/products/{id}/promo")
    public AdminProductResponse clearPromo(@PathVariable UUID id,
                                           @AuthenticationPrincipal AuthenticatedUser user, HttpServletRequest http) {
        return service.clearPromo(id, user.id(), ClientIp.of(http));
    }

    @PutMapping("/products/{id}")
    public AdminProductResponse updateProduct(@PathVariable UUID id, @Valid @RequestBody ProductRequest req,
                                              @AuthenticationPrincipal AuthenticatedUser user, HttpServletRequest http) {
        return service.updateProduct(id, req, user.id(), ClientIp.of(http));
    }
}
