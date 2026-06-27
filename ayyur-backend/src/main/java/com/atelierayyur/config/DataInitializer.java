package com.atelierayyur.config;

import com.atelierayyur.model.AdminUser;
import com.atelierayyur.model.Product;
import com.atelierayyur.repository.AdminUserRepository;
import com.atelierayyur.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private AdminUserRepository adminRepo;
    @Autowired private ProductRepository productRepo;
    @Autowired private PasswordEncoder passwordEncoder;

    @Value("${app.admin.username}") private String adminUsername;
    @Value("${app.admin.password}") private String adminPassword;

    @Override
    public void run(String... args) {
        // ─── Créer l'admin par défaut ──────────────────────
        if (!adminRepo.existsByUsername(adminUsername)) {
            adminRepo.save(new AdminUser(
                adminUsername,
                passwordEncoder.encode(adminPassword),
                "Administratrice Ayyur"
            ));
            System.out.println("✅ Admin créé : " + adminUsername);
        }

        // ─── Insérer les produits initiaux ─────────────────
        if (productRepo.count() == 0) {
            productRepo.saveAll(initialProducts());
            System.out.println("✅ " + productRepo.count() + " produits insérés en base");
        }
    }

    private List<Product> initialProducts() {
        return List.of(
            makeProduct("Lumina", "lumina", "perles", "Perles de Cristal",
                "Sac besace cristal", new BigDecimal("890"),
                "Lumina capture la lumière comme un prisme vivant. 6 500 perles de cristal soigneusement sélectionnées pour leur pureté créent une symphonie de reflets changeants.",
                "24 × 18 × 8 cm", "6 500 cristaux grade AA", "Or 18k, 110 cm ajustable", "480 heures", null),

            makeProduct("Aurora", "aurora", "perles", "Perles de Cristal",
                "Sac soirée cristal noir", new BigDecimal("1250"),
                "Aurora incarne la nuit étoilée. Ses cristaux noirs profonds capturent la lumière des bougies lors des dîners les plus intimes.",
                "22 × 16 × 6 cm", "8 200 cristaux noirs grade AA", "Argent 925, 95 cm", "620 heures", null),

            makeProduct("Céleste", "celeste", "perles", "Perles de Cristal",
                "Pochette cristal bleu", new BigDecimal("750"),
                "Céleste, comme le ciel à l'aube. Chaque perle bleu poudré est choisie pour sa nuance unique, créant un dégradé naturel subtil.",
                "20 × 14 × 5 cm", "5 100 cristaux bleus", "Or rosé 18k, 80 cm", "360 heures", null),

            makeProduct("Éclipse", "eclipse", "perles", "Perles de Cristal",
                "Mini sac or et cristal", new BigDecimal("1490"),
                "L'Éclipse est notre pièce la plus précieuse. Ses cristaux dorés sont certifiés et chaque sac est livré avec son certificat d'authenticité.",
                "18 × 12 × 5 cm", "9 800 cristaux dorés", "Or 24k, 120 cm", "780 heures", "Exclusif"),

            makeProduct("Stella", "stella", "perles", "Perles de Cristal",
                "Sac cabas cristal", new BigDecimal("1990"),
                "Stella, la plus généreuse de nos créations. Ce cabas en cristaux mixtes marie élégance et praticité dans des proportions royales.",
                "32 × 24 × 10 cm", "12 400 cristaux mixtes", "Cuir végétal naturel", "920 heures", null),

            makeProduct("Nova", "nova", "perles", "Perles de Cristal",
                "Sac seau cristal doré", new BigDecimal("1150"),
                "Nova réinvente la forme seau avec une explosion de cristaux dorés. Sa forme cylindrique parfaite est le fruit de 30 essais de structure.",
                "26 × 20 × 20 cm", "7 600 cristaux dorés", "Cordon soie naturelle", "540 heures", "Nouveau"),

            makeProduct("Éden", "eden", "crochet", "Crochet d'Art",
                "Sac cabas crochet laine", new BigDecimal("680"),
                "Éden est né d'un dialogue entre la laine mérinos éthiopienne et les mains de Rim. Chaque rang révèle une texture végétale envoûtante.",
                "35 × 28 × 12 cm", "Laine mérinos teintée", "Anses cuir végétal", "320 heures", null),

            makeProduct("Jardin", "jardin", "crochet", "Crochet d'Art",
                "Mini sac crochet coton", new BigDecimal("450"),
                "Jardin capture l'essence du printemps. Ses motifs floraux au crochet sont travaillés en relief, créant une surface sculpturale unique.",
                "22 × 18 × 8 cm", "Coton pima péruvien", "Chaîne dorée", "280 heures", "Nouveau"),

            makeProduct("Forêt", "foret", "crochet", "Crochet d'Art",
                "Sac soirée crochet soie", new BigDecimal("890"),
                "Forêt tisse ensemble la soie naturelle et l'art du crochet dans une pièce qui évoque la profondeur des bois anciens.",
                "24 × 16 × 6 cm", "Soie naturelle de Chine", "Or 18k", "510 heures", null),

            makeProduct("Dunes", "dunes", "macrame", "Macramé Sculptural",
                "Sac macramé lin naturel", new BigDecimal("520"),
                "Dunes sculpte le lin japonais en formes évoquant les dunes du désert. Chaque nœud est calculé pour créer un équilibre parfait.",
                "30 × 22 × 8 cm", "Lin japonais non blanchi", "Cuir tannage végétal", "390 heures", null),

            makeProduct("Roche", "roche", "macrame", "Macramé Sculptural",
                "Sac macramé corde coton", new BigDecimal("640"),
                "Roche incarne la force tranquille. 3 200 nœuds précis créent une armure textile d'une robustesse et d'une légèreté surprenantes.",
                "28 × 24 × 10 cm", "Coton macramé 5 mm", "Anses bois flotté", "460 heures", "Exclusif"),

            makeProduct("Oasis", "oasis", "macrame", "Macramé Sculptural",
                "Mini sac macramé soie", new BigDecimal("780"),
                "Oasis fusionne la douceur de la soie avec la structure du chanvre. Une réinterprétation moderne des amulettes protectrices berbères.",
                "20 × 16 × 6 cm", "Soie et chanvre mélangés", "Perles laiton brut", "420 heures", null),

            makeProduct("Bague Cristal", "bague-cristal", "accessoires", "Accessoires Signature",
                "Bague artisanale perles", new BigDecimal("180"),
                "Bague coordonnée à la collection Perles de Cristal. Chaque bague est montée à la main par Fattouma sur fil d'or.",
                "Taille unique ajustable", "Cristaux grade AA", "Fil or 18k", "12 heures", null),

            makeProduct("Bracelet Soie", "bracelet-soie", "accessoires", "Accessoires Signature",
                "Bracelet crochet soie", new BigDecimal("240"),
                "Bracelet assorti à la collection Crochet d'Art. Points de dentelle exécutés à l'aiguille la plus fine de l'atelier.",
                "18 cm ajustable", "Soie naturelle", "Fermoir or 18k", "18 heures", "Nouveau"),

            makeProduct("Collier Macramé", "collier-macrame", "accessoires", "Accessoires Signature",
                "Collier macramé lin", new BigDecimal("160"),
                "Collier ras-du-cou en macramé miniaturisé. La technique Salwa réduite à son essence la plus pure.",
                "45 cm + 10 cm rallonge", "Lin japonais et perles bois", "Fermoir laiton", "9 heures", null)
        );
    }

    private Product makeProduct(String name, String slug, String category, String collection,
                                 String subcategory, BigDecimal price, String desc,
                                 String dims, String material, String closure, String hours, String badge) {
        Product p = new Product();
        p.setName(name);
        p.setSlug(slug);
        p.setCategory(category);
        p.setCollection(collection);
        p.setSubcategory(subcategory);
        p.setPrice(price);
        p.setDescription(desc);
        p.setDimensions(dims);
        p.setMaterial(material);
        p.setClosure(closure);
        p.setCraftHours(hours);
        p.setBadge(badge);
        p.setActive(true);
        return p;
    }
}
