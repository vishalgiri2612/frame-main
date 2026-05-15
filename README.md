# FRAME | Luxury Eyewear Storefront

A premium, high-fashion e-commerce platform designed for the modern eyewear industry. Built with **Next.js 14**, **MongoDB**, and **Framer Motion**, FRAME combines an editorial aesthetic with cutting-edge technology.

---

## ✨ Key Features

### 🕶️ Premium Storefront
- **Dynamic Catalog**: Real-time inventory management with advanced filtering by brand, category, and style.
- **Editorial Experience**: A "Vogue-style" magazine section powered by automated AI content generation.
- **Virtual Try-On**: Experimental face-tracking technology for real-time eyewear visualization.

### 📊 Admin Ecosystem
- **Inventory Control**: Comprehensive product management with multi-image support and SKU tracking.
- **Order Logistics**: Real-time order tracking from pending to delivery.
- **Analytics Dashboard**: Visual KPI tracking (Revenue, Top Brands, Low Stock Alerts) using Recharts.

### 🔒 Enterprise Security
- **OWASP Hardened**: Implemented security headers (CSP, HSTS) and input sanitization.
- **Role-Based Access**: Strict RBAC for Admin and User portals via Next-Auth.
- **Database Integrity**: Unique indexing for SKUs, orders, and customer accounts.

---

## 🚀 Technology Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Vanilla CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://greensock.com/gsap/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **AI Integration**: [Google Gemini](https://ai.google.dev/) & [Pollinations.ai](https://pollinations.ai/)

---

## 🛠️ Getting Started

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory and add the following:
```env
DATABASE_URL=your_mongodb_uri
NEXTAUTH_SECRET=your_secret
CLOUDINARY_URL=your_cloudinary_url
GEMINI_API_KEY=your_google_ai_key
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📬 Integration & Support
For technical integration with external inventory software, refer to the [Integration Plan](file:///C:/Users/visha/.gemini/antigravity/brain/c6bf5458-23b4-494f-830f-552d65a12733/integration_plan.md).

---
*Created with ❤️ by Antigravity*
