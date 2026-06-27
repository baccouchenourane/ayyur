package com.atelierayyur.repository;

import com.atelierayyur.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Tous les produits actifs
    List<Product> findByActiveTrueOrderByCreatedAtDesc();

    // Filtrer par catégorie (actifs seulement)
    List<Product> findByCategoryAndActiveTrueOrderByCreatedAtDesc(String category);

    // Par slug (URL)
    Optional<Product> findBySlugAndActiveTrue(String slug);

    // Recherche par nom
    @Query("SELECT p FROM Product p WHERE p.active = true AND " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Product> searchByName(String query);

    // Produits avec badge
    List<Product> findByBadgeNotNullAndActiveTrueOrderByCreatedAtDesc();
}
