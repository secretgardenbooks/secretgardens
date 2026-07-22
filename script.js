/* ==========================================================================
   THE SECRET GARDENS BOOKS — script.js
   ========================================================================== */

// ---------- CONFIGURACIÓN ----------
const CURRENCY = "$";
const WHATSAPP = "584125713381"; // <-- reemplazar con el número real (código país + número, sin +)
const URL_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQAbijRvTOJdr03l9HI8mcbEJzafkUuQX8b81FVIMoVQ6Ba0SLwUA4MLFXeNVLPgjDXZJUeIlHmbxEe/pub?output=csv"; // <-- reemplazar con el CSV público de Google Sheets
const CART_GOAL = 5; // libros para desbloquear beneficio

const LS_CART = "sgb_cart";
const LS_FAVS = "sgb_favs";

// ---------- DATOS DE DEMOSTRACIÓN ----------
// Se usan automáticamente si URL_CSV no está configurada o falla la carga,
// para que el sitio sea funcional de inmediato durante el desarrollo.
const DEMO_BOOKS = [
  { id: 1, title: "El Jardín de los Secretos Olvidados", author: "Elena Marlowe", price: 14.5, originalPrice: 18, cover: "Dura", inStock: "SI", genres: "Romántico, Fantasía", badge: "Más vendido", description: "Una joven bibliotecaria descubre un jardín que solo florece bajo la luna llena, y con él, un romance que desafía el tiempo.", img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500", topRank: 1 },
  { id: 2, title: "Cartas a Medianoche", author: "Simone Duarte", price: 11.9, originalPrice: "", cover: "Blanda", inStock: "SI", genres: "Romántico, Contemporáneo, Drama", badge: "", description: "Un intercambio de cartas anónimas entre dos desconocidos que viven en la misma calle, separados por una guerra que nunca terminó.", img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500", topRank: 2 },
  { id: 3, title: "La Sombra del Roble Antiguo", author: "Nadia Ferreira", price: 16.0, originalPrice: "", cover: "Dura", inStock: "SI", genres: "Fantasía, Young Adult", badge: "Destacado", description: "En un pueblo donde los árboles recuerdan, una heredera debe elegir entre su linaje y su libertad.", img: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=500", topRank: 3 },
  { id: 4, title: "Vals de Terciopelo", author: "Aurora Beltrán", price: 13.2, originalPrice: 15.5, cover: "Blanda", inStock: "SI", genres: "Romántico, Histórico", badge: "", description: "Viena, 1889. Una compositora oculta su talento tras un seudónimo masculino mientras el amor la encuentra en un baile de máscaras.", img: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=500", topRank: "" },
  { id: 5, title: "El Silencio de las Luciérnagas", author: "Rocío Alcántara", price: 12.4, originalPrice: "", cover: "Blanda", inStock: "NO", genres: "Drama, Contemporáneo", badge: "", description: "Una novela íntima sobre la pérdida, la memoria y las pequeñas luces que nos guían de vuelta a casa.", img: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=500", topRank: "" },
  { id: 6, title: "Reino de Tinta y Ceniza", author: "Tobías Wren", price: 17.9, originalPrice: 21, cover: "Dura", inStock: "SI", genres: "Fantasía, Young Adult, Aventura", badge: "Nuevo", description: "Un escriba descubre que las palabras que copia cobran vida propia — y que ha estado escribiendo su propia condena.", img: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=500", topRank: 4 },
  { id: 7, title: "Manual de Ética para Insomnes", author: "Julián Prado", price: 15.3, originalPrice: "", cover: "Blanda", inStock: "SI", genres: "Ensayo, Filosofía", badge: "", description: "Reflexiones breves y filosas sobre la lucidez, la culpa y el arte de vivir despierto en un mundo que prefiere dormir.", img: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500", topRank: "" },
  { id: 8, title: "La Casa de las Enredaderas Azules", author: "Marina Castellanos", price: 14.0, originalPrice: "", cover: "Dura", inStock: "SI", genres: "Misterio, Gótico", badge: "", description: "Tres hermanas heredan una mansión con una regla: nunca entrar al invernadero después del anochecer.", img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500", topRank: 5 },
  { id: 9, title: "Poemas para Leer en Voz Baja", author: "Ines Yagüe", price: 9.5, originalPrice: "", cover: "Blanda", inStock: "SI", genres: "Poesía", badge: "", description: "Una colección íntima sobre el deseo, el silencio y las cosas que solo se dicen a oscuras.", img: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=500", topRank: "" },
];

// ---------- ESTADO GLOBAL ----------
let ALL_BOOKS = [];
let cart = JSON.parse(localStorage.getItem(LS_CART) || "[]");
let favs = JSON.parse(localStorage.getItem(LS_FAVS) || "[]");
let currentModalBook = null;

// ============================================================
// FONDO ESTRELLADO
// ============================================================
(function starfield() {
  const canvas = document.getElementById("starfield");
  const ctx = canvas.getContext("2d");
  let stars = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const count = Math.floor((canvas.width * canvas.height) / 9000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.3 + 0.2,
      baseAlpha: Math.random() * 0.6 + 0.2,
      speed: Math.random() * 0.015 + 0.005,
      phase: Math.random() * Math.PI * 2,
    }));
  }

  function draw(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const s of stars) {
      const twinkle = Math.sin(t * s.speed + s.phase) * 0.5 + 0.5;
      ctx.globalAlpha = s.baseAlpha * (0.5 + twinkle * 0.5);
      ctx.fillStyle = "#e8e2f5";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * (0.8 + twinkle * 0.4), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(draw);
})();

// ============================================================
// UTILIDADES
// ============================================================
function money(n) {
  return `${CURRENCY}${Number(n).toFixed(2)}`;
}

function genreList(str) {
  return (str || "").split(",").map(g => g.trim()).filter(Boolean);
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 2400);
}

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// ============================================================
// CARGA DE DATOS
// ============================================================
function normalizeRow(row) {
  return {
    id: Number(row.id),
    title: row.title || "",
    author: row.author || "",
    price: parseFloat(row.price) || 0,
    originalPrice: row.originalPrice ? parseFloat(row.originalPrice) : null,
    cover: row.cover || "Blanda",
    inStock: (row.inStock || "SI").toString().trim().toUpperCase() === "SI",
    genres: row.genres || "",
    badge: row.badge || "",
    description: row.description || "",
    img: row.img || "",
    topRank: row.topRank ? Number(row.topRank) : null,
  };
}

function loadBooks() {
  if (!URL_CSV || URL_CSV.startsWith("TU_URL")) {
    ALL_BOOKS = DEMO_BOOKS.map(b => ({ ...b, inStock: b.inStock === "SI" }));
    initAfterLoad();
    return;
  }
  Papa.parse(URL_CSV, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      ALL_BOOKS = results.data.map(normalizeRow).filter(b => b.title);
      initAfterLoad();
    },
    error: () => {
      showToast("No se pudo cargar el catálogo, mostrando muestra local.");
      ALL_BOOKS = DEMO_BOOKS.map(b => ({ ...b, inStock: b.inStock === "SI" }));
      initAfterLoad();
    },
  });
}

function initAfterLoad() {
  populateGenreFilter();
  renderCarousel();
  renderGrid();
  renderFavorites();
  updateCartUI();
}

// ============================================================
// FILTROS DE GÉNERO
// ============================================================
function populateGenreFilter() {
  const select = document.getElementById("genreFilter");
  const set = new Set();
  ALL_BOOKS.forEach(b => genreList(b.genres).forEach(g => set.add(g)));
  [...set].sort().forEach(g => {
    const opt = document.createElement("option");
    opt.value = g;
    opt.textContent = g;
    select.appendChild(opt);
  });
}

// ============================================================
// CARRUSEL TOP
// ============================================================
function renderCarousel() {
  const container = document.getElementById("topCarousel");
  container.innerHTML = "";
  const top = ALL_BOOKS.filter(b => b.topRank).sort((a, b) => a.topRank - b.topRank);
  if (!top.length) {
    document.querySelector(".top-carousel-section").hidden = true;
    return;
  }
  top.forEach(book => {
    const el = document.createElement("div");
    el.className = "top-item";
    el.innerHTML = `
      <span class="rank-number">${book.topRank}</span>
      <img class="top-cover" src="${book.img}" alt="${book.title}" loading="lazy">
    `;
    el.querySelector(".top-cover").addEventListener("click", () => openBookModal(book.id));
    container.appendChild(el);
  });
}

// ============================================================
// GRID DE PRODUCTOS
// ============================================================
function getFilteredBooks() {
  const search = document.getElementById("searchInput").value.trim().toLowerCase();
  const genre = document.getElementById("genreFilter").value;
  const sort = document.getElementById("sortSelect").value;
  const onlyStock = document.getElementById("inStockFilter").checked;

  let list = ALL_BOOKS.filter(b => {
    const matchesSearch = !search || b.title.toLowerCase().includes(search) || b.author.toLowerCase().includes(search);
    const matchesGenre = !genre || genreList(b.genres).includes(genre);
    const matchesStock = !onlyStock || b.inStock;
    return matchesSearch && matchesGenre && matchesStock;
  });

  if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
  else if (sort === "title-asc") list.sort((a, b) => a.title.localeCompare(b.title));

  return list;
}

function bookCardHTML(book) {
  const genres = genreList(book.genres);
  const visibleGenres = genres.slice(0, 2);
  const extra = genres.length - visibleGenres.length;
  const isFav = favs.includes(book.id);
  const hasDiscount = book.originalPrice && book.originalPrice > book.price;

  return `
    <div class="book-card ${book.inStock ? "" : "out-of-stock"}" data-id="${book.id}">
      <div class="cover-wrap">
        <img src="${book.img}" alt="${book.title}" loading="lazy" class="card-cover-img">
        <div class="cover-overlay"></div>
        <button class="fav-btn ${isFav ? "active" : ""}" data-fav="${book.id}" aria-label="Favorito">${isFav ? "♥" : "♡"}</button>
        ${!book.inStock ? `<span class="badge-oos">Agotado</span>` : book.badge ? `<span class="badge-special">${book.badge}</span>` : ""}
      </div>
      <div class="card-body">
        <div class="card-title" data-open="${book.id}">${book.title}</div>
        <div class="card-genres">
          ${visibleGenres.map(g => `<span class="genre-pill">${g}</span>`).join("")}
          ${extra > 0 ? `<span class="genre-pill more-pill" data-open="${book.id}">…+${extra} más</span>` : ""}
        </div>
        <div class="card-price-row">
          <span class="card-price">${money(book.price)}</span>
          ${hasDiscount ? `<span class="card-original-price">${money(book.originalPrice)}</span>` : ""}
        </div>
        <div class="card-actions">
          <button class="btn btn-buy" data-buy="${book.id}" ${book.inStock ? "" : ""}>Comprar</button>
          <button class="btn btn-cart" data-addcart="${book.id}" ${book.inStock ? "" : "disabled"}>Al carrito</button>
        </div>
      </div>
    </div>
  `;
}

function renderGrid() {
  const grid = document.getElementById("productsGrid");
  const emptyState = document.getElementById("emptyState");
  const list = getFilteredBooks();

  if (!list.length) {
    grid.innerHTML = "";
    emptyState.hidden = false;
    return;
  }
  emptyState.hidden = true;
  grid.innerHTML = list.map(bookCardHTML).join("");
  attachGridEvents();
  setupLazyImages();
}

function attachGridEvents() {
  document.querySelectorAll("[data-open]").forEach(el => {
    el.addEventListener("click", () => openBookModal(Number(el.dataset.open)));
  });
  document.querySelectorAll("[data-fav]").forEach(el => {
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavorite(Number(el.dataset.fav));
    });
  });
  document.querySelectorAll("[data-buy]").forEach(el => {
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      buyNow(Number(el.dataset.buy));
    });
  });
  document.querySelectorAll("[data-addcart]").forEach(el => {
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      addToCart(Number(el.dataset.addcart), el);
    });
  });
}

