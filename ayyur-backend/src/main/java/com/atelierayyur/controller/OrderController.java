package com.atelierayyur.controller;

import com.atelierayyur.model.Order;
import com.atelierayyur.model.Product;
import com.atelierayyur.repository.OrderRepository;
import com.atelierayyur.repository.ProductRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private ProductRepository productRepo;

    // Numéro WhatsApp de l'atelier (sans le +)
    private static final String WHATSAPP_NUMBER = "21622814969";

    // ─── PUBLIC ───────────────────────────────────────────

    // POST /api/orders → créer une commande
    @PostMapping
    public ResponseEntity<?> createOrder(@Valid @RequestBody OrderRequest request) {

        // 1. Vérifier que le produit existe
        Product product = productRepo.findById(request.getProductId())
                .orElse(null);
        if (product == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Produit introuvable"));
        }

        // 2. Créer la commande
        Order order = new Order();
        order.setProduct(product);
        order.setPriceAtOrder(product.getPrice());
        order.setColorChoice(request.getColorChoice());
        order.setLastName(request.getLastName());
        order.setFirstName(request.getFirstName());
        order.setPhone(request.getPhone());
        order.setCity(request.getCity());
        order.setEmail(request.getEmail());
        order.setPaymentMode(request.getPaymentMode());
        order.setCustomerNotes(request.getCustomerNotes());

        Order saved = orderRepo.save(order);

        // 3. Générer le lien WhatsApp
        String whatsappUrl = buildWhatsappUrl(saved, product);

        // 4. Réponse
        Map<String, Object> response = new HashMap<>();
        response.put("id", saved.getId());
        response.put("reference", saved.getReference());
        response.put("productName", product.getName());
        response.put("priceAtOrder", saved.getPriceAtOrder());
        response.put("status", saved.getStatus());
        response.put("paymentMode", saved.getPaymentMode());
        response.put("createdAt", saved.getCreatedAt());
        response.put("whatsappUrl", whatsappUrl);

        // RIB si virement
        if (saved.getPaymentMode() == Order.PaymentMode.VIREMENT) {
            response.put("bankDetails", Map.of(
                "bank", "Attijari Bank Tunisie",
                "rib", "01 234 5678901234567890 12",
                "beneficiary", "Atelier Ayyur",
                "reference", saved.getReference()
            ));
        }

        return ResponseEntity.ok(response);
    }

    // ─── ADMIN (protégé JWT) ──────────────────────────────

    // GET /api/orders → toutes les commandes
    @GetMapping
    public List<Order> getAllOrders(
            @RequestParam(required = false) String status) {
        if (status != null) {
            try {
                return orderRepo.findByStatusOrderByCreatedAtDesc(
                        Order.OrderStatus.valueOf(status.toUpperCase()));
            } catch (IllegalArgumentException e) {
                return orderRepo.findAllByOrderByCreatedAtDesc();
            }
        }
        return orderRepo.findAllByOrderByCreatedAtDesc();
    }

    // GET /api/orders/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrder(@PathVariable Long id) {
        return orderRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // PATCH /api/orders/{id}/status → changer le statut
    @PatchMapping("/{id}/status")
    public ResponseEntity<Order> updateStatus(@PathVariable Long id,
                                               @RequestBody StatusUpdateRequest request) {
        return orderRepo.findById(id).map(order -> {
            order.setStatus(request.getStatus());
            if (request.getAdminNotes() != null) {
                order.setAdminNotes(request.getAdminNotes());
            }
            return ResponseEntity.ok(orderRepo.save(order));
        }).orElse(ResponseEntity.notFound().build());
    }

    // GET /api/orders/stats → statistiques pour le dashboard
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", orderRepo.count());
        stats.put("byStatus", orderRepo.countByStatus());

        // CA total
        BigDecimal revenue = orderRepo.findAll().stream()
                .filter(o -> o.getStatus() != Order.OrderStatus.ANNULE)
                .map(o -> o.getPriceAtOrder() != null ? o.getPriceAtOrder() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.put("totalRevenue", revenue);

        return ResponseEntity.ok(stats);
    }

    // ─── Helpers ─────────────────────────────────────────

    private String buildWhatsappUrl(Order order, Product product) {
        String message = String.format(
            "🌟 *Nouvelle commande - Atelier Ayyur*\n\n" +
            "*Réf :* %s\n" +
            "*Pièce :* %s\n" +
            "*Collection :* %s\n" +
            "*Prix :* %s€\n\n" +
            "*Client :* %s %s\n" +
            "*Téléphone :* %s\n" +
            "*Ville :* %s\n" +
            "*Règlement :* %s\n" +
            "%s" +
            "\n_Envoyé depuis atelierayyur.com_",
            order.getReference(),
            product.getName(),
            product.getCollection(),
            product.getPrice().toPlainString(),
            order.getFirstName(), order.getLastName(),
            order.getPhone(),
            order.getCity(),
            order.getPaymentMode() == Order.PaymentMode.LIVRAISON
                ? "Paiement à la livraison" : "Virement bancaire",
            order.getCustomerNotes() != null && !order.getCustomerNotes().isBlank()
                ? "*Notes :* " + order.getCustomerNotes() + "\n" : ""
        );

        String encoded = URLEncoder.encode(message, StandardCharsets.UTF_8);
        return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encoded;
    }

    // ─── Inner request classes ────────────────────────────
    public static class OrderRequest {
        private Long productId;
        private String colorChoice;
        private String lastName;
        private String firstName;
        private String phone;
        private String city;
        private String email;
        private Order.PaymentMode paymentMode = Order.PaymentMode.LIVRAISON;
        private String customerNotes;

        // Getters & Setters
        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public String getColorChoice() { return colorChoice; }
        public void setColorChoice(String colorChoice) { this.colorChoice = colorChoice; }
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public Order.PaymentMode getPaymentMode() { return paymentMode; }
        public void setPaymentMode(Order.PaymentMode paymentMode) { this.paymentMode = paymentMode; }
        public String getCustomerNotes() { return customerNotes; }
        public void setCustomerNotes(String customerNotes) { this.customerNotes = customerNotes; }
    }

    public static class StatusUpdateRequest {
        private Order.OrderStatus status;
        private String adminNotes;

        public Order.OrderStatus getStatus() { return status; }
        public void setStatus(Order.OrderStatus status) { this.status = status; }
        public String getAdminNotes() { return adminNotes; }
        public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }
    }
}
