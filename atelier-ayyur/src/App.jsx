import { useState, useEffect, useRef } from "react";
import { fetchProducts, createOrder } from './services/api.js'

// ─── Design tokens (mirror style.css) ────────────────────────────────────────
const T = {
  bg: "#f7f5f2",
  bgWhite: "#ffffff",
  accent: "#1c1c1c",
  taupe: "#8a7f73",
  taupeLight: "#bfb8ae",
  taupeDark: "#6f6a64",
  beige: "#d8d2c9",
  textPrimary: "#1c1c1c",
  textSecondary: "#6f6a64",
  textTertiary: "#9a948c",
  border: "#e5e1db",
  fontHeading: "'Playfair Display', Georgia, serif",
  fontBody: "'Montserrat', system-ui, sans-serif",
  fontAccent: "'Cormorant Garamond', Georgia, serif",
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const PRODUCTS = [
  { id: "lumina", name: "Lumina", category: "perles", subcategory: "Sac besace cristal", price: 890, collection: "Perles de Cristal", dims: "24 × 18 × 8 cm", beads: "6 500 cristaux grade AA", chain: "Or 18k, 110 cm ajustable", badge: null, desc: "Lumina capture la lumière comme un prisme vivant. 6 500 perles de cristal soigneusement sélectionnées pour leur pureté créent une symphonie de reflets changeants.", hours: "480 heures" },
  { id: "aurora", name: "Aurora", category: "perles", subcategory: "Sac soirée cristal noir", price: 1250, collection: "Perles de Cristal", dims: "22 × 16 × 6 cm", beads: "8 200 cristaux noirs grade AA", chain: "Argent 925, 95 cm", badge: null, desc: "Aurora incarne la nuit étoilée. Ses cristaux noirs profonds capturent la lumière des bougies lors des dîners les plus intimes.", hours: "620 heures" },
  { id: "celeste", name: "Céleste", category: "perles", subcategory: "Pochette cristal bleu", price: 750, collection: "Perles de Cristal", dims: "20 × 14 × 5 cm", beads: "5 100 cristaux bleus", chain: "Or rosé 18k, 80 cm", badge: null, desc: "Céleste, comme le ciel à l'aube. Chaque perle bleu poudré est choisie pour son nuance unique, créant un dégradé naturel subtil.", hours: "360 heures" },
  { id: "eclipse", name: "Éclipse", category: "perles", subcategory: "Mini sac or et cristal", price: 1490, collection: "Perles de Cristal", dims: "18 × 12 × 5 cm", beads: "9 800 cristaux dorés", chain: "Or 24k, 120 cm", badge: "Exclusif", desc: "L'Éclipse est notre pièce la plus précieuse. Ses cristaux dorés sont certifiés et chaque sac est livré avec son certificat d'authenticité.", hours: "780 heures" },
  { id: "stella", name: "Stella", category: "perles", subcategory: "Sac cabas cristal", price: 1990, collection: "Perles de Cristal", dims: "32 × 24 × 10 cm", beads: "12 400 cristaux mixtes", chain: "Cuir végétal naturel", badge: null, desc: "Stella, la plus généreuse de nos créations. Ce cabas en cristaux mixtes marie élégance et praticité dans des proportions royales.", hours: "920 heures" },
  { id: "nova", name: "Nova", category: "perles", subcategory: "Sac seau cristal doré", price: 1150, collection: "Perles de Cristal", dims: "26 × 20 × 20 cm", beads: "7 600 cristaux dorés", chain: "Cordon soie naturelle", badge: "Nouveau", desc: "Nova réinvente la forme seau avec une explosion de cristaux dorés. Sa forme cylindrique parfaite est le fruit de 30 essais de structure.", hours: "540 heures" },
  { id: "eden", name: "Éden", category: "crochet", subcategory: "Sac cabas crochet laine", price: 680, collection: "Crochet d'Art", dims: "35 × 28 × 12 cm", beads: "Laine mérinos teintée", chain: "Anses cuir végétal", badge: null, desc: "Éden est né d'un dialogue entre la laine mérinos éthiopienne et les mains de Rim. Chaque rang révèle une texture végétale envoûtante.", hours: "320 heures" },
  { id: "jardin", name: "Jardin", category: "crochet", subcategory: "Mini sac crochet coton", price: 450, collection: "Crochet d'Art", dims: "22 × 18 × 8 cm", beads: "Coton pima péruvien", chain: "Chaîne dorée", badge: "Nouveau", desc: "Jardin capture l'essence du printemps. Ses motifs floraux au crochet sont travaillés en relief, créant une surface sculpturale unique.", hours: "280 heures" },
  { id: "foret", name: "Forêt", category: "crochet", subcategory: "Sac soirée crochet soie", price: 890, collection: "Crochet d'Art", dims: "24 × 16 × 6 cm", beads: "Soie naturelle de Chine", chain: "Or 18k", badge: null, desc: "Forêt tisse ensemble la soie naturelle et l'art du crochet dans une pièce qui évoque la profondeur des bois anciens.", hours: "510 heures" },
  { id: "dunes", name: "Dunes", category: "macrame", subcategory: "Sac macramé lin naturel", price: 520, collection: "Macramé Sculptural", dims: "30 × 22 × 8 cm", beads: "Lin japonais non blanchi", chain: "Cuir tannage végétal", badge: null, desc: "Dunes sculpte le lin japonais en formes évoquant les dunes du désert. Chaque nœud est calculé pour créer un équilibre parfait.", hours: "390 heures" },
  { id: "roche", name: "Roche", category: "macrame", subcategory: "Sac macramé corde coton", price: 640, collection: "Macramé Sculptural", dims: "28 × 24 × 10 cm", beads: "Coton macramé 5 mm", chain: "Anses bois flotté", badge: "Exclusif", desc: "Roche incarne la force tranquille. 3 200 nœuds précis créent une armure textile d'une robustesse et d'une légèreté surprenantes.", hours: "460 heures" },
  { id: "oasis", name: "Oasis", category: "macrame", subcategory: "Mini sac macramé soie", price: 780, collection: "Macramé Sculptural", dims: "20 × 16 × 6 cm", beads: "Soie et chanvre mélangés", chain: "Perles laiton brut", badge: null, desc: "Oasis fusionne la douceur de la soie avec la structure du chanvre. Une réinterprétation moderne des amulettes protectrices berbères.", hours: "420 heures" },
  { id: "bague-cristal", name: "Bague Cristal", category: "accessoires", subcategory: "Bague artisanale perles", price: 180, collection: "Accessoires Signature", dims: "Taille unique ajustable", beads: "Cristaux grade AA", chain: "Fil or 18k", badge: null, desc: "Bague coordonnée à la collection Perles de Cristal. Chaque bague est montée à la main par Fattouma sur fil d'or.", hours: "12 heures" },
  { id: "bracelet-soie", name: "Bracelet Soie", category: "accessoires", subcategory: "Bracelet crochet soie", price: 240, collection: "Accessoires Signature", dims: "18 cm ajustable", beads: "Soie naturelle", chain: "Fermoir or 18k", badge: "Nouveau", desc: "Bracelet assorti à la collection Crochet d'Art. Points de dentelle exécutés à l'aiguille la plus fine du atelier.", hours: "18 heures" },
  { id: "collier-macrame", name: "Collier Macramé", category: "accessoires", subcategory: "Collier macramé lin", price: 160, collection: "Accessoires Signature", dims: "45 cm + 10 cm rallonge", beads: "Lin japonais et perles bois", chain: "Fermoir laiton", badge: null, desc: "Collier ras-du-cou en macramé miniaturisé. La technique Salwa réduite à son essence la plus pure par les mains de Fattouma.", hours: "9 heures" },
];

const ARTISANS = [
  { name: "Amel", role: "Maître artisan • Perles de Cristal", specialty: "perles", bio: "L'aînée, perfectionniste et patiente. Amel peut passer trois jours à sélectionner les perles d'un seul sac. Sa technique d'enfilage croisé permet aux perles de capturer la lumière sous tous les angles." },
  { name: "Rim", role: "Maître artisan • Crochet d'Art", specialty: "crochet", bio: "La poète de la famille. Rim dialogue avec le fil comme d'autres écrivent des vers. Elle a appris le crochet avec sa grand-mère à l'âge de 7 ans et maîtrise 47 types de points distincts." },
  { name: "Salwa", role: "Maître artisan • Macramé Sculptural", specialty: "macrame", bio: "Architecte de formation, Salwa applique les principes de tension et d'équilibre à ses créations. Elle calcule chaque nœud comme on calcule une poutre porteuse." },
  { name: "Fattouma", role: "Maître artisan • Accessoires Signature", specialty: "accessoires", bio: "La cadette mais pas la moindre. Fattouma a l'œil absolu pour les détails. C'est elle qui finalise chaque création, vérifiant chaque couture, chaque perle, chaque nœud." },
];

// ─── Shared styles ─────────────────────────────────────────────────────────────
const S = {
  btn: {
    display: "inline-flex", alignItems: "center", gap: "0.5rem",
    padding: "0.9rem 2rem", background: T.accent, color: "#fff",
    border: "none", cursor: "pointer", fontFamily: T.fontBody,
    fontSize: "0.7rem", letterSpacing: "0.15rem", textTransform: "uppercase",
    transition: "all 0.3s ease",
  },
  btnSecondary: {
    background: "transparent", color: T.accent,
    border: `1px solid ${T.accent}`,
  },
  container: { maxWidth: "1400px", margin: "0 auto", padding: "0 3rem" },
  sectionTitle: {
    fontFamily: T.fontHeading, fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
    fontWeight: 400, color: T.textPrimary, marginBottom: "0.5rem",
  },
  label: {
    fontFamily: T.fontBody, fontSize: "0.65rem", letterSpacing: "0.15rem",
    textTransform: "uppercase", color: T.textSecondary,
  },
};

// ─── Color placeholder for product images ────────────────────────────────────
const PALETTE = {
  perles: ["#e8dfd5", "#d4c9be", "#c9b8aa", "#e0d5c8", "#d8cfc4", "#ccc0b2", "#d5ccc0", "#c4b9af", "#e5ddd3"],
  crochet: ["#d9e8d5", "#c8dcc3", "#b9d0b2", "#d5e5d0", "#c3d9bc"],
  macrame: ["#e5dcc8", "#d9d0b8", "#d0c8a8"],
  accessoires: ["#f0e8d8", "#e8dcc8", "#e0d4bc"],
};

function ProductPlaceholder({ product, size = 280 }) {
  const colors = PALETTE[product.category] || PALETTE.perles;
  const idx = PRODUCTS.findIndex(p => p.id === product.id) % colors.length;
  const bg = colors[idx];
  const initials = product.name.slice(0, 2).toUpperCase();
  return (
    <div style={{ width: "100%", height: size, background: bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
      <span style={{ fontFamily: T.fontHeading, fontSize: "2.5rem", color: T.taupeDark, opacity: 0.4 }}>{initials}</span>
      <span style={{ fontFamily: T.fontBody, fontSize: "0.6rem", letterSpacing: "0.12rem", textTransform: "uppercase", color: T.taupeDark, opacity: 0.5 }}>Atelier Ayyur</span>
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header({ page, setPage, cartCount, setCartOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const nav = [
    { label: "Accueil", key: "home" },
    { label: "Collections", key: "catalogue" },
    { label: "L'Atelier", key: "atelier" },
    { label: "Sur Mesure", key: "surmesure" },
  ];

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, width: "100%", zIndex: 1000,
      background: scrolled ? "rgba(247,245,242,0.96)" : "transparent",
      backdropFilter: scrolled ? "blur(10px)" : "none",
      borderBottom: scrolled ? `1px solid ${T.border}` : "none",
      transition: "all 0.5s ease", padding: scrolled ? "0.8rem 0" : "1.6rem 0",
    }}>
      <div style={{ ...S.container, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <button onClick={() => setPage("home")} style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
          <div style={{ fontFamily: T.fontHeading, fontSize: "1.8rem", color: T.taupe, letterSpacing: "0.2rem", lineHeight: 1 }}>AY</div>
          <div style={{ fontFamily: T.fontAccent, fontSize: "0.65rem", letterSpacing: "0.18rem", color: T.textSecondary, marginTop: "2px" }}>ATELIER AYYUR</div>
        </button>

        {/* Desktop nav */}
        <nav style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
          {nav.map(n => (
            <button key={n.key} onClick={() => setPage(n.key)} style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: T.fontBody, fontSize: "0.65rem", letterSpacing: "0.12rem",
              textTransform: "uppercase", color: page === n.key ? T.textPrimary : T.textSecondary,
              borderBottom: page === n.key ? `1px solid ${T.textPrimary}` : "1px solid transparent",
              paddingBottom: "2px", transition: "all 0.3s ease",
            }}>{n.label}</button>
          ))}
        </nav>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <button onClick={() => setPage("admin")} style={{
            background: "none", border: `1px solid ${T.border}`, cursor: "pointer",
            fontFamily: T.fontBody, fontSize: "0.6rem", letterSpacing: "0.1rem",
            textTransform: "uppercase", color: T.textSecondary, padding: "0.4rem 0.8rem",
          }}>Admin</button>
          <button onClick={() => setCartOpen(true)} style={{
            background: "none", border: "none", cursor: "pointer", position: "relative",
            fontFamily: T.fontBody, fontSize: "0.65rem", letterSpacing: "0.12rem",
            textTransform: "uppercase", color: T.textSecondary, display: "flex", alignItems: "center", gap: "0.4rem",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {cartCount > 0 && (
              <span style={{ position: "absolute", top: "-8px", right: "-8px", background: T.taupe, color: "#fff", borderRadius: "50%", width: "16px", height: "16px", fontSize: "0.6rem", display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
function HomePage({ setPage, setFilter }) {
  const featured = PRODUCTS.filter(p => p.badge || ["lumina", "roche", "eden"].includes(p.id)).slice(0, 3);
  return (
    <div>
      {/* Hero */}
      <section style={{ height: "100vh", background: T.beige, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #e8dfd5 0%, #d4c9be 50%, #c9b8aa 100%)" }} />
        <div style={{ position: "relative", textAlign: "center", padding: "0 2rem" }}>
          <div style={{ fontFamily: T.fontBody, fontSize: "0.65rem", letterSpacing: "0.3rem", textTransform: "uppercase", color: T.taupe, marginBottom: "2rem" }}>Tunis · Haute Joaillerie Textile</div>
          <h1 style={{ fontFamily: T.fontHeading, fontSize: "clamp(3rem, 8vw, 7rem)", fontWeight: 400, color: T.textPrimary, lineHeight: 1.05, marginBottom: "1.5rem" }}>
            Atelier<br /><em style={{ color: T.taupe }}>Ayyur</em>
          </h1>
          <p style={{ fontFamily: T.fontAccent, fontSize: "clamp(1rem, 2vw, 1.4rem)", color: T.textSecondary, maxWidth: "600px", margin: "0 auto 3rem", lineHeight: 1.7 }}>
            Chaque sac est une œuvre d'art unique, née de la rencontre entre un savoir-faire ancestral et l'excellence contemporaine.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => setPage("catalogue")} style={S.btn}>Explorer les collections</button>
            <button onClick={() => setPage("atelier")} style={{ ...S.btn, ...S.btnSecondary }}>L'Atelier</button>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "3rem" }}>
          {[["1872", "Heures par création"], ["25", "Exemplaires max."], ["100%", "Fait main"]].map(([n, l]) => (
            <div key={n} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: T.fontHeading, fontSize: "1.8rem", color: T.taupeDark }}>{n}</div>
              <div style={{ fontFamily: T.fontBody, fontSize: "0.6rem", letterSpacing: "0.1rem", textTransform: "uppercase", color: T.textSecondary }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Collections */}
      <section style={{ padding: "6rem 0", background: T.bg }}>
        <div style={S.container}>
          <div style={{ marginBottom: "3rem" }}>
            <div style={{ ...S.label, marginBottom: "0.5rem" }}>01 — Collections</div>
            <h2 style={S.sectionTitle}>Collections Signature</h2>
            <p style={{ fontFamily: T.fontAccent, fontSize: "1.1rem", color: T.textSecondary }}>Pièces uniques, héritages éternels</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0" }}>
            {[
              { key: "perles", label: "Perles de Cristal", sub: "La lumière capturée dans chaque facette", stats: ["5 000+ perles", "2 artisans", "3 mois"] },
              { key: "crochet", label: "Crochet d'Art", sub: "Poésie textile, architecture souple", stats: ["Laine & soie", "420 heures"] },
              { key: "macrame", label: "Macramé Sculptural", sub: "Équilibre parfait, force délicate", stats: ["Lin japonais", "3 200 nœuds"] },
            ].map(c => (
              <button key={c.key} onClick={() => { setFilter(c.key); setPage("catalogue"); }} style={{
                position: "relative", background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left", overflow: "hidden",
              }}>
                <div style={{ height: "480px", background: { perles: "#e8dfd5", crochet: "#d9e8d5", macrame: "#e5dcc8" }[c.key], display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.6s ease" }}>
                  <span style={{ fontFamily: T.fontHeading, fontSize: "5rem", color: T.taupeDark, opacity: 0.15 }}>{c.label.slice(0, 1)}</span>
                </div>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "2rem", background: "linear-gradient(transparent, rgba(28,28,28,0.7))" }}>
                  <h3 style={{ fontFamily: T.fontHeading, fontSize: "1.4rem", color: "#fff", fontWeight: 400, marginBottom: "0.3rem" }}>{c.label}</h3>
                  <p style={{ fontFamily: T.fontAccent, fontSize: "0.95rem", color: "rgba(255,255,255,0.8)", marginBottom: "0.8rem" }}>{c.sub}</p>
                  <div style={{ display: "flex", gap: "0.8rem" }}>
                    {c.stats.map(s => <span key={s} style={{ fontFamily: T.fontBody, fontSize: "0.55rem", letterSpacing: "0.1rem", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>{s}</span>)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section style={{ padding: "6rem 0", background: T.bgWhite }}>
        <div style={S.container}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem" }}>
            <div>
              <div style={{ ...S.label, marginBottom: "0.5rem" }}>02 — Sélection</div>
              <h2 style={S.sectionTitle}>Pièces du Moment</h2>
            </div>
            <button onClick={() => setPage("catalogue")} style={{ ...S.btn, ...S.btnSecondary, fontSize: "0.6rem" }}>Voir tout</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
            {featured.map(p => <ProductCard key={p.id} product={p} onView={() => {}} compact />)}
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: "6rem 0", background: T.bg }}>
        <div style={S.container}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div style={{ ...S.label, marginBottom: "0.5rem" }}>04 — Nos Valeurs</div>
            <h2 style={S.sectionTitle}>Les Piliers Ayyur</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2rem" }}>
            {[
              ["01", "Excellence Artisanale", "400 à 3 000 heures de travail manuel par création."],
              ["02", "Rareté Absolue", "25 exemplaires numérotés par collection."],
              ["03", "Transparence Totale", "Chaque matériau tracé jusqu'à son origine."],
              ["04", "Héritage Durable", "Certificat d'authenticité et restauration à vie."],
            ].map(([n, t, d]) => (
              <div key={n} style={{ padding: "2rem", borderTop: `1px solid ${T.border}` }}>
                <div style={{ fontFamily: T.fontAccent, fontSize: "3rem", color: T.beige, lineHeight: 1, marginBottom: "1rem" }}>{n}</div>
                <h3 style={{ fontFamily: T.fontHeading, fontSize: "1.1rem", fontWeight: 400, marginBottom: "0.8rem" }}>{t}</h3>
                <p style={{ fontFamily: T.fontBody, fontSize: "0.8rem", color: T.textSecondary, lineHeight: 1.7 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, onView, addToCart, compact }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ position: "relative", cursor: "pointer" }}
      onClick={() => onView && onView(product)}>
      <div style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ transform: hovered ? "scale(1.04)" : "scale(1)", transition: "transform 0.6s ease" }}>
          <ProductPlaceholder product={product} size={compact ? 260 : 320} />
        </div>
        {product.badge && (
          <div style={{ position: "absolute", top: "1rem", left: "1rem", background: product.badge === "Exclusif" ? T.accent : T.taupe, color: "#fff", fontFamily: T.fontBody, fontSize: "0.55rem", letterSpacing: "0.12rem", textTransform: "uppercase", padding: "0.3rem 0.7rem" }}>
            {product.badge}
          </div>
        )}
        {hovered && addToCart && (
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1rem", background: "rgba(28,28,28,0.85)", display: "flex", gap: "0.5rem" }}>
            <button onClick={e => { e.stopPropagation(); addToCart(product); }} style={{ ...S.btn, flex: 1, justifyContent: "center", padding: "0.7rem", fontSize: "0.6rem" }}>Commander</button>
          </div>
        )}
      </div>
      <div style={{ padding: "1.2rem 0 0" }}>
        <h3 style={{ fontFamily: T.fontHeading, fontSize: "1.1rem", fontWeight: 400, marginBottom: "0.2rem" }}>{product.name}</h3>
        <p style={{ fontFamily: T.fontBody, fontSize: "0.7rem", color: T.textSecondary, marginBottom: "0.5rem" }}>{product.subcategory}</p>
        <div style={{ fontFamily: T.fontAccent, fontSize: "1.1rem", color: T.textPrimary }}>{product.price.toLocaleString("fr-FR")}€</div>
      </div>
    </div>
  );
}

// ─── Catalogue Page ───────────────────────────────────────────────────────────
function CataloguePage({ addToCart, setSelectedProduct, filter, setFilter }) {
  const [sort, setSort] = useState("default");
  const cats = ["all", "perles", "crochet", "macrame", "accessoires"];
  const labels = { all: "Tous", perles: "Perles de Cristal", crochet: "Crochet d'Art", macrame: "Macramé Sculptural", accessoires: "Accessoires" };

  let products = filter === "all" ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);
  if (sort === "asc") products = [...products].sort((a, b) => a.price - b.price);
  if (sort === "desc") products = [...products].sort((a, b) => b.price - a.price);

  return (
    <div style={{ paddingTop: "100px", background: T.bg, minHeight: "100vh" }}>
      <div style={{ padding: "3rem 0 2rem", borderBottom: `1px solid ${T.border}` }}>
        <div style={S.container}>
          <div style={{ ...S.label, marginBottom: "0.5rem" }}>Collections</div>
          <h1 style={{ ...S.sectionTitle, marginBottom: 0 }}>Nos Créations</h1>
        </div>
      </div>
      {/* Filters */}
      <div style={{ borderBottom: `1px solid ${T.border}`, background: T.bgWhite, position: "sticky", top: "70px", zIndex: 100 }}>
        <div style={{ ...S.container, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 3rem" }}>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {cats.map(c => (
              <button key={c} onClick={() => setFilter(c)} style={{
                background: filter === c ? T.accent : "transparent",
                color: filter === c ? "#fff" : T.textSecondary,
                border: `1px solid ${filter === c ? T.accent : T.border}`,
                padding: "0.4rem 1rem", cursor: "pointer",
                fontFamily: T.fontBody, fontSize: "0.6rem", letterSpacing: "0.1rem", textTransform: "uppercase",
                transition: "all 0.2s ease",
              }}>{labels[c]}</button>
            ))}
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ fontFamily: T.fontBody, fontSize: "0.65rem", border: `1px solid ${T.border}`, background: T.bgWhite, padding: "0.4rem 0.8rem", color: T.textSecondary, cursor: "pointer" }}>
            <option value="default">Trier par</option>
            <option value="asc">Prix croissant</option>
            <option value="desc">Prix décroissant</option>
          </select>
        </div>
      </div>
      {/* Grid */}
      <div style={S.container}>
        <div style={{ padding: "3rem 0", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "3rem 2rem" }}>
          {products.map(p => (
            <ProductCard key={p.id} product={p} onView={setSelectedProduct} addToCart={addToCart} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Product Detail Modal ─────────────────────────────────────────────────────
function ProductDetailModal({ product, onClose, addToCart, setOrderProduct }) {
  const [color, setColor] = useState(0);
  const colors = [{ label: "Naturel", bg: "#f5f0e8" }, { label: "Rosé", bg: "#d8b4a0" }, { label: "Argent", bg: "#c0c0c0" }];
  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(28,28,28,0.6)", zIndex: 2000, overflow: "auto" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.bgWhite, maxWidth: "1000px", margin: "4rem auto", minHeight: "80vh" }}>
        {/* Breadcrumb */}
        <div style={{ padding: "1.2rem 2.5rem", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: T.fontBody, fontSize: "0.65rem", color: T.textSecondary, letterSpacing: "0.08rem" }}>
            Collections / {product.collection} / <span style={{ color: T.textPrimary }}>{product.name}</span>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", color: T.textSecondary }}>✕</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0" }}>
          {/* Gallery */}
          <div style={{ padding: "2rem" }}>
            <ProductPlaceholder product={product} size={380} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem", marginTop: "0.8rem" }}>
              {[0, 1, 2, 3].map(i => (
                <div key={i} style={{ height: "70px", background: PALETTE[product.category][(i + 1) % PALETTE[product.category].length], opacity: i === 0 ? 1 : 0.6, cursor: "pointer", border: i === 0 ? `2px solid ${T.accent}` : "none" }} />
              ))}
            </div>
          </div>

          {/* Info */}
          <div style={{ padding: "2.5rem 2.5rem 2.5rem 2rem", borderLeft: `1px solid ${T.border}` }}>
            <h1 style={{ fontFamily: T.fontHeading, fontSize: "2.2rem", fontWeight: 400, marginBottom: "0.3rem" }}>{product.name}</h1>
            <p style={{ fontFamily: T.fontAccent, fontSize: "1rem", color: T.textSecondary, marginBottom: "1.5rem" }}>{product.subcategory}</p>
            <div style={{ fontFamily: T.fontHeading, fontSize: "2rem", color: T.textPrimary, marginBottom: "1.5rem" }}>{product.price.toLocaleString("fr-FR")}€</div>
            <p style={{ fontFamily: T.fontBody, fontSize: "0.82rem", color: T.textSecondary, lineHeight: 1.8, marginBottom: "1.5rem" }}>{product.desc}</p>

            {/* Specs */}
            <div style={{ borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: "1rem 0", marginBottom: "1.5rem" }}>
              {[["Dimensions", product.dims], ["Matière", product.beads], ["Fermeture", product.chain], ["Temps de création", product.hours]].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "0.4rem 0" }}>
                  <span style={{ fontFamily: T.fontBody, fontSize: "0.7rem", letterSpacing: "0.08rem", color: T.textSecondary, textTransform: "uppercase" }}>{l}</span>
                  <span style={{ fontFamily: T.fontBody, fontSize: "0.78rem", color: T.textPrimary }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Color */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ ...S.label, marginBottom: "0.8rem" }}>Couleur — {colors[color].label}</div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {colors.map((c, i) => (
                  <button key={i} onClick={() => setColor(i)} style={{
                    width: "28px", height: "28px", borderRadius: "50%", background: c.bg, cursor: "pointer",
                    border: color === i ? `2px solid ${T.accent}` : `1px solid ${T.border}`,
                    padding: 0, outline: "none",
                  }} />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              <button onClick={() => { setOrderProduct(product); onClose(); }} style={{ ...S.btn, justifyContent: "center", width: "100%" }}>
                Commander cette pièce
              </button>
              <button onClick={() => addToCart(product)} style={{ ...S.btn, ...S.btnSecondary, justifyContent: "center", width: "100%" }}>
                Ajouter au panier
              </button>
            </div>

            {/* Delivery */}
            <div style={{ marginTop: "1.2rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <p style={{ fontFamily: T.fontBody, fontSize: "0.7rem", color: T.textSecondary }}>🚚 Livraison offerte sous 2–3 semaines</p>
              <p style={{ fontFamily: T.fontBody, fontSize: "0.7rem", color: T.textSecondary }}>↩ Retour possible sous 14 jours</p>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div style={{ padding: "2.5rem", borderTop: `1px solid ${T.border}` }}>
            <h3 style={{ fontFamily: T.fontHeading, fontSize: "1.3rem", fontWeight: 400, marginBottom: "2rem" }}>Vous aimerez aussi</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
              {related.map(p => <ProductCard key={p.id} product={p} compact />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Order Modal ──────────────────────────────────────────────────────────────
function OrderModal({ product, onClose, onSuccess }) {
  const [step, setStep] = useState(1); // 1=form, 2=confirm
  const [form, setForm] = useState({ nom: "", prenom: "", tel: "", ville: "", mode: "livraison", notes: "" });
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!form.nom.trim()) e.nom = "Requis";
    if (!form.prenom.trim()) e.prenom = "Requis";
    if (!form.tel.trim()) e.tel = "Requis";
    if (!form.ville.trim()) e.ville = "Requis";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit() {
    if (!validate()) return;
    setStep(2);
  }

  function confirm() {
    const msg = encodeURIComponent(
      `🌟 *Nouvelle commande - Atelier Ayyur*\n\n` +
      `*Pièce :* ${product.name}\n` +
      `*Collection :* ${product.collection}\n` +
      `*Prix :* ${product.price.toLocaleString("fr-FR")}€\n\n` +
      `*Client :* ${form.prenom} ${form.nom}\n` +
      `*Téléphone :* ${form.tel}\n` +
      `*Ville :* ${form.ville}\n` +
      `*Mode de paiement :* ${form.mode === "livraison" ? "Paiement à la livraison" : "Virement bancaire"}\n` +
      (form.notes ? `*Notes :* ${form.notes}\n` : "") +
      `\n_Envoyé depuis atelierayyur.com_`
    );
    window.open(`https://wa.me/21622814969?text=${msg}`, "_blank");
    onSuccess({ ...form, product });
    onClose();
  }

  const inputStyle = {
    width: "100%", padding: "0.8rem 1rem", border: `1px solid ${T.border}`,
    fontFamily: T.fontBody, fontSize: "0.82rem", background: T.bgWhite,
    color: T.textPrimary, outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(28,28,28,0.7)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.bgWhite, width: "100%", maxWidth: "560px", maxHeight: "90vh", overflow: "auto" }}>
        {/* Header */}
        <div style={{ padding: "2rem 2rem 1rem", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ ...S.label, marginBottom: "0.3rem" }}>{step === 1 ? "Initier ma commande" : "Confirmation"}</div>
            <h2 style={{ fontFamily: T.fontHeading, fontSize: "1.6rem", fontWeight: 400 }}>{product.name}</h2>
            <p style={{ fontFamily: T.fontAccent, fontSize: "1.1rem", color: T.taupe }}>{product.price.toLocaleString("fr-FR")}€</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", color: T.textSecondary }}>✕</button>
        </div>

        {step === 1 ? (
          <div style={{ padding: "2rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              {[["nom", "Nom *"], ["prenom", "Prénom *"]].map(([k, l]) => (
                <div key={k}>
                  <label style={{ ...S.label, display: "block", marginBottom: "0.4rem" }}>{l}</label>
                  <input value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                    style={{ ...inputStyle, borderColor: errors[k] ? "#c0392b" : T.border }} />
                  {errors[k] && <span style={{ fontFamily: T.fontBody, fontSize: "0.65rem", color: "#c0392b" }}>{errors[k]}</span>}
                </div>
              ))}
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ ...S.label, display: "block", marginBottom: "0.4rem" }}>Téléphone *</label>
              <input value={form.tel} onChange={e => setForm(f => ({ ...f, tel: e.target.value }))}
                placeholder="+216 XX XXX XXX"
                style={{ ...inputStyle, borderColor: errors.tel ? "#c0392b" : T.border }} />
              {errors.tel && <span style={{ fontFamily: T.fontBody, fontSize: "0.65rem", color: "#c0392b" }}>{errors.tel}</span>}
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ ...S.label, display: "block", marginBottom: "0.4rem" }}>Ville *</label>
              <input value={form.ville} onChange={e => setForm(f => ({ ...f, ville: e.target.value }))}
                placeholder="Tunis, Sfax, Sousse..."
                style={{ ...inputStyle, borderColor: errors.ville ? "#c0392b" : T.border }} />
              {errors.ville && <span style={{ fontFamily: T.fontBody, fontSize: "0.65rem", color: "#c0392b" }}>{errors.ville}</span>}
            </div>

            {/* Payment */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ ...S.label, marginBottom: "0.8rem" }}>Mode de règlement</div>
              {[["livraison", "Paiement à la livraison (espèces)"], ["virement", "Virement bancaire"]].map(([v, l]) => (
                <label key={v} style={{ display: "flex", alignItems: "center", gap: "0.8rem", padding: "0.9rem 1rem", border: `1px solid ${form.mode === v ? T.accent : T.border}`, marginBottom: "0.5rem", cursor: "pointer", background: form.mode === v ? "#faf9f7" : T.bgWhite }}>
                  <input type="radio" name="mode" value={v} checked={form.mode === v} onChange={() => setForm(f => ({ ...f, mode: v }))} />
                  <span style={{ fontFamily: T.fontBody, fontSize: "0.78rem" }}>{l}</span>
                </label>
              ))}
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <label style={{ ...S.label, display: "block", marginBottom: "0.4rem" }}>Notes (optionnel)</label>
              <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                rows={3} placeholder="Personnalisation, couleur souhaitée..."
                style={{ ...inputStyle, resize: "vertical" }} />
            </div>

            <button onClick={submit} style={{ ...S.btn, width: "100%", justifyContent: "center" }}>
              Valider ma commande →
            </button>
          </div>
        ) : (
          <div style={{ padding: "2rem" }}>
            {/* Summary */}
            <div style={{ background: "#faf9f7", border: `1px solid ${T.border}`, padding: "1.5rem", marginBottom: "1.5rem" }}>
              <div style={{ ...S.label, marginBottom: "1rem" }}>Récapitulatif de commande</div>
              {[["Pièce", product.name], ["Collection", product.collection], ["Prix", `${product.price.toLocaleString("fr-FR")}€`], ["Client", `${form.prenom} ${form.nom}`], ["Téléphone", form.tel], ["Ville", form.ville], ["Règlement", form.mode === "livraison" ? "À la livraison" : "Virement"]].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "0.4rem 0", borderBottom: `1px solid ${T.border}` }}>
                  <span style={{ fontFamily: T.fontBody, fontSize: "0.7rem", color: T.textSecondary }}>{l}</span>
                  <span style={{ fontFamily: T.fontBody, fontSize: "0.78rem", color: T.textPrimary, fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>

            {form.mode === "virement" && (
              <div style={{ background: "#f7f5f0", border: `1px solid ${T.beige}`, padding: "1.2rem", marginBottom: "1.5rem" }}>
                <div style={{ ...S.label, marginBottom: "0.5rem" }}>Coordonnées bancaires</div>
                <p style={{ fontFamily: T.fontBody, fontSize: "0.75rem", color: T.textSecondary, lineHeight: 1.7 }}>
                  Banque : Attijari Bank Tunisie<br />
                  RIB : 01 234 5678901234567890 12<br />
                  Bénéficiaire : Atelier Ayyur
                </p>
              </div>
            )}

            <p style={{ fontFamily: T.fontBody, fontSize: "0.75rem", color: T.textSecondary, marginBottom: "1.5rem", lineHeight: 1.7 }}>
              En confirmant, vous serez redirigé(e) vers WhatsApp pour finaliser votre commande avec notre équipe.
            </p>

            <div style={{ display: "flex", gap: "0.8rem" }}>
              <button onClick={() => setStep(1)} style={{ ...S.btn, ...S.btnSecondary, flex: 1, justifyContent: "center", padding: "0.8rem" }}>Modifier</button>
              <button onClick={confirm} style={{ ...S.btn, flex: 2, justifyContent: "center", background: "#25D366" }}>
                ✅ Confirmer via WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Cart Panel ───────────────────────────────────────────────────────────────
function CartPanel({ cart, onClose, onRemove, setOrderProduct }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width: "420px",
        background: T.bgWhite, boxShadow: "-4px 0 20px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column",
      }}>
        <div style={{ padding: "2rem", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ ...S.label, marginBottom: "0.2rem" }}>Votre sélection</div>
            <h2 style={{ fontFamily: T.fontHeading, fontSize: "1.4rem", fontWeight: 400 }}>Panier ({cart.reduce((s, i) => s + i.qty, 0)})</h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", color: T.textSecondary }}>✕</button>
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: "1.5rem 2rem" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 0", color: T.textTertiary }}>
              <p style={{ fontFamily: T.fontAccent, fontSize: "1.2rem" }}>Votre panier est vide</p>
            </div>
          ) : cart.map(item => (
            <div key={item.id} style={{ display: "flex", gap: "1rem", padding: "1rem 0", borderBottom: `1px solid ${T.border}` }}>
              <div style={{ width: "80px", height: "80px", flexShrink: 0, background: PALETTE[item.category]?.[0] || T.beige, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: T.fontHeading, fontSize: "1.2rem", color: T.taupeDark, opacity: 0.4 }}>{item.name.slice(0, 2)}</span>
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontFamily: T.fontHeading, fontSize: "1rem", fontWeight: 400, marginBottom: "0.2rem" }}>{item.name}</h4>
                <p style={{ fontFamily: T.fontBody, fontSize: "0.7rem", color: T.textSecondary }}>{item.subcategory}</p>
                <div style={{ fontFamily: T.fontAccent, fontSize: "1rem", marginTop: "0.3rem" }}>{item.price.toLocaleString("fr-FR")}€</div>
              </div>
              <button onClick={() => onRemove(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: T.textTertiary, fontSize: "1rem", alignSelf: "flex-start" }}>✕</button>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div style={{ padding: "1.5rem 2rem", borderTop: `1px solid ${T.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
              <span style={{ fontFamily: T.fontBody, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1rem", color: T.textSecondary }}>Total estimé</span>
              <span style={{ fontFamily: T.fontHeading, fontSize: "1.3rem" }}>{total.toLocaleString("fr-FR")}€</span>
            </div>
            <p style={{ fontFamily: T.fontBody, fontSize: "0.68rem", color: T.textTertiary, marginBottom: "1rem", lineHeight: 1.6 }}>
              Le paiement s'effectue à la livraison ou par virement. Chaque pièce sera confirmée avec vous avant fabrication.
            </p>
            <button onClick={() => {
              if (cart[0]) { setOrderProduct(cart[0]); onClose(); }
            }} style={{ ...S.btn, width: "100%", justifyContent: "center" }}>
              Commander maintenant
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Atelier Page ─────────────────────────────────────────────────────────────
function AtelierPage() {
  return (
    <div style={{ paddingTop: "100px", background: T.bg, minHeight: "100vh" }}>
      {/* Hero */}
      <section style={{ height: "60vh", background: T.beige, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <div>
          <div style={{ ...S.label, marginBottom: "1rem" }}>L'Atelier</div>
          <h1 style={{ fontFamily: T.fontHeading, fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 400, marginBottom: "1rem" }}>L'Atelier Ayyur</h1>
          <p style={{ fontFamily: T.fontAccent, fontSize: "1.3rem", color: T.textSecondary }}>Là où la matière devient émotion</p>
        </div>
      </section>

      {/* Intro */}
      <section style={{ padding: "5rem 0", background: T.bgWhite }}>
        <div style={{ ...S.container, maxWidth: "800px" }}>
          <h2 style={{ ...S.sectionTitle, marginBottom: "1.5rem" }}>Un atelier, quatre sœurs</h2>
          <p style={{ fontFamily: T.fontAccent, fontSize: "1.15rem", color: T.textSecondary, lineHeight: 1.9, marginBottom: "1rem" }}>
            Au cœur de Tunis, dans un atelier baigné de lumière naturelle, quatre sœurs perpétuent un art ancestral tout en réinventant le sac moderne. Ici, pas de machines bruyantes, seulement le cliquetis des perles et le froissement des fils.
          </p>
          <p style={{ fontFamily: T.fontAccent, fontSize: "1.15rem", color: T.textSecondary, lineHeight: 1.9 }}>
            Amel, Rim, Salwa et Fattouma : quatre visions, une seule signature.
          </p>
        </div>
      </section>

      {/* Artisans */}
      <section style={{ padding: "5rem 0", background: T.bg }}>
        <div style={S.container}>
          <div style={{ ...S.label, marginBottom: "0.5rem" }}>Les Mains</div>
          <h2 style={{ ...S.sectionTitle, marginBottom: "3rem" }}>Derrière les Créations</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2rem" }}>
            {ARTISANS.map(a => (
              <div key={a.name} style={{ background: T.bgWhite, padding: "2rem" }}>
                <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: { perles: "#e8dfd5", crochet: "#d9e8d5", macrame: "#e5dcc8", accessoires: "#f0e8d8" }[a.specialty], display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                  <span style={{ fontFamily: T.fontHeading, fontSize: "1.8rem", color: T.taupeDark, opacity: 0.5 }}>{a.name[0]}</span>
                </div>
                <h3 style={{ fontFamily: T.fontHeading, fontSize: "1.4rem", fontWeight: 400, marginBottom: "0.3rem" }}>{a.name}</h3>
                <p style={{ fontFamily: T.fontBody, fontSize: "0.65rem", letterSpacing: "0.08rem", textTransform: "uppercase", color: T.taupe, marginBottom: "1rem" }}>{a.role}</p>
                <p style={{ fontFamily: T.fontAccent, fontSize: "0.95rem", color: T.textSecondary, lineHeight: 1.8 }}>{a.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section style={{ padding: "5rem 0", background: T.bgWhite }}>
        <div style={S.container}>
          <div style={{ ...S.label, marginBottom: "0.5rem" }}>03 — Processus</div>
          <h2 style={{ ...S.sectionTitle, marginBottom: "3rem" }}>Notre Processus de Création</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0" }}>
            {[
              ["01", "Sélection des matériaux", "Amel passe en revue des milliers de cristaux. Rim choisit ses fils comme une palette de couleurs. Salwa teste la résistance des cordes."],
              ["02", "La création", "Chaque sœur travaille dans son univers, mais leurs mains dialoguent. Les points de Rim inspirent les nœuds de Salwa, qui inspirent les motifs d'Amel."],
              ["03", "L'assemblage final", "Fattouma réunit les éléments, vérifie chaque détail, appose la signature Ayyur. Le sac est prêt à rencontrer celle qui le portera."],
            ].map(([n, t, d]) => (
              <div key={n} style={{ padding: "3rem", borderRight: `1px solid ${T.border}` }}>
                <div style={{ fontFamily: T.fontHeading, fontSize: "4rem", color: T.beige, lineHeight: 1, marginBottom: "1.5rem" }}>{n}</div>
                <h3 style={{ fontFamily: T.fontHeading, fontSize: "1.2rem", fontWeight: 400, marginBottom: "1rem" }}>{t}</h3>
                <p style={{ fontFamily: T.fontBody, fontSize: "0.82rem", color: T.textSecondary, lineHeight: 1.8 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Sur Mesure Page ──────────────────────────────────────────────────────────
function SurMesurePage({ setOrderProduct }) {
  const [form, setForm] = useState({ nom: "", email: "", tel: "", projet: "", budget: "", delai: "" });
  const [sent, setSent] = useState(false);

  function send() {
    if (!form.nom || !form.tel) return;
    const msg = encodeURIComponent(
      `✨ *Demande Sur Mesure - Atelier Ayyur*\n\n` +
      `*Nom :* ${form.nom}\n*Email :* ${form.email}\n*Téléphone :* ${form.tel}\n` +
      `*Projet :* ${form.projet}\n*Budget :* ${form.budget}\n*Délai :* ${form.delai}`
    );
    window.open(`https://wa.me/21622814969?text=${msg}`, "_blank");
    setSent(true);
  }

  const inputStyle = { width: "100%", padding: "0.8rem 1rem", border: `1px solid ${T.border}`, fontFamily: T.fontBody, fontSize: "0.82rem", background: T.bgWhite, color: T.textPrimary, outline: "none", boxSizing: "border-box" };

  return (
    <div style={{ paddingTop: "100px", background: T.bg, minHeight: "100vh" }}>
      <section style={{ padding: "5rem 0 3rem", textAlign: "center" }}>
        <div style={{ ...S.label, marginBottom: "1rem" }}>Service Exclusif</div>
        <h1 style={{ fontFamily: T.fontHeading, fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 400, marginBottom: "1rem" }}>Sur Mesure</h1>
        <p style={{ fontFamily: T.fontAccent, fontSize: "1.15rem", color: T.textSecondary, maxWidth: "600px", margin: "0 auto" }}>
          Votre vision, notre savoir-faire. Créez la pièce unique qui vous ressemble.
        </p>
      </section>

      {/* Steps */}
      <section style={{ padding: "3rem 0", background: T.bgWhite }}>
        <div style={S.container}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0" }}>
            {[["01", "Consultation", "Un échange privé pour définir votre vision, vos matières de prédilection et l'usage de votre future pièce."],
              ["02", "Proposition", "Nous créons un esquisse et vous soumettons une proposition de matériaux et de prix."],
              ["03", "Création", "Vos artisans sœurs Mghaieth se mettent au travail. Vous pouvez suivre l'avancement."],
              ["04", "Livraison", "Votre pièce unique arrive accompagnée de son certificat d'authenticité et de son coffret."]
            ].map(([n, t, d]) => (
              <div key={n} style={{ padding: "2.5rem", borderRight: `1px solid ${T.border}` }}>
                <div style={{ fontFamily: T.fontHeading, fontSize: "3rem", color: T.beige, marginBottom: "1rem" }}>{n}</div>
                <h3 style={{ fontFamily: T.fontHeading, fontSize: "1.1rem", fontWeight: 400, marginBottom: "0.8rem" }}>{t}</h3>
                <p style={{ fontFamily: T.fontBody, fontSize: "0.78rem", color: T.textSecondary, lineHeight: 1.8 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section style={{ padding: "5rem 0" }}>
        <div style={{ ...S.container, maxWidth: "600px" }}>
          <h2 style={{ ...S.sectionTitle, marginBottom: "2rem" }}>Initier votre projet</h2>
          {sent ? (
            <div style={{ textAlign: "center", padding: "3rem", background: T.bgWhite, border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✨</div>
              <h3 style={{ fontFamily: T.fontHeading, fontSize: "1.5rem", fontWeight: 400 }}>Demande envoyée</h3>
              <p style={{ fontFamily: T.fontAccent, fontSize: "1rem", color: T.textSecondary, marginTop: "0.5rem" }}>Notre équipe vous contactera sous 48 heures.</p>
            </div>
          ) : (
            <div style={{ background: T.bgWhite, padding: "2.5rem", border: `1px solid ${T.border}` }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ ...S.label, display: "block", marginBottom: "0.4rem" }}>Nom *</label>
                  <input value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label style={{ ...S.label, display: "block", marginBottom: "0.4rem" }}>Email</label>
                  <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} />
                </div>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ ...S.label, display: "block", marginBottom: "0.4rem" }}>Téléphone *</label>
                <input value={form.tel} onChange={e => setForm(f => ({ ...f, tel: e.target.value }))} placeholder="+216 XX XXX XXX" style={inputStyle} />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ ...S.label, display: "block", marginBottom: "0.4rem" }}>Décrivez votre projet</label>
                <textarea value={form.projet} onChange={e => setForm(f => ({ ...f, projet: e.target.value }))} rows={4} placeholder="Type de sac, matière souhaitée, occasion..." style={{ ...inputStyle, resize: "vertical" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                <div>
                  <label style={{ ...S.label, display: "block", marginBottom: "0.4rem" }}>Budget estimé</label>
                  <select value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} style={{ ...inputStyle }}>
                    <option value="">Choisir</option>
                    <option>500 – 1 000€</option>
                    <option>1 000 – 2 000€</option>
                    <option>2 000 – 5 000€</option>
                    <option>Plus de 5 000€</option>
                  </select>
                </div>
                <div>
                  <label style={{ ...S.label, display: "block", marginBottom: "0.4rem" }}>Délai souhaité</label>
                  <select value={form.delai} onChange={e => setForm(f => ({ ...f, delai: e.target.value }))} style={{ ...inputStyle }}>
                    <option value="">Choisir</option>
                    <option>1 mois</option>
                    <option>2 – 3 mois</option>
                    <option>3 – 6 mois</option>
                    <option>Pas de contrainte</option>
                  </select>
                </div>
              </div>
              <button onClick={send} style={{ ...S.btn, width: "100%", justifyContent: "center" }}>
                Envoyer ma demande via WhatsApp
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
function AdminPage({ orders }) {
  const [tab, setTab] = useState("orders");
  const [editingProduct, setEditingProduct] = useState(null);
  const [products, setProducts] = useState(PRODUCTS);
  const [adminOrders, setAdminOrders] = useState(orders);
  const [auth, setAuth] = useState(false);
  const [pwd, setPwd] = useState("");

  useEffect(() => { setAdminOrders(orders); }, [orders]);

  if (!auth) return (
    <div style={{ paddingTop: "100px", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: T.bg }}>
      <div style={{ background: T.bgWhite, padding: "3rem", border: `1px solid ${T.border}`, width: "340px" }}>
        <div style={{ ...S.label, marginBottom: "0.5rem" }}>Espace réservé</div>
        <h2 style={{ fontFamily: T.fontHeading, fontSize: "1.8rem", fontWeight: 400, marginBottom: "2rem" }}>Administration</h2>
        <input type="password" value={pwd} onChange={e => setPwd(e.target.value)} onKeyDown={e => e.key === "Enter" && pwd === "ayyur2024" && setAuth(true)}
          placeholder="Mot de passe" style={{ width: "100%", padding: "0.8rem 1rem", border: `1px solid ${T.border}`, fontFamily: T.fontBody, marginBottom: "1rem", boxSizing: "border-box" }} />
        <button onClick={() => pwd === "ayyur2024" && setAuth(true)} style={{ ...S.btn, width: "100%", justifyContent: "center" }}>
          Accéder →
        </button>
        <p style={{ fontFamily: T.fontBody, fontSize: "0.65rem", color: T.textTertiary, marginTop: "1rem", textAlign: "center" }}>Mot de passe : ayyur2024</p>
      </div>
    </div>
  );

  const tabs = [{ key: "orders", label: `Commandes (${adminOrders.length})` }, { key: "catalogue", label: "Catalogue" }, { key: "stats", label: "Aperçu" }];
  const statusColors = { "À fabriquer": T.taupe, "En cours": "#e67e22", "Livré": "#27ae60" };

  return (
    <div style={{ paddingTop: "100px", background: T.bg, minHeight: "100vh" }}>
      <div style={{ ...S.container, padding: "2rem 3rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
          <div>
            <div style={{ ...S.label, marginBottom: "0.3rem" }}>Administration</div>
            <h1 style={{ fontFamily: T.fontHeading, fontSize: "2rem", fontWeight: 400 }}>Tableau de bord</h1>
          </div>
          <button onClick={() => setAuth(false)} style={{ ...S.btn, ...S.btnSecondary, padding: "0.5rem 1rem", fontSize: "0.6rem" }}>Déconnexion</button>
        </div>

        {/* Stats cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
          {[
            ["Commandes", adminOrders.length],
            ["À fabriquer", adminOrders.filter(o => o.status === "À fabriquer").length],
            ["Produits actifs", products.length],
            ["CA estimé", `${adminOrders.reduce((s, o) => s + (o.product?.price || 0), 0).toLocaleString("fr-FR")}€`],
          ].map(([l, v]) => (
            <div key={l} style={{ background: T.bgWhite, padding: "1.5rem", border: `1px solid ${T.border}` }}>
              <div style={{ fontFamily: T.fontBody, fontSize: "0.65rem", letterSpacing: "0.1rem", textTransform: "uppercase", color: T.textSecondary, marginBottom: "0.5rem" }}>{l}</div>
              <div style={{ fontFamily: T.fontHeading, fontSize: "2rem", color: T.textPrimary }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0", marginBottom: "2rem", borderBottom: `1px solid ${T.border}` }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              background: "none", border: "none", cursor: "pointer", padding: "0.8rem 1.5rem",
              fontFamily: T.fontBody, fontSize: "0.7rem", letterSpacing: "0.1rem", textTransform: "uppercase",
              color: tab === t.key ? T.textPrimary : T.textSecondary,
              borderBottom: tab === t.key ? `2px solid ${T.accent}` : "2px solid transparent",
            }}>{t.label}</button>
          ))}
        </div>

        {/* Orders tab */}
        {tab === "orders" && (
          <div style={{ background: T.bgWhite, border: `1px solid ${T.border}` }}>
            {adminOrders.length === 0 ? (
              <div style={{ padding: "4rem", textAlign: "center", color: T.textTertiary }}>
                <p style={{ fontFamily: T.fontAccent, fontSize: "1.2rem" }}>Aucune commande pour le moment</p>
                <p style={{ fontFamily: T.fontBody, fontSize: "0.75rem", marginTop: "0.5rem" }}>Les commandes WhatsApp apparaîtront ici après validation</p>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${T.border}`, background: "#faf9f7" }}>
                    {["Pièce", "Client", "Ville", "Mode paiement", "Prix", "Statut", "Action"].map(h => (
                      <th key={h} style={{ padding: "1rem", textAlign: "left", fontFamily: T.fontBody, fontSize: "0.62rem", letterSpacing: "0.1rem", textTransform: "uppercase", color: T.textSecondary }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {adminOrders.map((o, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
                      <td style={{ padding: "1rem", fontFamily: T.fontHeading, fontSize: "0.95rem" }}>{o.product?.name || "—"}</td>
                      <td style={{ padding: "1rem", fontFamily: T.fontBody, fontSize: "0.8rem" }}>{o.prenom} {o.nom}</td>
                      <td style={{ padding: "1rem", fontFamily: T.fontBody, fontSize: "0.8rem", color: T.textSecondary }}>{o.ville}</td>
                      <td style={{ padding: "1rem", fontFamily: T.fontBody, fontSize: "0.75rem", color: T.textSecondary }}>{o.mode === "livraison" ? "À la livraison" : "Virement"}</td>
                      <td style={{ padding: "1rem", fontFamily: T.fontAccent, fontSize: "1rem" }}>{o.product?.price?.toLocaleString("fr-FR")}€</td>
                      <td style={{ padding: "1rem" }}>
                        <select value={o.status || "À fabriquer"} onChange={e => setAdminOrders(prev => prev.map((x, j) => j === i ? { ...x, status: e.target.value } : x))}
                          style={{ fontFamily: T.fontBody, fontSize: "0.7rem", padding: "0.3rem 0.5rem", border: `1px solid ${T.border}`, background: T.bgWhite, color: statusColors[o.status || "À fabriquer"] || T.textPrimary, cursor: "pointer" }}>
                          {Object.keys(statusColors).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <button onClick={() => {
                          const msg = encodeURIComponent(`Bonjour ${o.prenom}, votre commande "${o.product?.name}" est en cours de préparation chez Atelier Ayyur 🌟`);
                          window.open(`https://wa.me/${o.tel?.replace(/\D/g, "")}?text=${msg}`, "_blank");
                        }} style={{ ...S.btn, padding: "0.3rem 0.8rem", fontSize: "0.58rem", background: "#25D366" }}>WhatsApp</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Catalogue tab */}
        {tab === "catalogue" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
              {products.map(p => (
                <div key={p.id} style={{ background: T.bgWhite, border: `1px solid ${T.border}`, padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <h3 style={{ fontFamily: T.fontHeading, fontSize: "1.1rem", fontWeight: 400 }}>{p.name}</h3>
                      <p style={{ fontFamily: T.fontBody, fontSize: "0.65rem", color: T.textSecondary, textTransform: "uppercase", letterSpacing: "0.08rem" }}>{p.collection}</p>
                    </div>
                    <span style={{ fontFamily: T.fontAccent, fontSize: "1.1rem" }}>{p.price.toLocaleString("fr-FR")}€</span>
                  </div>
                  <p style={{ fontFamily: T.fontBody, fontSize: "0.75rem", color: T.textSecondary, lineHeight: 1.6 }}>{p.desc.slice(0, 80)}…</p>
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                    <button onClick={() => setEditingProduct({ ...p })} style={{ ...S.btn, ...S.btnSecondary, flex: 1, justifyContent: "center", padding: "0.4rem", fontSize: "0.6rem" }}>Modifier</button>
                    <button onClick={() => setProducts(prev => prev.map(x => x.id === p.id ? { ...x, hidden: !x.hidden } : x))}
                      style={{ ...S.btn, flex: 1, justifyContent: "center", padding: "0.4rem", fontSize: "0.6rem", background: p.hidden ? T.taupe : T.accent }}>
                      {p.hidden ? "Afficher" : "Masquer"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats tab */}
        {tab === "stats" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
            <div style={{ background: T.bgWhite, padding: "2rem", border: `1px solid ${T.border}` }}>
              <h3 style={{ fontFamily: T.fontHeading, fontSize: "1.2rem", fontWeight: 400, marginBottom: "1.5rem" }}>Répartition par collection</h3>
              {["perles", "crochet", "macrame", "accessoires"].map(cat => {
                const count = PRODUCTS.filter(p => p.category === cat).length;
                const pct = Math.round((count / PRODUCTS.length) * 100);
                return (
                  <div key={cat} style={{ marginBottom: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                      <span style={{ fontFamily: T.fontBody, fontSize: "0.72rem", textTransform: "capitalize" }}>{cat}</span>
                      <span style={{ fontFamily: T.fontBody, fontSize: "0.72rem", color: T.textSecondary }}>{count} pièces</span>
                    </div>
                    <div style={{ height: "4px", background: T.border, borderRadius: "2px" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: T.taupe, borderRadius: "2px" }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ background: T.bgWhite, padding: "2rem", border: `1px solid ${T.border}` }}>
              <h3 style={{ fontFamily: T.fontHeading, fontSize: "1.2rem", fontWeight: 400, marginBottom: "1.5rem" }}>Fourchette de prix</h3>
              {[["Moins de 500€", PRODUCTS.filter(p => p.price < 500).length],
                ["500€ – 1 000€", PRODUCTS.filter(p => p.price >= 500 && p.price < 1000).length],
                ["1 000€ – 2 000€", PRODUCTS.filter(p => p.price >= 1000 && p.price < 2000).length],
                ["Plus de 2 000€", PRODUCTS.filter(p => p.price >= 2000).length],
              ].map(([l, c]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "0.6rem 0", borderBottom: `1px solid ${T.border}` }}>
                  <span style={{ fontFamily: T.fontBody, fontSize: "0.78rem" }}>{l}</span>
                  <span style={{ fontFamily: T.fontHeading, fontSize: "1.2rem" }}>{c}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit modal */}
      {editingProduct && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(28,28,28,0.6)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setEditingProduct(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: T.bgWhite, padding: "2.5rem", width: "480px", maxHeight: "80vh", overflow: "auto" }}>
            <h3 style={{ fontFamily: T.fontHeading, fontSize: "1.4rem", fontWeight: 400, marginBottom: "1.5rem" }}>Modifier — {editingProduct.name}</h3>
            {[["Nom", "name"], ["Sous-titre", "subcategory"], ["Prix (€)", "price"], ["Dimensions", "dims"]].map(([l, k]) => (
              <div key={k} style={{ marginBottom: "1rem" }}>
                <label style={{ ...S.label, display: "block", marginBottom: "0.3rem" }}>{l}</label>
                <input value={editingProduct[k]} onChange={e => setEditingProduct(p => ({ ...p, [k]: e.target.value }))}
                  style={{ width: "100%", padding: "0.7rem 1rem", border: `1px solid ${T.border}`, fontFamily: T.fontBody, fontSize: "0.82rem", boxSizing: "border-box" }} />
              </div>
            ))}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ ...S.label, display: "block", marginBottom: "0.3rem" }}>Description</label>
              <textarea value={editingProduct.desc} onChange={e => setEditingProduct(p => ({ ...p, desc: e.target.value }))}
                rows={4} style={{ width: "100%", padding: "0.7rem 1rem", border: `1px solid ${T.border}`, fontFamily: T.fontBody, fontSize: "0.82rem", resize: "vertical", boxSizing: "border-box" }} />
            </div>
            <div style={{ display: "flex", gap: "0.8rem" }}>
              <button onClick={() => setEditingProduct(null)} style={{ ...S.btn, ...S.btnSecondary, flex: 1, justifyContent: "center" }}>Annuler</button>
              <button onClick={() => { setProducts(prev => prev.map(p => p.id === editingProduct.id ? editingProduct : p)); setEditingProduct(null); }}
                style={{ ...S.btn, flex: 2, justifyContent: "center" }}>Sauvegarder</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ setPage }) {
  return (
    <footer style={{ background: T.accent, color: "#d8d2c9", padding: "4rem 0 2rem" }}>
      <div style={S.container}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "3rem", marginBottom: "3rem" }}>
          <div>
            <div style={{ fontFamily: T.fontHeading, fontSize: "2rem", color: T.taupe, letterSpacing: "0.2rem", marginBottom: "0.3rem" }}>AY</div>
            <div style={{ fontFamily: T.fontAccent, fontSize: "0.7rem", letterSpacing: "0.15rem", marginBottom: "1.5rem", opacity: 0.6 }}>ATELIER AYYUR · TUNIS</div>
            <p style={{ fontFamily: T.fontAccent, fontSize: "1rem", lineHeight: 1.8, opacity: 0.7, maxWidth: "280px" }}>L'art du sac comme haute joaillerie textile. Fait main à Tunis, livré dans le monde entier.</p>
          </div>
          {[
            ["Collections", [["Perles de Cristal", "catalogue"], ["Crochet d'Art", "catalogue"], ["Macramé Sculptural", "catalogue"], ["Accessoires", "catalogue"]]],
            ["L'Univers", [["L'Atelier", "atelier"], ["Les Artisans", "atelier"], ["Sur Mesure", "surmesure"]]],
            ["Contact", [["Tunis, Tunisie", null], ["+216 22 814 969", null], ["contact@atelierayyur.com", null]]],
          ].map(([title, links]) => (
            <div key={title}>
              <div style={{ fontFamily: T.fontBody, fontSize: "0.6rem", letterSpacing: "0.15rem", textTransform: "uppercase", color: T.taupe, marginBottom: "1.2rem" }}>{title}</div>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {links.map(([l, p]) => (
                  <li key={l} style={{ marginBottom: "0.6rem" }}>
                    {p ? <button onClick={() => setPage(p)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: T.fontBody, fontSize: "0.78rem", color: "rgba(216,210,201,0.7)", padding: 0 }}>{l}</button>
                      : <span style={{ fontFamily: T.fontBody, fontSize: "0.78rem", color: "rgba(216,210,201,0.5)" }}>{l}</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(216,210,201,0.15)", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: T.fontBody, fontSize: "0.65rem", opacity: 0.4 }}>© 2024 Atelier Ayyur. Tous droits réservés.</span>
          <span style={{ fontFamily: T.fontBody, fontSize: "0.65rem", opacity: 0.4 }}>Fait avec ❤ à Tunis</span>
        </div>
      </div>
    </footer>
  );
}

// ─── Success Toast ────────────────────────────────────────────────────────────
function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 4000); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position: "fixed", bottom: "2rem", right: "2rem", background: T.accent, color: "#fff", padding: "1rem 1.5rem", zIndex: 9999, fontFamily: T.fontBody, fontSize: "0.78rem", maxWidth: "320px", lineHeight: 1.6, borderLeft: `3px solid ${T.taupe}` }}>
      {msg}
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [filter, setFilter] = useState("all");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderProduct, setOrderProduct] = useState(null);
  const [orders, setOrders] = useState([]);
  const [toast, setToast] = useState(null);

  function addToCart(product) {
    setCart(prev => {
      const ex = prev.find(p => p.id === product.id);
      if (ex) return prev.map(p => p.id === product.id ? { ...p, qty: p.qty + 1 } : p);
      return [...prev, { ...product, qty: 1 }];
    });
    setToast(`"${product.name}" ajouté au panier.`);
  }

  function removeFromCart(id) {
    setCart(prev => prev.filter(p => p.id !== id));
  }

  function handleOrderSuccess(orderData) {
    setOrders(prev => [...prev, { ...orderData, status: "À fabriquer", date: new Date().toLocaleDateString("fr-FR") }]);
    setToast(`✅ Commande pour "${orderData.product?.name}" enregistrée ! WhatsApp ouvert.`);
  }

  // Scroll to top on page change
  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  const goPage = (p) => { setPage(p); setCartOpen(false); setSelectedProduct(null); };

  return (
    <div style={{ fontFamily: T.fontBody, background: T.bg, color: T.textPrimary }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Montserrat:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        button:focus { outline: none; }
        input:focus, textarea:focus, select:focus { outline: none; border-color: #8a7f73 !important; }
        a { color: inherit; text-decoration: none; }
        body { overflow-x: hidden; }
      `}</style>

      <Header page={page} setPage={goPage} cartCount={cart.reduce((s, i) => s + i.qty, 0)} setCartOpen={setCartOpen} />

      <main>
        {page === "home" && <HomePage setPage={goPage} setFilter={setFilter} />}
        {page === "catalogue" && <CataloguePage addToCart={addToCart} setSelectedProduct={setSelectedProduct} filter={filter} setFilter={setFilter} />}
        {page === "atelier" && <AtelierPage />}
        {page === "surmesure" && <SurMesurePage setOrderProduct={setOrderProduct} />}
        {page === "admin" && <AdminPage orders={orders} />}
      </main>

      {page !== "admin" && <Footer setPage={goPage} />}

      {/* Modals */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          addToCart={addToCart}
          setOrderProduct={setOrderProduct}
        />
      )}
      {orderProduct && (
        <OrderModal
          product={orderProduct}
          onClose={() => setOrderProduct(null)}
          onSuccess={handleOrderSuccess}
        />
      )}
      {cartOpen && (
        <CartPanel cart={cart} onClose={() => setCartOpen(false)} onRemove={removeFromCart} setOrderProduct={p => { setOrderProduct(p); setCartOpen(false); }} />
      )}
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}

      {/* Floating CTA */}
      <div style={{ position: "fixed", bottom: "2rem", left: "2rem", zIndex: 500 }}>
        <button onClick={() => setPage("surmesure")} style={{
          ...S.btn, background: T.taupe, gap: "0.5rem", boxShadow: "0 4px 20px rgba(138,127,115,0.3)",
          fontSize: "0.62rem", padding: "0.8rem 1.2rem",
        }}>
          Sur Mesure
        </button>
      </div>
    </div>
  );
}