function setupLazyImages() {
  const imgs = document.querySelectorAll("img[loading='lazy']");
  if (!("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) img.src = img.dataset.src;
        obs.unobserve(img);
      }
    });
  });
  imgs.forEach(img => observer.observe(img));
}

// ============================================================
// FAVORITOS
// ============================================================
function toggleFavorite(id) {
  if (favs.includes(id)) {
    favs = favs.filter(f => f !== id);
  } else {
    favs.push(id);
  }
  localStorage.setItem(LS_FAVS, JSON.stringify(favs));
  renderGrid();
  renderFavorites();
}

function renderFavorites() {
  const section = document.getElementById("favoritesSection");
  const strip = document.getElementById("favoritesStrip");
  const favBooks = ALL_BOOKS.filter(b => favs.includes(b.id));
  if (!favBooks.length) {
    section.hidden = true;
    return;
  }
  section.hidden = false;
  strip.innerHTML = favBooks.map(b => `<img src="${b.img}" alt="${b.title}" data-open="${b.id}">`).join("");
  strip.querySelectorAll("[data-open]").forEach(el => {
    el.addEventListener("click", () => openBookModal(Number(el.dataset.open)));
  });
}

document.getElementById("clearFavs").addEventListener("click", () => {
  favs = [];
  localStorage.setItem(LS_FAVS, JSON.stringify(favs));
  renderGrid();
  renderFavorites();
});

