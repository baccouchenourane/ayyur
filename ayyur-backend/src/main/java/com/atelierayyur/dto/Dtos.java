package com.atelierayyur.dto;

import com.atelierayyur.model.Order;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

// ─── Requête de création de commande (client → API) ──────
@Data
class OrderRequest {
    @NotNull(message = "L'ID produit est obligatoire")
    private Long productId;

    private String colorChoice;

    @NotBlank(message = "Le nom est obligatoire")
    private String lastName;

    @NotBlank(message = "Le prénom est obligatoire")
    private String firstName;

    @NotBlank(message = "Le téléphone est obligatoire")
    @Pattern(regexp = "^[+]?[0-9\\s\\-]{8,20}$", message = "Téléphone invalide")
    private String phone;

    @NotBlank(message = "La ville est obligatoire")
    private String city;

    private String email;

    @NotNull
    private Order.PaymentMode paymentMode;

    private String customerNotes;
}

// ─── Réponse commande (API → client) ─────────────────────
@Data
@NoArgsConstructor
@AllArgsConstructor
class OrderResponse {
    private Long id;
    private String reference;
    private String productName;
    private BigDecimal priceAtOrder;
    private String firstName;
    private String lastName;
    private String phone;
    private String city;
    private Order.PaymentMode paymentMode;
    private Order.OrderStatus status;
    private String customerNotes;
    private LocalDateTime createdAt;
    // Message WhatsApp pré-rempli
    private String whatsappUrl;
}

// ─── Mise à jour statut (admin → API) ────────────────────
@Data
class OrderStatusUpdate {
    @NotNull
    private Order.OrderStatus status;
    private String adminNotes;
}

// ─── Login admin ─────────────────────────────────────────
@Data
class LoginRequest {
    @NotBlank
    private String username;
    @NotBlank
    private String password;
}

// ─── Réponse JWT ─────────────────────────────────────────
@Data
@AllArgsConstructor
class LoginResponse {
    private String token;
    private String username;
    private String displayName;
}

// ─── Réponse produit ─────────────────────────────────────
@Data
@NoArgsConstructor
@AllArgsConstructor
class ProductResponse {
    private Long id;
    private String name;
    private String slug;
    private String category;
    private String collection;
    private String subcategory;
    private BigDecimal price;
    private String description;
    private String dimensions;
    private String material;
    private String closure;
    private String craftHours;
    private String badge;
    private String imageUrl;
    private String thumbnailUrls;
    private Boolean active;
    private Integer stock;
}

// Exporte toutes les classes (package-level)
public class Dtos {
    public static Class<OrderRequest> orderRequest() { return OrderRequest.class; }
    public static Class<OrderResponse> orderResponse() { return OrderResponse.class; }
    public static Class<OrderStatusUpdate> orderStatusUpdate() { return OrderStatusUpdate.class; }
    public static Class<LoginRequest> loginRequest() { return LoginRequest.class; }
    public static Class<LoginResponse> loginResponse() { return LoginResponse.class; }
    public static Class<ProductResponse> productResponse() { return ProductResponse.class; }
}
