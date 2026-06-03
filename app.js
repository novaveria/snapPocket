const WA_NUMBER = "6281234567890"; // Ganti dengan nomor WhatsApp SnapPocket

/* -------------------------------------------------------
       DATA PRODUK
       Berisi semua data produk yang ditampilkan di shop.
    ------------------------------------------------------- */
const products = [
  {
    id: 1,
    name: "Standard",
    label: "THE CLASSIC · SNAPPOCKET STARTER",
    price: 26000,
    desc: "Case bening + rantai minimalis. Simple, bersih, ikonik.",
    icon: "📷",
    photoBg: "#f0d8c8",
    photoSrc: "img/product-standard.jpg", // isi dengan: "foto-standard.jpg"
    hasBeads: false,
    hasSticker: false,
    bestValue: false,
  },
  {
    id: 2,
    name: "Standard + Custom Sticker",
    label: "Y2K VIBES, YOUR WAY",
    price: 27000,
    desc: "Case bening + sticker custom pilihan kamu. Vibes Y2K maksimal!",
    icon: "🌟",
    photoBg: "#d8e8d0",
    photoSrc: "img/product-sticker.jpg",
    hasBeads: false,
    hasSticker: true,
    bestValue: false,
  },
  {
    id: 3,
    name: "Standard + Beads",
    label: "BEAD IT YOUR WAY",
    price: 27622,
    desc: "Case bening + rangkaian beads warna-warni. Cantik & unik!",
    icon: "💎",
    photoBg: "#d0dff0",
    photoSrc: "img/product-beads.jpg",
    hasBeads: true,
    hasSticker: false,
    bestValue: false,
  },
  {
    id: 4,
    name: "Premium — All In",
    label: "STICKER + BEADS, FULLY LOADED",
    price: 28000,
    desc: "Semua ada! Case bening + sticker custom + beads. Full-loaded memories.",
    icon: "🏆",
    photoBg: "#f0e8c8",
    photoSrc: "img/product-premium.jpg",
    hasBeads: true,
    hasSticker: true,
    bestValue: true,
  },
];

/* -------------------------------------------------------
       STATE
       Menyimpan state keranjang dan modal yang sedang aktif.
    ------------------------------------------------------- */
let cart = []; // Array item di keranjang
let currentProduct = null; // Produk yang sedang dibuka modal-nya
let currentQty = 1; // Kuantitas di modal

/* -------------------------------------------------------
       renderProducts()
       Merender semua kartu produk ke dalam #productGrid.
    ------------------------------------------------------- */
function renderProducts() {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = products
    .map(
      (p) => `
        <div class="product-card reveal" onclick="openModal(${p.id})">
          <div class="product-img" style="background:${p.photoBg}">
            <img src="${p.photoSrc}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover">
            ${p.bestValue ? '<div class="best-value-badge">⭐ Best Value</div>' : ""}
          </div>
          <div class="product-info">
            <div class="product-meta">
              <span class="product-label">${p.label}</span>
              <span class="product-price">${formatRp(p.price)}</span>
            </div>
            <div class="product-name">${p.name}</div>
            <button class="add-to-cart-btn" onclick="event.stopPropagation();openModal(${p.id})">
              + Tambah ke Keranjang
            </button>
          </div>
        </div>
      `,
    )
    .join("");
}

/* -------------------------------------------------------
       formatRp(num)
       Mengubah angka menjadi format Rupiah (Rp26.022).
    ------------------------------------------------------- */
function formatRp(num) {
  return "Rp" + num.toLocaleString("id-ID");
}

/* -------------------------------------------------------
       openModal(productId)
       Membuka modal add-to-cart untuk produk tertentu.
    ------------------------------------------------------- */
function openModal(productId) {
  currentProduct = products.find((p) => p.id === productId);
  currentQty = 1;

  // Isi data modal
  document.getElementById("modalName").textContent = currentProduct.name;
  document.getElementById("modalPrice").textContent = formatRp(
    currentProduct.price,
  );
  document.getElementById("modalDesc").textContent = currentProduct.desc;
  document.getElementById("modalImg").innerHTML =
    `<img src="${currentProduct.photoSrc}" alt="${currentProduct.name}" style="width:100%;height:100%;object-fit:cover;border-radius:24px 24px 0 0">`;
  document.getElementById("qtyNum").textContent = currentQty;

  // Tampilkan/sembunyikan section beads & sticker sesuai produk
  document.getElementById("beadsSection").style.display =
    currentProduct.hasBeads ? "block" : "none";
  document.getElementById("stickerSection").style.display =
    currentProduct.hasSticker ? "block" : "none";

  // Reset tombol option ke pilihan pertama (selected)
  document.querySelectorAll(".option-btn").forEach((btn) => {
    const isFirst = btn === btn.parentElement.firstElementChild;
    btn.classList.toggle("selected", isFirst);
  });

  updateAddBtn();

  // Buka overlay
  document.getElementById("productModal").classList.add("open");
  document.body.style.overflow = "hidden";
}