// ============================================================
// MODAL DE LIBRO
// ============================================================
function openBookModal(id) {
  const book = ALL_BOOKS.find(b => b.id === id);
  if (!book) return;
  currentModalBook = book;

  document.getElementById("modalBackdropImg").style.backgroundImage = `url(${book.img})`;
  document.getElementById("modalImg").src = book.img;
  document.getElementById("modalImg").alt = book.title;
  document.getElementById("modalCoverBadge").textContent = book.cover;
  document.getElementById("modalTitle").textContent = book.title;
  document.getElementById("modalAuthor").textContent = book.author;
  document.getElementById("modalDesc").textContent = book.description;
  document.getElementById("modalGenres").innerHTML = genreList(book.genres)
    .map(g => `<span class="genre-pill">${g}</span>`).join("");

  document.getElementById("modalPrice").textContent = money(book.price);
  const hasDiscount = book.originalPrice && book.originalPrice > book.price;
  const origEl = document.getElementById("modalOriginalPrice");
  const discEl = document.getElementById("modalDiscountBadge");
  if (hasDiscount) {
    origEl.textContent = money(book.originalPrice);
    origEl.hidden = false;
    const pct = Math.round((1 - book.price / book.originalPrice) * 100);
    discEl.textContent = `-${pct}%`;
    discEl.hidden = false;
  } else {
    origEl.hidden = true;
    discEl.hidden = true;
  }

  const buyBtn = document.getElementById("modalBuyNow");
  const cartBtn = document.getElementById("modalAddCart");
  buyBtn.disabled = false;
  cartBtn.disabled = !book.inStock;
  buyBtn.onclick = () => buyNow(book.id);
  cartBtn.onclick = (e) => addToCart(book.id, e.target);
  document.getElementById("modalShare").onclick = () => shareBook(book);

  renderSuggestions(book);

  document.getElementById("bookModalOverlay").hidden = false;
  document.body.style.overflow = "hidden";
}

