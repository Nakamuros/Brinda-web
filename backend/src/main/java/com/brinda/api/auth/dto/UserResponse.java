package com.brinda.api.auth.dto;

import com.brinda.api.auth.model.User;

import java.util.UUID;

public record UserResponse(UUID id, String username, String email, String role, boolean mustChangePassword) {

    public static UserResponse from(User user) {
        return new UserResponse(user.getId(), user.getUsername(), user.getEmail(),
                user.getRole().name(), user.isMustChangePassword());
    }
}
