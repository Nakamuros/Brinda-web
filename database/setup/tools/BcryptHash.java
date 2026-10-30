import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.io.BufferedReader;
import java.io.InputStreamReader;

/** Lee la clave por stdin (una línea) e imprime solo su hash BCrypt costo 12, el mismo encoder que usa la API. */
public class BcryptHash {
    public static void main(String[] args) throws Exception {
        String password = new BufferedReader(new InputStreamReader(System.in, java.nio.charset.StandardCharsets.UTF_8)).readLine();
        // PowerShell 5.1 antepone un BOM al pipe hacia procesos nativos: no es parte de la clave.
        if (password != null && password.startsWith("﻿")) {
            password = password.substring(1);
        }
        if (password == null || password.length() < 12) {
            System.err.println("La clave debe tener al menos 12 caracteres.");
            System.exit(1);
        }
        System.out.println(new BCryptPasswordEncoder(12).encode(password));
    }
}
