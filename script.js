// ---------- 1. DATA ----------
// An array of objects: each object describes one food item.
const menuItems = [
  { name: "Classic Burger", category: "Burger", price: 99, image: "images/burger.jpg", description: "Beef patty, cheese, lettuce and special sauce." },
  { name: "Pepperoni Pizza", category: "Pizza", price: 149, image: "images/pizza.jpg", description: "Cheesy pizza topped with delicious pepperoni." },
  { name: "Crispy Fries", category: "Snacks", price: 59, image: "images/fries.jpg", description: "Golden crispy fries seasoned to perfection." },
  { name: "Iced Coffee", category: "Drinks", price: 49, image: "images/coffee.jpg", description: "Cold and refreshing creamy iced coffee." },
  { name: "Crispy Chicken", category: "Snacks", price: 119, image: "images/chicken.jpg", description: "Crunchy fried chicken with a flavorful coating." },
  { name: "Chicken Sandwich", category: "Burger", price: 89, image: "images/sandwich.jpg", description: "Tender chicken, fresh lettuce and creamy sauce." }
];

const popularNames = ["Classic Burger", "Pepperoni Pizza", "Crispy Fries", "Iced Coffee"];

// ---------- 2. STATE ----------
// "State" is the data the page remembers. The screen is redrawn from it.
let searchText = "";
let activeCategory = "All";
let order = []; // each entry: { name, price, quantity }

// ---------- 3. DOM ELEMENTS ----------
const menuGrid = document.getElementById("menu-grid");
const favoritesGrid = document.getElementById("favorites-grid");
const noResults = document.getElementById("no-results");
const searchInput = document.getElementById("search-input");
const filterButtons = document.querySelectorAll(".filter-btn");
const orderList = document.getElementById("order-list");
const orderEmpty = document.getElementById("order-empty");
const orderTotal = document.getElementById("order-total");
const orderCounter = document.getElementById("order-counter");
const orderMessage = document.getElementById("order-message");
const placeOrderButton = document.getElementById("place-order");
const checkoutButton = document.getElementById("checkout-button");
const checkoutForm = document.getElementById("checkout-form");
const checkoutOrderSummary = document.getElementById("checkout-order-summary");
const customerSummary = document.getElementById("customer-summary");
const checkoutSuccess = document.getElementById("checkout-success");
const backToMenuButton = document.getElementById("back-to-menu");
const printReceiptButton = document.getElementById("print-receipt");
const orderInfo = document.getElementById("order-info");
const navToggle = document.getElementById("nav-toggle");
const mainNav = document.getElementById("main-nav");

// ---------- 4. MENU RENDERING ----------
function formatPrice(amount) {
  return "₱" + amount;
}

// Builds the HTML for one card. data-name lets the click handler know which item was clicked.
function createCard(item) {
  return `
    <article class="food-card">
      <img src="${item.image}" alt="${item.name}" loading="lazy">
      <div class="card-body">
        <span class="card-category">${item.category}</span>
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <p class="card-price">${formatPrice(item.price)}</p>
        <button class="btn btn-primary order-btn" data-name="${item.name}">Order</button>
      </div>
    </article>`;
}

function renderFavorites() {
  const favorites = menuItems.filter(item => popularNames.includes(item.name));
  favoritesGrid.innerHTML = favorites.map(createCard).join("");
}

// Search AND category filter work together: an item must pass both tests.
function renderMenu() {
  const visibleItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const text = searchText.toLowerCase(); // lowercase = case-insensitive search
    const matchesSearch =
      item.name.toLowerCase().includes(text) ||
      item.category.toLowerCase().includes(text) ||
      item.description.toLowerCase().includes(text);
    return matchesCategory && matchesSearch;
  });
  menuGrid.innerHTML = visibleItems.map(createCard).join("");
  noResults.hidden = visibleItems.length > 0;
}

// ---------- 5. ORDER LOGIC ----------
function addToOrder(name) {
  const existing = order.find(entry => entry.name === name);
  if (existing) {
    existing.quantity += 1; // same item again: just increase quantity
  } else {
    const item = menuItems.find(food => food.name === name);
    order.push({ name: item.name, price: item.price, quantity: 1 });
  }
  orderMessage.textContent = name + " added to your order!";
  renderOrder();
  saveOrder();
}

function changeQuantity(name, change) {
  const entry = order.find(item => item.name === name);
  entry.quantity += change;

  if (entry.quantity <= 0) {
    removeFromOrder(name);
  } else {
    renderOrder();
    saveOrder();
  }
}

function removeFromOrder(name) {
  order = order.filter(item => item.name !== name);
  renderOrder();
  saveOrder();
}

