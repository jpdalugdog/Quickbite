# QuickBite — Local Food Delivery & Menu Website

A responsive, single-page food menu website built to practice web fundamentals before learning React. Customers can browse the menu, search and filter food, build an order, and view business info. This is a **practice project**: the business, phone number, and address are sample information, and there is no backend or payment.

## Technologies
HTML5 · CSS3 · Vanilla JavaScript · Git · GitHub · Vercel · QR Code

## Features
- Responsive design (desktop, tablet, mobile) with mobile menu
- Food menu rendered from a JavaScript array
- Search (case-insensitive) and category filtering that work together
- Order buttons, order counter, order summary
- Quantity controls (+ / −), remove item, dynamic total
- Contact information and Google Maps link
- QR code support

## Folder Structure
```
quickbite/
├── index.html
├── style.css
├── script.js
├── images/
└── README.md
```

## Images
The six food photos are already in the `images/` folder: `burger.jpg`, `pizza.jpg`, `fries.jpg`, `coffee.jpg`, `chicken.jpg`, `sandwich.jpg`. To replace one, keep the same file name and put it in `images/`. Tip: large photos load slowly on mobile data, so compress them (for example with squoosh.app) before deploying.

## How to Run Locally
1. Clone or download the project.
2. Open the folder in VS Code.
3. Open `index.html` in your browser, or right-click it and choose **Open with Live Server** (Live Server extension).

## Testing
- **Navigation:** click Home, Menu, About, Contact; the page should scroll smoothly.
- **Search:** type `burger`, `PIZZA`, then `xyz` (should show "No food items found.").
- **Filters:** click each category button. Then search `chicken` while on Burger: only Chicken Sandwich remains.
- **Order buttons and counter:** click Order on several items; the header counter goes up.
- **Order summary:** add the same item twice (quantity 2), use + / −, Remove, and check the total.
- **Place Order:** click with an empty order, then with items.
- **Mobile layout:** press F12 → Toggle Device Toolbar, try phone sizes, and check there is no horizontal scrolling.

## GitHub Deployment
VS Code → Git → GitHub. Create an empty repository on github.com first, then in the project folder run:
```
git init
git add .
git commit -m "Initial QuickBite website"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

## Vercel Deployment
1. Log into [vercel.com](https://vercel.com) with your GitHub account.
2. Click **Add New → Project** and import your GitHub repository.
3. Leave the settings as default (it is a static site) and click **Deploy**.
4. Copy the generated URL.
5. Open the URL and test the live website.

## QR Code
After Vercel gives you your real URL, paste it into a free QR code generator (for example, the one built into Google Chrome: open your site, click the share icon in the address bar, choose **Create QR code**, or use any online generator). Download the image and scan it with your phone to test: QR → website → menu → order.
