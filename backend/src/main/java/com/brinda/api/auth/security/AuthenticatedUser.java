package com.brinda.api.auth.security;

import java.util.UUID;

public record AuthenticatedUser(UUID id, String username) {
}
