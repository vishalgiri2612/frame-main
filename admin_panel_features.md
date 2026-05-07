# PART 1: ADMIN PANEL DOCUMENTATION

This section covers all tools and metrics designed for store administrators to manage inventory, sales, and logistics.

## 1. Authentication & Security
- **Admin Session Requirement**: All `/admin` routes are protected by a server-side session check (`requireAdminSession`).
- **Authorization**: Only users with an "ADMIN" role can access these pages.
- **Auto-Redirect**: Unauthorized access attempts are automatically redirected to the `/signin` page.

## 2. Dashboard Analytics
- **KPI Tracking**: Real-time cards for Total Revenue, Order Volume, Low Stock Alerts, and Customers.
- **Revenue Trend**: Interactive 30-day area chart powered by `Recharts`.
- **Brand Performance**: Horizontal bar chart showing sales volume by brand.
- **Inventory Health**: Visual widget tracking products that need immediate restocking.

## 3. Product Management (Catalog)
- **Advanced Inventory Fields**: Supports SNO, Brand, Category, Model No (SKU), Colour, Size, Amount (INR), and Extra Discount (%).
- **Multi-Image Support**: Upload up to **5 photos** per product. Features a "Main" image toggle and easy removal icons.
- **Dynamic Table**: A mobile-responsive 11-column table with optimized typography and hover effects.
- **Filter Suite**: Real-time search and dropdown filtering by Category and Status.

## 4. Order & Logistics
- **Transaction History**: View order numbers, customer names, dates, and amounts.
- **Status Management**: Track orders from "Pending" to "Confirmed".

## 5. Promotions & Coupon Management
- **Coupon Code Manager**: Full CRUD for discount codes with support for percentage/flat types, min order value, and usage limits.

## 6. System Tools

---
---

# PART 2: USER PROFILE DOCUMENTATION

This section covers the customer-facing portal where users manage their personal data, addresses, and order history.

## 1. Account & Membership
- **Personalized Greeting**: Dynamic "Namaste" welcome message.
- **Member Identity**: Displays Name, Email, and "Honored Member" status.
- **Heritage Content**: Integrates brand story elements directly into the profile view.

## 2. Address Management ("Coordinate Storage")
- **Multi-Address Support**: Save multiple locations with custom labels like "Home" or "Work".
- **Primary Destination**: Set a default shipping address for faster checkout.
- **Live Interaction**: Instant address addition and deletion with real-time UI updates.

## 3. Order History & Records
- **Personal Order List**: A complete history of all purchases with status tracking.
- **Item Previews**: Visual thumbnails of products included in each order.
- **Detailed Tracking**: Direct links to individual order summary pages.

## 4. Security & UX
- **Session Control**: Secure "Terminate Session" (Logout) functionality.
- **Luxury Aesthetic**: Sophisticated Navy/Gold/Cream theme with serif typography.
- **Fluid Motion**: Powered by `Framer Motion` for smooth tab switching and transitions.

---

## TECHNICAL ARCHITECTURE (PLATFORM-WIDE)
- **Framework**: Next.js 14 (App Router).
- **Database**: MongoDB (Atlas).
- **Core Libraries**: Lucide React, Recharts, Framer Motion, Lenis Smooth Scroll.
- **Design System**: Custom Zinc/Navy Aesthetic.

---
*Document Version: 4.0*
*Last Updated: 2026-05-06*