/* -------------------------------------------------------
       closeModal()
       Menutup modal add-to-cart.
    ------------------------------------------------------- */
function closeModal() {
  document.getElementById("productModal").classList.remove("open");
  document.body.style.overflow = "";
}

/* -------------------------------------------------------
       handleModalOverlayClick(e)
       Menutup modal jika klik di luar sheet (overlay).
    ------------------------------------------------------- */
function handleModalOverlayClick(e) {
  if (e.target.id === "productModal") closeModal();
}

/* -------------------------------------------------------
       selectOption(btn, group)
       Menandai opsi yang dipilih dalam satu group (radio-style).
    ------------------------------------------------------- */
function selectOption(btn, group) {
  btn
    .closest(".option-grid")
    .querySelectorAll(".option-btn")
    .forEach((b) => b.classList.remove("selected"));
  btn.classList.add("selected");
}

/* -------------------------------------------------------
       changeQty(delta)
       Mengubah kuantitas (+1 atau -1) di modal, minimal 1.
    ------------------------------------------------------- */
function changeQty(delta) {
  currentQty = Math.max(1, currentQty + delta);
  document.getElementById("qtyNum").textContent = currentQty;
  updateAddBtn();
}

/* -------------------------------------------------------
       updateAddBtn()
       Memperbarui teks tombol "Tambah ke Keranjang" dengan harga total.
    ------------------------------------------------------- */
function updateAddBtn() {
  if (!currentProduct) return;
  const total = currentProduct.price * currentQty;
  document.getElementById("addBtn").textContent =
    `+ Keranjang ${formatRp(total)}`;
}

/* -------------------------------------------------------
       getSelectedOptions()
       Mengumpulkan semua opsi yang dipilih dari modal sebagai objek.
    ------------------------------------------------------- */
function getSelectedOptions() {
  const opts = {};
  document.querySelectorAll(".option-btn.selected").forEach((btn) => {
    // Hanya ambil opsi dari section yang ditampilkan
    const section = btn.closest(".modal-section");
    if (section && section.style.display !== "none") {
      opts[btn.dataset.group] = btn.dataset.val;
    }
  });
  return opts;
}

/* -------------------------------------------------------
       addToCart()
       Menambahkan produk beserta opsi ke array cart,
       lalu menutup modal dan memperbarui tampilan keranjang.
    ------------------------------------------------------- */
function addToCart() {
  const opts = getSelectedOptions();
  const optsStr = Object.values(opts).join(" · ");

  // Cek apakah item dengan kombinasi yang sama sudah ada di keranjang
  const existing = cart.find(
    (item) => item.id === currentProduct.id && item.optsStr === optsStr,
  );

  if (existing) {
    existing.qty += currentQty; // Tambah kuantitas
  } else {
    cart.push({
      id: currentProduct.id,
      name: currentProduct.name,
      icon: currentProduct.icon,
      price: currentProduct.price,
      qty: currentQty,
      optsStr,
      uid: Date.now(), // ID unik per item
    });
  }

  closeModal();
  renderCart();
  updateCartBadge();

  // Tampilkan notifikasi singkat
  showToast(`✓ ${currentProduct.name} ditambahkan!`);
}

/* -------------------------------------------------------
       renderCart()
       Merender ulang daftar item dan total harga di sidebar keranjang.
    ------------------------------------------------------- */
