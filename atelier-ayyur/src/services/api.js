// api.js — Tous les appels vers le backend Spring Boot
// À placer dans src/services/api.js

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// ─── Helpers ──────────────────────────────────────────────
function getToken() {
  return localStorage.getItem("ayyur_admin_token");
}

function authHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse(res) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Erreur serveur" }));
    throw new Error(err.error || `Erreur ${res.status}`);
  }
  return res.json();
}

// ─── Produits (public) ────────────────────────────────────

/**
 * Récupère tous les produits actifs
 * @param {string} category - optionnel: "perles", "crochet", "macrame", "accessoires"
 */
export async function fetchProducts(category = null) {
  const url = category
    ? `${BASE_URL}/products?category=${category}`
    : `${BASE_URL}/products`;
  const res = await fetch(url);
  return handleResponse(res);
}

/**
 * Récupère un produit par son slug
 */
export async function fetchProduct(slug) {
  const res = await fetch(`${BASE_URL}/products/${slug}`);
  return handleResponse(res);
}

/**
 * Recherche de produits
 */
export async function searchProducts(query) {
  const res = await fetch(`${BASE_URL}/products/search?q=${encodeURIComponent(query)}`);
  return handleResponse(res);
}

/**
 * Produits en vedette (avec badge)
 */
export async function fetchFeaturedProducts() {
  const res = await fetch(`${BASE_URL}/products/featured`);
  return handleResponse(res);
}

// ─── Commandes (public) ───────────────────────────────────

/**
 * Crée une commande et retourne la réf + lien WhatsApp
 * @param {Object} orderData
 * @param {number} orderData.productId
 * @param {string} orderData.firstName
 * @param {string} orderData.lastName
 * @param {string} orderData.phone
 * @param {string} orderData.city
 * @param {string} orderData.paymentMode - "LIVRAISON" ou "VIREMENT"
 * @param {string} [orderData.colorChoice]
 * @param {string} [orderData.customerNotes]
 */
export async function createOrder(orderData) {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  return handleResponse(res);
}

// ─── Auth Admin ───────────────────────────────────────────

/**
 * Connexion admin — retourne le JWT
 */
export async function loginAdmin(username, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await handleResponse(res);
  // Sauvegarder le token
  localStorage.setItem("ayyur_admin_token", data.token);
  return data;
}

export function logoutAdmin() {
  localStorage.removeItem("ayyur_admin_token");
}

export function isAdminLoggedIn() {
  return !!getToken();
}

// ─── Admin — Commandes ────────────────────────────────────

export async function fetchOrders(status = null) {
  const url = status
    ? `${BASE_URL}/orders?status=${status}`
    : `${BASE_URL}/orders`;
  const res = await fetch(url, { headers: authHeaders() });
  return handleResponse(res);
}

export async function updateOrderStatus(orderId, status, adminNotes = null) {
  const res = await fetch(`${BASE_URL}/orders/${orderId}/status`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ status, adminNotes }),
  });
  return handleResponse(res);
}

export async function fetchOrderStats() {
  const res = await fetch(`${BASE_URL}/orders/stats`, { headers: authHeaders() });
  return handleResponse(res);
}

// ─── Admin — Produits ─────────────────────────────────────

export async function fetchAllProductsAdmin() {
  const res = await fetch(`${BASE_URL}/products/admin/all`, { headers: authHeaders() });
  return handleResponse(res);
}

export async function updateProduct(productId, data) {
  const res = await fetch(`${BASE_URL}/products/${productId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function toggleProduct(productId) {
  const res = await fetch(`${BASE_URL}/products/${productId}/toggle`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function uploadProductImage(productId, file) {
  const formData = new FormData();
  formData.append("file", file);
  const token = getToken();
  const res = await fetch(`${BASE_URL}/products/${productId}/image`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  return handleResponse(res);
}

export async function createProduct(data) {
  const res = await fetch(`${BASE_URL}/products`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}
