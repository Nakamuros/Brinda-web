package com.brinda.api.auth.service;

import com.brinda.api.auth.dto.ChangePasswordRequest;
import com.brinda.api.auth.dto.LoginRequest;
import com.brinda.api.auth.model.User;
import com.brinda.api.auth.repository.UserRepository;
import com.brinda.api.auth.security.SecurityProperties;
import com.brinda.api.shared.audit.AuditService;
import com.brinda.api.shared.exception.BusinessRuleException;
import com.brinda.api.shared.exception.InvalidCredentialsException;
import com.brinda.api.shared.exception.ResourceNotFoundException;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;
    private final SecurityProperties securityProperties;

    /** Hash de relleno para igualar el tiempo de respuesta cuando el usuario no existe. */
    private String dummyHash;

    @PostConstruct
    void init() {
        dummyHash = passwordEncoder.encode(UUID.randomUUID().toString());
    }

    /** noRollbackFor: el contador de intentos y la auditoría deben persistir aunque el login falle. */
    @Transactional(noRollbackFor = InvalidCredentialsException.class)
    public User login(LoginRequest request, String ip) {
        User user = userRepository.findByUsernameIgnoreCase(request.username().trim()).orElse(null);

        if (user == null) {
            passwordEncoder.matches(request.password(), dummyHash);
            auditService.record(null, "LOGIN_FAIL", "users", null, ip);
            throw new InvalidCredentialsException();
        }
        if (!user.isActive() || user.isLocked()) {
            auditService.record(user.getId(), "LOGIN_BLOCKED", "users", user.getId().toString(), ip);
            throw new InvalidCredentialsException();
        }
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            registerFailure(user, ip);
            throw new InvalidCredentialsException();
        }

        user.setFailedAttempts(0);
        user.setLockedUntil(null);
        auditService.record(user.getId(), "LOGIN_OK", "users", user.getId().toString(), ip);
        return user;
    }

    @Transactional(readOnly = true)
    public User getById(UUID id) {
        return userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }

    @Transactional
    public User changePassword(UUID userId, ChangePasswordRequest request, String ip) {
        User user = getById(userId);
        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new BusinessRuleException("La contraseña actual no es correcta");
        }
        if (passwordEncoder.matches(request.newPassword(), user.getPasswordHash())) {
            throw new BusinessRuleException("La nueva contraseña debe ser distinta de la actual");
        }
        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        user.setMustChangePassword(false);
        auditService.record(user.getId(), "PASSWORD_CHANGE", "users", user.getId().toString(), ip);
        return user;
    }

    private void registerFailure(User user, String ip) {
        int attempts = user.getFailedAttempts() + 1;
        user.setFailedAttempts(attempts);
        if (attempts >= securityProperties.maxFailedAttempts()) {
            user.setLockedUntil(OffsetDateTime.now().plusMinutes(securityProperties.lockMinutes()));
            user.setFailedAttempts(0);
            auditService.record(user.getId(), "ACCOUNT_LOCKED", "users", user.getId().toString(), ip);
        }
        auditService.record(user.getId(), "LOGIN_FAIL", "users", user.getId().toString(), ip);
    }
}