function renderCart() {
  const container = document.getElementById("cartItems");
  if (cart.length === 0) {
    container.innerHTML =
      '<div class="cart-empty">Keranjang masih kosong 🛒</div>';
    document.getElementById("cartTotal").textContent = "Rp0";
    return;
  }

  container.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item" data-uid="${item.uid}">
          <div class="cart-item-icon">${item.icon}</div>
          <div style="flex:1">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-opts">${item.optsStr || "Standard"} · x${item.qty}</div>
            <div class="cart-item-price">${formatRp(item.price * item.qty)}</div>
          </div>
          <button class="cart-item-remove" onclick="removeFromCart(${item.uid})" title="Hapus">✕</button>
        </div>
      `,
    )
    .join("");

  // Hitung total
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  document.getElementById("cartTotal").textContent = formatRp(total);
}

/* -------------------------------------------------------
       removeFromCart(uid)
       Menghapus satu item dari keranjang berdasarkan uid-nya.
    ------------------------------------------------------- */
function removeFromCart(uid) {
  cart = cart.filter((item) => item.uid !== uid);
  renderCart();
  updateCartBadge();
}

/* -------------------------------------------------------
       updateCartBadge()
       Memperbarui angka badge di ikon keranjang di navbar.
    ------------------------------------------------------- */
function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  badge.textContent = totalQty;
  badge.style.display = totalQty > 0 ? "flex" : "none";
}

/* -------------------------------------------------------
       openCart() / closeCart()
       Membuka dan menutup sidebar keranjang.
    ------------------------------------------------------- */
function openCart() {
  document.getElementById("cartOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeCart() {
  document.getElementById("cartOverlay").classList.remove("open");
  document.body.style.overflow = "";
}
function handleCartOverlayClick(e) {
  if (e.target.id === "cartOverlay") closeCart();
}

/* -------------------------------------------------------
       openQRModal()
       Membuka modal QR code untuk pembayaran.
       Menampilkan total yang harus dibayar.
    ------------------------------------------------------- */
function openQRModal() {
  if (cart.length === 0) {
    showToast("Keranjang masih kosong!");
    return;
  }
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  document.getElementById("qrAmount").textContent = formatRp(total);
  document.getElementById("qrOverlay").classList.add("open");
}

/* -------------------------------------------------------
       closeQRModal()
       Menutup modal QR code.
    ------------------------------------------------------- */
function closeQRModal() {
  document.getElementById("qrOverlay").classList.remove("open");
}
function handleQROverlayClick(e) {
  if (e.target.id === "qrOverlay") closeQRModal();
}

/* -------------------------------------------------------
       confirmPayment()
       Membuka WhatsApp dengan pesan otomatis berisi daftar
       barang dari keranjang dan total harga.
    ------------------------------------------------------- */
function confirmPayment() {
  if (cart.length === 0) return;
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const items = cart
    .map((item) => {
      const opts = item.optsStr ? ` (${item.optsStr})` : "";
      return `${item.name}${opts} x${item.qty}`;
    })
    .join(", ");
  const message = `Hallo kak, saya ingin membeli ${items} dengan total harga ${formatRp(total)}. Berikut bukti pembayarannya:`;
  window.open(
    `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`,
    "_blank",
  );
}

/* -------------------------------------------------------
       showToast(message)
       Menampilkan notifikasi kecil di bawah layar selama 2 detik.
    ------------------------------------------------------- */
function showToast(message) {
  // Buat elemen toast jika belum ada
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    Object.assign(toast.style, {
      position: "fixed",
      bottom: "24px",
      left: "50%",
      transform: "translateX(-50%) translateY(80px)",
      background: "#1a1a1a",
      color: "#fff",
      padding: "12px 24px",
      borderRadius: "50px",
      fontSize: ".88rem",
      fontWeight: "600",
      zIndex: "999",
      transition: "transform .3s",
      whiteSpace: "nowrap",
      boxShadow: "0 4px 20px rgba(0,0,0,.25)",
    });
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.transform = "translateX(-50%) translateY(0)"; // Tampilkan
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.transform = "translateX(-50%) translateY(80px)"; // Sembunyikan
  }, 2000);
}

/* -------------------------------------------------------
       scrollToShop()
       Scroll halus ke section shop.
    ------------------------------------------------------- */
function scrollToShop() {
  document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
}

/* -------------------------------------------------------
       toggleMenu() / closeMenu()
       Membuka/menutup menu mobile (hamburger).
    ------------------------------------------------------- */
function toggleMenu() {
  document.getElementById("mobileMenu").classList.toggle("open");
}
function closeMenu() {
  document.getElementById("mobileMenu").classList.remove("open");
}

/* -------------------------------------------------------
       initScrollReveal()
       Mengaktifkan animasi reveal saat elemen masuk viewport.
       Menggunakan IntersectionObserver untuk performa optimal.
    ------------------------------------------------------- */
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.12 },
  );

  // Observe semua elemen dengan class .reveal
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

/* -------------------------------------------------------
       initNavHighlight()
       Memperbarui link aktif di navbar berdasarkan scroll position.
    ------------------------------------------------------- */
function initNavHighlight() {
  const sections = ["home", "shop", "about", "order"];
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY + 80;
    let active = "home";
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= scrollY) active = id;
    });
    document.querySelectorAll(".nav-links a").forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === "#" + active);
    });
  });
}

/* -------------------------------------------------------
       INIT
       Jalankan semua fungsi inisialisasi saat DOM siap.
    ------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  renderProducts(); // Render kartu produk
  renderCart(); // Render keranjang awal (kosong)
  initScrollReveal(); // Aktifkan animasi scroll
  initNavHighlight(); // Aktifkan highlight navbar
});

// Re-observe setelah produk dirender (karena DOM berubah)
const origRender = renderProducts;
renderProducts = function () {
  origRender();
  setTimeout(initScrollReveal, 50);
};