function closeBookModal() {
  document.getElementById("bookModalOverlay").hidden = true;
  document.body.style.overflow = "";
  currentModalBook = null;
}

function renderSuggestions(book) {
  const container = document.getElementById("suggestionsScroll");
  const bookGenres = genreList(book.genres);
  const suggestions = ALL_BOOKS
    .filter(b => b.id !== book.id && genreList(b.genres).some(g => bookGenres.includes(g)))
    .slice(0, 8);
  container.innerHTML = suggestions.map(s => `
    <div class="suggestion-item" data-open="${s.id}">
      <img src="${s.img}" alt="${s.title}">
      <div class="sug-title">${s.title}</div>
      <div class="sug-author">${s.author}</div>
      <div class="sug-price">${money(s.price)}</div>
    </div>
  `).join("");
  container.querySelectorAll("[data-open]").forEach(el => {
    el.addEventListener("click", () => openBookModal(Number(el.dataset.open)));
  });
}

function shareBook(book) {
  const text = `${book.title} — ${book.author} — ${money(book.price)}`;
  if (navigator.share) {
    navigator.share({ title: book.title, text }).catch(() => {});
  } else {
    navigator.clipboard?.writeText(text);
    showToast("Enlace copiado para compartir 🌿");
  }
}

document.getElementById("closeBookModal").addEventListener("click", closeBookModal);
document.getElementById("bookModalOverlay").addEventListener("click", (e) => {
  if (e.target.id === "bookModalOverlay") closeBookModal();
});

// ============================================================
// CARRITO
// ============================================================
function saveCart() {
  localStorage.setItem(LS_CART, JSON.stringify(cart));
}

