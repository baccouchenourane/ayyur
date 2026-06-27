package com.atelierayyur.repository;

import com.atelierayyur.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Toutes les commandes, plus récentes en premier
    List<Order> findAllByOrderByCreatedAtDesc();

    // Par statut
    List<Order> findByStatusOrderByCreatedAtDesc(Order.OrderStatus status);

    // Par référence
    Optional<Order> findByReference(String reference);

    // Statistiques : total par statut
    @Query("SELECT o.status, COUNT(o) FROM Order o GROUP BY o.status")
    List<Object[]> countByStatus();
}
