package com.brinda.api.config;

import com.brinda.api.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

/**
 * Última barrera: si el seed de desarrollo llegó a una base de producción (usuario admin con clave conocida),
 * la app se niega a iniciar.
 */
@Slf4j
@Component
@Profile("prod")
@RequiredArgsConstructor
public class ProdSeedGuard implements ApplicationRunner {

    static final String SEED_ADMIN_EMAIL = "admin@brinda.local";

    private final UserRepository userRepository;

    @Override
    public void run(ApplicationArguments args) {
        if (userRepository.existsByEmailIgnoreCase(SEED_ADMIN_EMAIL)) {
            log.error("ARRANQUE BLOQUEADO: la base contiene el usuario de desarrollo '{}' (clave conocida). "
                    + "Elimina los datos del seed de esta base o usa una base limpia antes de iniciar en producción.",
                    SEED_ADMIN_EMAIL);
            throw new IllegalStateException("Seed de desarrollo detectado en la base de producción");
        }
    }
}
