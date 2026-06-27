# Atelier Ayyur — Backend Spring Boot

## Prérequis
- Java 17+
- Maven 3.8+
- MySQL 8+

---

## 1. Installer MySQL (si pas encore fait)

### Sur Windows
Télécharger MySQL Installer : https://dev.mysql.com/downloads/installer/

### Sur Mac
```bash
brew install mysql
brew services start mysql
```

### Sur Ubuntu/Debian
```bash
sudo apt install mysql-server
sudo systemctl start mysql
```

---

## 2. Créer la base de données

Ouvrir MySQL en ligne de commande :
```bash
mysql -u root -p
```

Puis copier-coller le contenu de `src/main/resources/init-database.sql` :
```sql
CREATE DATABASE IF NOT EXISTS ayyur_db CHARACTER SET utf8mb4;
CREATE USER IF NOT EXISTS 'ayyur_user'@'localhost' IDENTIFIED BY 'AyyurSecret2024!';
GRANT ALL PRIVILEGES ON ayyur_db.* TO 'ayyur_user'@'localhost';
FLUSH PRIVILEGES;
```

---

## 3. Lancer le backend

```bash
cd ayyur-backend
mvn spring-boot:run
```

Au 1er démarrage, Spring Boot va :
- ✅ Créer automatiquement toutes les tables (products, orders, admin_users)
- ✅ Insérer les 15 produits initiaux
- ✅ Créer le compte admin

---

## 4. Tester l'API

### Produits (public)
```bash
# Tous les produits
curl http://localhost:8080/api/products

# Par catégorie
curl http://localhost:8080/api/products?category=perles

# Un produit par slug
curl http://localhost:8080/api/products/lumina
```

### Créer une commande (public)
```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 1,
    "firstName": "Amira",
    "lastName": "Ben Ali",
    "phone": "+216 22 123 456",
    "city": "Tunis",
    "paymentMode": "LIVRAISON",
    "customerNotes": "Couleur rosé si possible"
  }'
```

La réponse contient `whatsappUrl` → lien direct WhatsApp pré-rempli.

### Login admin
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "AyyurAdmin2024!"}'
```
Copier le `token` retourné.

### Commandes (admin)
```bash
# Lister toutes les commandes
curl http://localhost:8080/api/orders \
  -H "Authorization: Bearer VOTRE_TOKEN"

# Changer le statut
curl -X PATCH http://localhost:8080/api/orders/1/status \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "EN_COURS"}'
```

---

## 5. Connecter le frontend React

Copier `src/main/resources/api.js` dans `votre-projet-react/src/services/api.js`

Créer `.env` à la racine du projet React :
```
VITE_API_URL=http://localhost:8080/api
```

En production :
```
VITE_API_URL=https://votre-domaine.com/api
```

---

## 6. Déploiement sur Railway (gratuit)

1. Créer un compte sur https://railway.app
2. Nouveau projet → "Deploy from GitHub"
3. Ajouter un service MySQL dans Railway
4. Copier les variables d'environnement MySQL de Railway dans `application.properties`
5. Push sur GitHub → Railway déploie automatiquement

Variables d'environnement à configurer sur Railway :
```
SPRING_DATASOURCE_URL=jdbc:mysql://...railway.app:PORT/railway
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=...
APP_JWT_SECRET=VotreSecretJWTTresLong2024
APP_ADMIN_PASSWORD=VotreMotDePasseAdmin
APP_CORS_ALLOWED_ORIGINS=https://atelierayyur.com
```

---

## Statuts des commandes

| Code | Signification |
|------|--------------|
| `A_FABRIQUER` | Commande reçue, en attente de fabrication |
| `EN_COURS` | En cours de fabrication |
| `PRET` | Pièce terminée, prête à expédier |
| `EXPEDIE` | Envoyée au client |
| `LIVRE` | Livraison confirmée |
| `ANNULE` | Commande annulée |

---

## Structure du projet

```
ayyur-backend/
├── pom.xml
└── src/main/
    ├── java/com/atelierayyur/
    │   ├── AyyurApplication.java       ← Point d'entrée
    │   ├── model/
    │   │   ├── Product.java            ← Table products
    │   │   ├── Order.java              ← Table orders
    │   │   └── AdminUser.java          ← Table admin_users
    │   ├── repository/
    │   │   ├── ProductRepository.java
    │   │   ├── OrderRepository.java
    │   │   └── AdminUserRepository.java
    │   ├── controller/
    │   │   ├── ProductController.java  ← GET /api/products
    │   │   ├── OrderController.java    ← POST /api/orders
    │   │   └── AuthController.java     ← POST /api/auth/login
    │   └── config/
    │       ├── SecurityConfig.java     ← JWT + CORS
    │       ├── JwtUtil.java
    │       └── DataInitializer.java    ← Données initiales
    └── resources/
        ├── application.properties      ← Configuration
        ├── init-database.sql           ← Script MySQL
        └── api.js                      ← À copier dans React
```
