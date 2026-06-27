package com.atelierayyur.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nom affiché ex: "Lumina"
    @NotBlank(message = "Le nom est obligatoire")
    @Column(nullable = false, length = 100)
    private String name;

    // Slug URL ex: "lumina"
    @NotBlank
    @Column(unique = true, nullable = false, length = 100)
    private String slug;

    // Catégorie ex: "perles", "crochet", "macrame", "accessoires"
    @NotBlank
    @Column(nullable = false, length = 50)
    private String category;

    // Nom de la collection ex: "Perles de Cristal"
    @Column(length = 100)
    private String collection;

    // Sous-titre ex: "Sac besace cristal"
    @Column(length = 150)
    private String subcategory;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(columnDefinition = "TEXT")
    private String description;

    // Fiche technique
    @Column(length = 100)
    private String dimensions;

    @Column(length = 200)
    private String material;    // ex: "6 500 cristaux grade AA"

    @Column(length = 200)
    private String closure;     // ex: "Or 18k, 110 cm ajustable"

    @Column(length = 100)
    private String craftHours;  // ex: "480 heures"

    // Badge ex: "Nouveau", "Exclusif"
    @Column(length = 50)
    private String badge;

    // Chemin vers l'image principale
    @Column(length = 300)
    private String imageUrl;

    // Images secondaires (JSON array stocké en string)
    @Column(columnDefinition = "TEXT")
    private String thumbnailUrls;

    // Masqué / en rupture de stock
    @Column(nullable = false)
    private Boolean active = true;

    // Stock disponible (null = sur commande)
    private Integer stock;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
