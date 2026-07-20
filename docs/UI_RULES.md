# Stay Home E-Commerce - UI Rules & Styling Guide

This guide ensures modifications to frontend files preserve the premium visual identity and structural consistency of the **Stay Home** application.

---

## 🎨 Visual Identity & Color System

The website relies on the custom typography **Spartan (League Spartan)** and a distinct color palette configured in `style.css`:

| Color Token | Variable Role | Value / Hex Code |
| :--- | :--- | :--- |
| Primary Dark | Dark text, headings, buttons | `#1a1a1a` |
| Primary Light Green | Active links, highlights, discounts | `#088178` |
| Primary Light Grey | Sub-headers, metadata, border grids | `#818181` |
| Background Neutral | Webpage backing | `#e3e6f3` |
| Secondary Accent | Alerts, crazy deals backing | `#ffbd27` / `#fe8b80` |

---

## 📐 Utility Grid and Spacing Rules

All sections must carry standardized padding to preserve vertical alignment:
* **Section Padding:** Use class `section-p1` which applies `padding: 40px 80px`.
* **Section Margin:** Use class `section-m1` which applies `margin: 40px 0px`.

### Buttons
Standard buttons must use class `normal` (or `white`/`black` for secondary banners):
* **Class `.normal` Style:** Rounded borders, transitions on hover (`background-color: #088178`, `color: #fff`).

---

## 📱 Responsiveness (Media Queries)
The template supports mobile views:
* **Desktop Grid:** Custom flex displays.
* **Mobile Breakpoints:**
  * `@media (max-width: 799px)`: Header changes to display mobile menu hamburger triggers. Side nav becomes slide-out drawers.
  * `@media (max-width: 477px)`: Grid items (features, products) stack vertically.

---

## 🛑 UI Design Constraints & Rules

* **Never change CSS class names:** Keep all selectors, grids, and identifiers intact.
* **Never modify responsive breakpoints:** Keep media queries exactly as configured in `style.css`.
* **Never change HTML structure:** Preserve layout architecture (headers, banners, footer blocks).
* **Reuse existing components:** Align new dynamic rendering elements with the current markup templates.
* **Use Fetch API only:** Client-side communication to REST routes must be done using Vanilla JS Fetch API.
* **Do not introduce React or other frameworks:** Preserve the lightweight nature of this project (keep HTML, CSS, JS separate).
* **Keep UI pixel-consistent with the original template:** All styling tweaks must align perfectly with standard grid alignments.
