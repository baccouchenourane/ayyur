package com.atelierayyur.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Référence unique affichée ex: AY-2024-0001
    @Column(unique = true, length = 20)
    private String reference;

    // ─── Produit commandé ─────────────────────────────────
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    // Prix au moment de la commande (snapshot)
    @Column(precision = 10, scale = 2)
    private BigDecimal priceAtOrder;

    // Couleur choisie
    @Column(length = 50)
    private String colorChoice;

    // ─── Informations client ──────────────────────────────
    @NotBlank(message = "Le nom est obligatoire")
    @Column(nullable = false, length = 100)
    private String lastName;

    @NotBlank(message = "Le prénom est obligatoire")
    @Column(nullable = false, length = 100)
    private String firstName;

    @NotBlank(message = "Le téléphone est obligatoire")
    @Column(nullable = false, length = 30)
    private String phone;

    @Column(length = 100)
    private String city;

    @Column(length = 200)
    private String email;

    // ─── Paiement ─────────────────────────────────────────
    // "LIVRAISON" ou "VIREMENT"
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PaymentMode paymentMode = PaymentMode.LIVRAISON;

    // ─── Statut ───────────────────────────────────────────
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private OrderStatus status = OrderStatus.A_FABRIQUER;

    // Notes libres du client
    @Column(columnDefinition = "TEXT")
    private String customerNotes;

    // Notes internes (admin seulement)
    @Column(columnDefinition = "TEXT")
    private String adminNotes;

    @Column(updatable = false, nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        // Génération de référence
        if (reference == null) {
            reference = "AY-" + java.time.Year.now().getValue()
                    + "-" + String.format("%04d", (int)(Math.random() * 9999));
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // ─── Enums ────────────────────────────────────────────
    public enum PaymentMode {
        LIVRAISON, VIREMENT
    }

    public enum OrderStatus {
        A_FABRIQUER,
        EN_COURS,
        PRET,
        EXPEDIE,
        LIVRE,
        ANNULE
    }
}