function renderOrder() {
  const totalItems = order.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = order.reduce((sum, item) => sum + item.price * item.quantity, 0);


  orderCounter.textContent = totalItems;
  orderTotal.textContent = formatPrice(totalPrice);
  orderEmpty.hidden = order.length > 0;

  orderList.innerHTML = order.map(item => `
    <li class="order-item">
      <div class="order-item-name">${item.name}</div>
      <div>${formatPrice(item.price)} × ${item.quantity} = ${formatPrice(item.price * item.quantity)}</div>
      <div class="order-item-row">
        <button class="qty-btn" data-action="decrease" data-name="${item.name}" aria-label="Decrease ${item.name} quantity">-</button>
        <span>${item.quantity}</span>
        <button class="qty-btn" data-action="increase" data-name="${item.name}" aria-label="Increase ${item.name} quantity">+</button>
        <button class="remove-btn" data-action="remove" data-name="${item.name}">Remove</button>
      </div>
    </li>`).join("");
}
  function saveOrder() {
  localStorage.setItem("quickbiteOrder", JSON.stringify(order));
}

// ---------- 6. EVENTS ----------
// Event delegation: one listener on the parent handles clicks on buttons
// that are created dynamically (they did not exist when the page loaded).
function handleOrderClick(event) {
  const button = event.target.closest(".order-btn");
  if (button) addToOrder(button.dataset.name);
}
menuGrid.addEventListener("click", handleOrderClick);
favoritesGrid.addEventListener("click", handleOrderClick);

orderList.addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;
  const name = button.dataset.name;
  if (button.dataset.action === "increase") changeQuantity(name, 1);
  if (button.dataset.action === "decrease") changeQuantity(name, -1);
  if (button.dataset.action === "remove") removeFromOrder(name);
});

searchInput.addEventListener("input", () => {
  searchText = searchInput.value.trim();
  renderMenu();
});

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    renderMenu();
  });
});

placeOrderButton.addEventListener("click", () => {
  if (order.length === 0) {
    orderMessage.textContent = "Your order is empty.";
    return;
  }

  order = [];
  renderOrder();
  saveOrder();

  orderMessage.textContent = "Thank you for your order! Your order has been received. (Practice project: no real order was sent.)";
});

checkoutButton.addEventListener("click", () => {
  if (order.length === 0) {
    orderMessage.textContent = "Your order is empty.";
    return;
  }

  orderMessage.textContent = "Checkout is ready!";
});

checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const customerName = document.getElementById("customer-name").value;
  const customerPhone = document.getElementById("customer-phone").value;
  const customerAddress = document.getElementById("customer-address").value;

  const totalPrice = order.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const now = new Date();

const orderId =
  "QB-" +
  now.getFullYear() +
  String(now.getMonth() + 1).padStart(2, "0") +
  String(now.getDate()).padStart(2, "0") +
  "-" +
  Math.floor(100 + Math.random() * 900);

const orderDate = now.toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric"
});

const orderTime = now.toLocaleTimeString("en-US", {
  hour: "numeric",
  minute: "2-digit"
});

orderInfo.innerHTML = `
  <div class="order-info-box">
    <p><strong>Order ID:</strong> ${orderId}</p>
    <p><strong>Date:</strong> ${orderDate}</p>
    <p><strong>Time:</strong> ${orderTime}</p>
  </div>
`;

  customerSummary.innerHTML = `
  <h4>Customer Information</h4>
  <p><strong>Name:</strong> ${customerName}</p>
  <p><strong>Phone:</strong> ${customerPhone}</p>
  <p><strong>Address:</strong> ${customerAddress}</p>
`;

  checkoutOrderSummary.innerHTML = `
    <h4>Order Summary</h4>

    ${order.map(item => `
      <p>
        ${item.name} × ${item.quantity}
        — ${formatPrice(item.price * item.quantity)}
      </p>
    `).join("")}

    <p><strong>Total: ${formatPrice(totalPrice)}</strong></p>
  `;
  const checkoutSuccess = document.getElementById("checkout-success");
  checkoutSuccess.hidden = false; 

  order = [];
  renderOrder();
  saveOrder();

  console.log("Customer Name:", customerName);
  console.log("Phone:", customerPhone);
  console.log("Address:", customerAddress);
});


// Mobile menu: toggle the "open" class and close it after choosing a link.
navToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen);
});
mainNav.addEventListener("click", event => {
  if (event.target.closest("a")) {
    mainNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

backToMenuButton.addEventListener("click", () => {
  checkoutSuccess.hidden = true;
  checkoutForm.reset();

  document.getElementById("menu").scrollIntoView({
    behavior: "smooth"
  });
});

printReceiptButton.addEventListener("click", () => {
  window.print();
});

// ---------- 7. START ----------

const savedOrder = localStorage.getItem("quickbiteOrder");

if (savedOrder) {
  order = JSON.parse(savedOrder);
}

renderFavorites();
renderMenu();
renderOrder();