function addToCart(id, sourceEl) {
  const book = ALL_BOOKS.find(b => b.id === id);
  if (!book || !book.inStock) return;

  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty += 1;
  else cart.push({ id, qty: 1 });

  saveCart();
  updateCartUI();
  flyToCart(sourceEl, book.img);
  showToast(`"${book.title}" añadido al carrito`);
}

function flyToCart(sourceEl, imgSrc) {
  if (!sourceEl) return;
  const card = sourceEl.closest(".book-card") || sourceEl.closest(".modal-content");
  const imgEl = card ? card.querySelector("img") : null;
  const startRect = (imgEl || sourceEl).getBoundingClientRect();
  const fab = document.getElementById("cartFab");
  const endRect = fab.getBoundingClientRect();

  const flying = document.getElementById("flyingImg");
  flying.src = imgSrc;
  flying.hidden = false;
  flying.style.transition = "none";
  flying.style.left = startRect.left + "px";
  flying.style.top = startRect.top + "px";
  flying.style.width = startRect.width + "px";
  flying.style.opacity = "1";

  requestAnimationFrame(() => {
    flying.style.transition = "all 0.7s cubic-bezier(0.35,0,0.65,1)";
    flying.style.left = endRect.left + endRect.width / 2 - 15 + "px";
    flying.style.top = endRect.top + endRect.height / 2 - 20 + "px";
    flying.style.width = "30px";
    flying.style.opacity = "0.3";
  });

  setTimeout(() => {
    flying.hidden = true;
    fab.style.transform = "scale(1.15)";
    setTimeout(() => (fab.style.transform = ""), 200);
  }, 700);
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCartUI();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCartUI();
}

function cartTotal() {
  return cart.reduce((sum, item) => {
    const book = ALL_BOOKS.find(b => b.id === item.id);
    return sum + (book ? book.price * item.qty : 0);
  }, 0);
}

function cartCount() {
  return cart.reduce((sum, i) => sum + i.qty, 0);
}

function updateCartUI() {
  const itemsContainer = document.getElementById("cartItems");
  const emptyEl = document.getElementById("cartEmpty");
  const fabBadge = document.getElementById("cartFabBadge");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const totalCount = cartCount();

  if (!cart.length) {
    itemsContainer.innerHTML = "";
    emptyEl.hidden = false;
  } else {
    emptyEl.hidden = true;
    itemsContainer.innerHTML = cart.map(item => {
      const book = ALL_BOOKS.find(b => b.id === item.id);
      if (!book) return "";
      return `
        <div class="cart-item">
          <img src="${book.img}" alt="${book.title}">
          <div class="cart-item-info">
            <div class="cart-item-title">${book.title}</div>
            <div class="cart-item-price">${money(book.price)} c/u · ${money(book.price * item.qty)}</div>
          </div>
          <div class="qty-controls">
            <button data-qty-minus="${book.id}">−</button>
            <span>${item.qty}</span>
            <button data-qty-plus="${book.id}">+</button>
            <button class="remove-x" data-remove="${book.id}">×</button>
          </div>
        </div>
      `;
    }).join("");

    itemsContainer.querySelectorAll("[data-qty-plus]").forEach(el =>
      el.addEventListener("click", () => changeQty(Number(el.dataset.qtyPlus), 1)));
    itemsContainer.querySelectorAll("[data-qty-minus]").forEach(el =>
      el.addEventListener("click", () => changeQty(Number(el.dataset.qtyMinus), -1)));
    itemsContainer.querySelectorAll("[data-remove]").forEach(el =>
      el.addEventListener("click", () => removeFromCart(Number(el.dataset.remove))));
  }

  if (totalCount > 0) {
    fabBadge.hidden = false;
    fabBadge.textContent = totalCount;
  } else {
    fabBadge.hidden = true;
  }

  document.getElementById("cartTotal").textContent = money(cartTotal());
  checkoutBtn.disabled = cart.length === 0;

  // Progreso hacia meta
  const progressFill = document.getElementById("cartProgressFill");
  const progressLabel = document.getElementById("cartProgressLabel");
  const pct = Math.min(100, (totalCount / CART_GOAL) * 100);
  progressFill.style.width = pct + "%";
  if (totalCount >= CART_GOAL) {
    progressLabel.textContent = "🎉 ¡Beneficio desbloqueado por cantidad de libros!";
  } else {
    progressLabel.textContent = `Añade ${CART_GOAL - totalCount} libro(s) más para desbloquear un beneficio especial.`;
  }
}

