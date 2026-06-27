package com.atelierayyur.controller;

import com.atelierayyur.config.JwtUtil;
import com.atelierayyur.repository.AdminUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private AdminUserRepository adminRepo;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtil jwtUtil;

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        var admin = adminRepo.findByUsername(request.getUsername()).orElse(null);

        if (admin == null || !passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Identifiants incorrects"));
        }

        if (!admin.getActive()) {
            return ResponseEntity.status(403)
                    .body(Map.of("error", "Compte désactivé"));
        }

        String token = jwtUtil.generateToken(admin.getUsername());

        return ResponseEntity.ok(Map.of(
            "token", token,
            "username", admin.getUsername(),
            "displayName", admin.getDisplayName() != null ? admin.getDisplayName() : admin.getUsername()
        ));
    }

    // GET /api/auth/me → vérifier le token actuel
    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String username = jwtUtil.extractUsername(token);
        return adminRepo.findByUsername(username)
                .map(admin -> ResponseEntity.ok(Map.of(
                    "username", admin.getUsername(),
                    "displayName", admin.getDisplayName() != null ? admin.getDisplayName() : username
                )))
                .orElse(ResponseEntity.notFound().build());
    }

    public static class LoginRequest {
        private String username;
        private String password;
        public String getUsername() { return username; }
        public void setUsername(String u) { this.username = u; }
        public String getPassword() { return password; }
        public void setPassword(String p) { this.password = p; }
    }
}
