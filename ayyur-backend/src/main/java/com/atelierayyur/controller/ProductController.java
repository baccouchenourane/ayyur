package com.atelierayyur.controller;

import com.atelierayyur.model.Product;
import com.atelierayyur.repository.ProductRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepo;

    @Value("${app.upload.dir}")
    private String uploadDir;

    // ─── PUBLIC ───────────────────────────────────────────

    // GET /api/products → tous les produits actifs
    @GetMapping
    public List<Product> getAllProducts(
            @RequestParam(required = false) String category) {
        if (category != null && !category.isBlank()) {
            return productRepo.findByCategoryAndActiveTrueOrderByCreatedAtDesc(category);
        }
        return productRepo.findByActiveTrueOrderByCreatedAtDesc();
    }

    // GET /api/products/featured → produits avec badge
    @GetMapping("/featured")
    public List<Product> getFeaturedProducts() {
        return productRepo.findByBadgeNotNullAndActiveTrueOrderByCreatedAtDesc();
    }

    // GET /api/products/{slug} → fiche produit par slug
    @GetMapping("/{slug}")
    public ResponseEntity<Product> getProductBySlug(@PathVariable String slug) {
        return productRepo.findBySlugAndActiveTrue(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/products/search?q=lumina
    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam String q) {
        return productRepo.searchByName(q);
    }

    // ─── ADMIN (protégé par JWT) ──────────────────────────

    // GET /api/products/admin/all → tous les produits (y compris masqués)
    @GetMapping("/admin/all")
    public List<Product> getAllForAdmin() {
        return productRepo.findAll();
    }

    // POST /api/products → créer un produit
    @PostMapping
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) {
        return ResponseEntity.ok(productRepo.save(product));
    }

    // PUT /api/products/{id} → mettre à jour
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id,
                                                   @Valid @RequestBody Product updated) {
        return productRepo.findById(id).map(product -> {
            product.setName(updated.getName());
            product.setSubcategory(updated.getSubcategory());
            product.setPrice(updated.getPrice());
            product.setDescription(updated.getDescription());
            product.setDimensions(updated.getDimensions());
            product.setMaterial(updated.getMaterial());
            product.setClosure(updated.getClosure());
            product.setCraftHours(updated.getCraftHours());
            product.setBadge(updated.getBadge());
            product.setActive(updated.getActive());
            product.setStock(updated.getStock());
            return ResponseEntity.ok(productRepo.save(product));
        }).orElse(ResponseEntity.notFound().build());
    }

    // PATCH /api/products/{id}/toggle → activer/masquer
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Product> toggleProduct(@PathVariable Long id) {
        return productRepo.findById(id).map(product -> {
            product.setActive(!product.getActive());
            return ResponseEntity.ok(productRepo.save(product));
        }).orElse(ResponseEntity.notFound().build());
    }

    // POST /api/products/{id}/image → upload photo
    @PostMapping("/{id}/image")
    public ResponseEntity<String> uploadImage(@PathVariable Long id,
                                               @RequestParam("file") MultipartFile file) {
        return productRepo.findById(id).map(product -> {
            try {
                Path uploadPath = Paths.get(uploadDir);
                Files.createDirectories(uploadPath);

                String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
                Path filePath = uploadPath.resolve(filename);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                product.setImageUrl("/uploads/products/" + filename);
                productRepo.save(product);

                return ResponseEntity.ok("/uploads/products/" + filename);
            } catch (IOException e) {
                return ResponseEntity.internalServerError().<String>body("Erreur upload : " + e.getMessage());
            }
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/products/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        if (!productRepo.existsById(id)) return ResponseEntity.notFound().build();
        productRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
