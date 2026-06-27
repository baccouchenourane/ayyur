-- ═══════════════════════════════════════════════════════════
-- Script SQL — Atelier Ayyur
-- À exécuter UNE SEULE FOIS avant le 1er démarrage
-- ═══════════════════════════════════════════════════════════

-- 1. Créer la base
CREATE DATABASE IF NOT EXISTS ayyur_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- 2. Créer l'utilisateur dédié (plus sûr que root)
CREATE USER IF NOT EXISTS 'ayyur_user'@'localhost'
    IDENTIFIED BY 'AyyurSecret2024!';

-- 3. Donner les droits sur la base
GRANT ALL PRIVILEGES ON ayyur_db.* TO 'ayyur_user'@'localhost';
FLUSH PRIVILEGES;

-- 4. Utiliser la base
USE ayyur_db;

-- ═══════════════════════════════════════════════════════════
-- NOTE : Les tables sont créées AUTOMATIQUEMENT par Spring Boot
-- (spring.jpa.hibernate.ddl-auto=update)
-- Ce script crée juste la base et l'utilisateur.
-- ═══════════════════════════════════════════════════════════

-- Pour vérifier après démarrage de l'application :
-- SHOW TABLES;
-- SELECT * FROM products;
-- SELECT * FROM admin_users;
-- SELECT * FROM orders;
