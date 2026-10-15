/* ====== EDIT HERE ====== */
const CONFIG = { brand: "Salman Shoes", wa: "923001234567", /* country code + number, no + or spaces */
  email: "info@salmanshoes.com", city: "Lahore, Pakistan" };
const PRODUCTS = [
  { id: 1, name: "Green Runner", cat: "sneakers", price: 3499, img: "images/green-runner.jpg" },
  { id: 2, name: "Black Air Runner", cat: "sports", price: 4299, img: "images/black-air-runner.jpg" },
  { id: 3, name: "Black Skechers Style", cat: "sneakers", price: 3999, img: "images/black-skechers.jpg" },
  { id: 4, name: "White & Black Casual", cat: "sneakers", price: 3799, img: "images/white-black-casual.jpg" },
  { id: 5, name: "Blue & White Casual", cat: "sneakers", price: 3699, img: "images/blue-white-casual.jpg" },
  { id: 6, name: "Black Orange Sport", cat: "sports", price: 3599, img: "images/black-orange-sport.jpg" },
  { id: 7, name: "Brown Formal", cat: "formal", price: 4999, img: "images/brown-formal.jpg" },
  { id: 8, name: "Black Runner", cat: "sports", price: 4199, img: "images/black-runner.jpg" }
];
/* ======================== */
const $ = (s, el = document) => el.querySelector(s), $$ = (s, el = document) => [...el.querySelectorAll(s)];
const rs = n => "Rs. " + n.toLocaleString("en-PK");
const PH = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120"><path d="M14 80Q12 56 34 52l30-10Q80 20 100 32l14 16q40 6 70 18 12 5 10 18H14Z" fill="#2a2f3a"/><rect x="12" y="82" width="176" height="14" rx="7" fill="#fff" stroke="#d0d5dd"/></svg>');
let cart = []; try { cart = JSON.parse(localStorage.getItem("cart") || "[]"); } catch (e) {}
const save = () => { try { localStorage.setItem("cart", JSON.stringify(cart)); } catch (e) {} };
const wa = t => `https://wa.me/${CONFIG.wa}?text=${encodeURIComponent(t)}`;

const pages = [["index", "Home"], ["services", "Services"], ["skills", "Skills"], ["experience", "Experience"], ["contact", "Contact Us"]];
const cur = document.body.dataset.page;
document.body.insertAdjacentHTML("afterbegin", `
<header><div class="wrap nav">
  <a class="logo" href="index.html"><i>S</i>SALMAN <b>SHOES</b></a>
  <nav id="nav" aria-label="Main"><ul>${pages.map(([f, n]) => `<li><a href="${f}.html" class="${f === cur ? "on" : ""}">${n}</a></li>`).join("")}</ul></nav>
  <div class="right"><button class="btn" id="cartBtn">Cart (<span id="cnt">0</span>)</button>
  <button id="menu" aria-label="Menu">☰</button></div></div></header>`);
document.body.insertAdjacentHTML("beforeend", `
<footer><div class="wrap"><p>© ${new Date().getFullYear()} ${CONFIG.brand} · ${CONFIG.city} · ${CONFIG.email}</p></div></footer>
<a class="wa-float" href="${wa("Assalam o Alaikum! I want to know about your shoes.")}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">💬</a>
<aside id="drawer" aria-label="Cart"><div class="row" style="border:0"><h2>Your Cart</h2><button id="close" aria-label="Close">✕</button></div>
<div id="items"></div><p class="price" id="total"></p><a class="btn wa" id="order" target="_blank" rel="noopener">Order on WhatsApp</a></aside>
<div id="toast"></div>`);
$("#menu").onclick = () => $("#nav").classList.toggle("open");
$("#cartBtn").onclick = () => $("#drawer").classList.add("open");
$("#close").onclick = () => $("#drawer").classList.remove("open");
$$("[data-wa]").forEach(a => a.href = wa("Hello " + CONFIG.brand + "!"));

function toast(t) { const e = $("#toast"); e.textContent = t; e.classList.add("show"); setTimeout(() => e.classList.remove("show"), 1800); }
function renderCart() {
  $("#cnt").textContent = cart.reduce((a, c) => a + c.q, 0);
  const price = id => PRODUCTS.find(p => p.id === id);
  const total = cart.reduce((a, c) => a + c.q * price(c.id).price, 0);
  $("#items").innerHTML = cart.length ? cart.map(c => { const p = price(c.id);
    return `<div class="row"><span>${p.name}<br><small>${rs(p.price)}</small></span><span><button data-d="-1" data-id="${c.id}">−</button> ${c.q} <button data-d="1" data-id="${c.id}">+</button></span></div>`; }).join("") : `<p class="empty">Your cart is empty.</p>`;
  $("#total").textContent = cart.length ? "Total: " + rs(total) : "";
  const lines = cart.map(c => `• ${price(c.id).name} x${c.q} = ${rs(price(c.id).price * c.q)}`);
  $("#order").href = wa(cart.length ? `Hello ${CONFIG.brand}, I want to order:\n${lines.join("\n")}\nTotal: ${rs(total)}` : "Hello! I want to place an order.");
  save();
}
$("#items").onclick = e => { const b = e.target.closest("button"); if (!b) return;
  const c = cart.find(c => c.id == b.dataset.id); c.q += +b.dataset.d; cart = cart.filter(c => c.q > 0); renderCart(); };
function addToCart(id) { const c = cart.find(c => c.id === id); c ? c.q++ : cart.push({ id, q: 1 }); renderCart(); toast("Added to cart"); }

const grid = $("#products");
if (grid) {
  const show = cat => { grid.innerHTML = PRODUCTS.filter(p => cat === "all" || p.cat === cat).map(p => `
    <article class="card prod"><img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.onerror=null;this.src=PH">
    <h3>${p.name}</h3><div class="stars">★★★★★ <em>(5.0)</em></div><div class="price">${rs(p.price)}</div>
    <button class="btn dark" data-add="${p.id}">Add to Cart</button></article>`).join(""); };
  grid.onclick = e => { const b = e.target.closest("[data-add]"); if (b) addToCart(+b.dataset.add); };
  $$("[data-cat]").forEach(b => b.onclick = () => { $$("[data-cat]").forEach(x => x.classList.remove("on")); b.classList.add("on"); show(b.dataset.cat); $("#shop").scrollIntoView(); });
  show("all");
}
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.style.width = e.target.dataset.w + "%"; io.unobserve(e.target); } }));
$$(".bar b").forEach(b => io.observe(b));
const f = $("#cform");
if (f) f.onsubmit = e => { e.preventDefault(); const d = new FormData(f);
  window.open(wa(`Hello ${CONFIG.brand}!\nName: ${d.get("name")}\nPhone: ${d.get("phone")}\nMessage: ${d.get("msg")}`), "_blank"); };
renderCart();
