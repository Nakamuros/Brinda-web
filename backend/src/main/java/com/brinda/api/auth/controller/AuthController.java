package com.brinda.api.auth.controller;

import com.brinda.api.auth.dto.ChangePasswordRequest;
import com.brinda.api.auth.dto.LoginRequest;
import com.brinda.api.auth.dto.UserResponse;
import com.brinda.api.auth.model.User;
import com.brinda.api.auth.security.AuthenticatedUser;
import com.brinda.api.auth.security.JwtService;
import com.brinda.api.auth.service.AuthService;
import com.brinda.api.shared.util.ClientIp;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@Valid @RequestBody LoginRequest request, HttpServletRequest http) {
        User user = authService.login(request, ClientIp.of(http));
        return withSession(user);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@AuthenticationPrincipal AuthenticatedUser principal, HttpServletRequest http) {
        if (principal != null) {
            authService.logout(principal.id(), ClientIp.of(http));
        }
        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, jwtService.clearCookie().toString())
                .build();
    }

    @GetMapping("/me")
    public UserResponse me(@AuthenticationPrincipal AuthenticatedUser principal) {
        return UserResponse.from(authService.getById(principal.id()));
    }

    @PostMapping("/change-password")
    public ResponseEntity<UserResponse> changePassword(@AuthenticationPrincipal AuthenticatedUser principal,
                                                       @Valid @RequestBody ChangePasswordRequest request,
                                                       HttpServletRequest http) {
        User user = authService.changePassword(principal.id(), request, ClientIp.of(http));
        return withSession(user);
    }

    private ResponseEntity<UserResponse> withSession(User user) {
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtService.sessionCookie(jwtService.generate(user)).toString())
                .body(UserResponse.from(user));
    }
}