// Abrir/cerrar carrito
function openCart() {
  document.getElementById("cartSidebar").classList.add("open");
  document.getElementById("cartOverlay").hidden = false;
}
function closeCartFn() {
  document.getElementById("cartSidebar").classList.remove("open");
  document.getElementById("cartOverlay").hidden = true;
}
document.getElementById("cartFab").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCartFn);
document.getElementById("cartOverlay").addEventListener("click", closeCartFn);

// ============================================================
// WHATSAPP / COMPRA
// ============================================================
function buildWhatsAppMessage(items, notes) {
  let lines = ["Hola 🌿 quisiera hacer un pedido en The Secret Gardens Books:", ""];
  let total = 0;
  items.forEach(({ book, qty }) => {
    const subtotal = book.price * qty;
    total += subtotal;
    lines.push(`• ${book.title} — ${book.author} (${book.cover}) x${qty} — ${money(subtotal)}`);
  });
  lines.push("", `Total: ${money(total)}`);
  if (notes && notes.trim()) {
    lines.push("", `Notas: ${notes.trim()}`);
  }
  return lines.join("\n");
}

function buyNow(id) {
  const book = ALL_BOOKS.find(b => b.id === id);
  if (!book) return;
  if (!book.inStock) {
    showToast("Este libro está agotado por ahora 🌙");
    return;
  }
  const message = buildWhatsAppMessage([{ book, qty: 1 }], "");
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`, "_blank");
}

// Checkout: abre modal de confirmación
document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (!cart.length) return;
  openConfirmModal();
});

function openConfirmModal() {
  const container = document.getElementById("confirmItems");
  const notesVal = document.getElementById("cartNotes").value;
  container.innerHTML = cart.map(item => {
    const book = ALL_BOOKS.find(b => b.id === item.id);
    if (!book) return "";
    return `
      <div class="confirm-item">
        <img src="${book.img}" alt="${book.title}">
        <div class="ci-info">
          <div class="ci-title">${book.title}</div>
          <div class="ci-meta">${book.cover} · x${item.qty} · ${money(book.price * item.qty)}</div>
        </div>
      </div>
    `;
  }).join("");
  document.getElementById("confirmNotes").textContent = notesVal ? `Notas: ${notesVal}` : "";
  document.getElementById("confirmTotal").textContent = money(cartTotal());
  document.getElementById("confirmModalOverlay").hidden = false;
}

document.getElementById("closeConfirmModal").addEventListener("click", () => {
  document.getElementById("confirmModalOverlay").hidden = true;
});
document.getElementById("confirmModalOverlay").addEventListener("click", (e) => {
  if (e.target.id === "confirmModalOverlay") document.getElementById("confirmModalOverlay").hidden = true;
});
document.getElementById("editOrderBtn").addEventListener("click", () => {
  document.getElementById("confirmModalOverlay").hidden = true;
});
document.getElementById("sendOrderBtn").addEventListener("click", () => {
  const items = cart.map(item => ({ book: ALL_BOOKS.find(b => b.id === item.id), qty: item.qty })).filter(i => i.book);
  const notes = document.getElementById("cartNotes").value;
  const message = buildWhatsAppMessage(items, notes);
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`, "_blank");
  document.getElementById("confirmModalOverlay").hidden = true;
});

// ============================================================
// FILTROS: EVENTOS
// ============================================================
document.getElementById("searchInput").addEventListener("input", debounce(renderGrid, 300));
document.getElementById("clearSearch").addEventListener("click", () => {
  document.getElementById("searchInput").value = "";
  renderGrid();
});
document.getElementById("genreFilter").addEventListener("change", renderGrid);
document.getElementById("sortSelect").addEventListener("change", renderGrid);
document.getElementById("inStockFilter").addEventListener("change", renderGrid);

// ============================================================
// BURBUJA SOCIAL
// ============================================================
document.getElementById("socialBubble").addEventListener("click", () => {
  const menu = document.getElementById("socialMenu");
  menu.hidden = !menu.hidden;
});
document.addEventListener("click", (e) => {
  const wrap = document.querySelector(".social-bubble-wrap");
  if (!wrap.contains(e.target)) document.getElementById("socialMenu").hidden = true;
});

// ============================================================
// INICIO
// ============================================================
loadBooks();
