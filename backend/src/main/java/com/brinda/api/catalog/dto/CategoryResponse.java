package com.brinda.api.catalog.dto;

import com.brinda.api.catalog.model.Category;

public record CategoryResponse(Long id, String name, String slug, String description, String iconUrl,
                               boolean active, int displayOrder) {

    public static CategoryResponse from(Category c) {
        return new CategoryResponse(c.getId(), c.getName(), c.getSlug(), c.getDescription(), c.getIconUrl(),
                c.isActive(), c.getDisplayOrder());
    }
}
