import { getDb } from './mongodb';
import { ObjectId } from 'mongodb';

/**
 * Normalizes and processes a raw product object into the rich format expected by the UI.
 */
export function processProduct(p) {
  const specs = [];
  const sections = {
    intro: [],
    frame: [],
    lens: [],
    dimensions: [],
    fitting: [],
    manufacturing: [],
    features: []
  };

  let currentSection = 'intro';

  if (p.description) {
    const lines = p.description.split('\n');
    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // Identify sections
      if (trimmed === 'FRAME DESCRIPTION') { currentSection = 'frame'; return; }
      if (trimmed === 'LENS INFORMATION') { currentSection = 'lens'; return; }
      if (trimmed === 'PRODUCT DIMENSIONS') { currentSection = 'dimensions'; return; }
      if (trimmed === 'FITTING') { currentSection = 'fitting'; return; }
      if (trimmed === 'Manufacturing, Packaging and Import Info' || trimmed === 'MANUFACTURING & IMPORT DATA') { currentSection = 'manufacturing'; return; }
      if (trimmed === 'Included in your order:') { currentSection = 'features'; return; }

      if (trimmed.includes(':')) {
        const [label, ...valParts] = trimmed.split(':');
        const spec = { label: label.trim(), value: valParts.join(':').trim() };
        specs.push(spec);
        if (sections[currentSection]) {
          if (currentSection === 'intro' || currentSection === 'features') {
            sections[currentSection].push(`${spec.label}: ${spec.value}`);
          } else {
            sections[currentSection].push(spec);
          }
        }
      } else {
        // Filter out uppercase section headers
        if (trimmed === trimmed.toUpperCase() && trimmed.length > 5) {
          return;
        }
        if (sections[currentSection]) {
          sections[currentSection].push(trimmed);
        }
      }
    });
  }

  const id = p.id || p.sku || p.slug || p._id?.toString();
  const brandSlug = p.brandSlug || p.brand?.toLowerCase().replace(/\s+/g, '-');
  const categorySlug = p.categorySlug || p.category?.toLowerCase().replace(/\s+/g, '-');

  return {
    ...p,
    id: id,
    _id: p._id?.toString(),
    brandSlug,
    categorySlug,
    details: p.category + ' / SUN',
    price: (!p.price || p.price <= 0) ? 0 : p.price,
    stockLabel: (p.stock > 10) ? 'IN STOCK' : (p.stock > 0 ? 'LIMITED' : 'OUT OF STOCK'),
    specs: specs.length > 0 ? specs : [{ label: 'Type', value: 'Sunglasses' }],
    sections,
    isNew: p.newArrival || (p.createdAt ? (new Date() - new Date(p.createdAt) < 30 * 24 * 60 * 60 * 1000) : false),
    features: (sections.features.length > 0) ? sections.features : ['Iconic Protective Case', 'High-Fidelity Cleaning Cloth', 'Global Warranty Certificate'],
  };
}

// ─── LOCAL FETCHING (FALLBACK) ───────────────────────────────────────────────
// We now rely on MongoDB, local fallback remains as an empty state.
const localProducts = [];

export function getProducts() {
  return localProducts.map((product) => ({ ...product }));
}

export function getProductById(id) {
  return localProducts.find((product) => product.id === id || product.slug === id || product._id === id) || null;
}

// ─── DATABASE FETCHING (PROPER) ──────────────────────────────────────────────

export async function getProductsDB() {
  try {
    const db = await getDb();
    const rawItems = await db.collection("products").find({ status: "ACTIVE" }).toArray();
    return rawItems.map(processProduct);
  } catch (error) {
    console.error("DB_FETCH_PRODUCTS_ERROR", error);
    return getProducts(); // Fallback to local
  }
}

export async function getProductByIdDB(id) {
  try {
    const db = await getDb();
    const idClean = id.trim();
    let query = { $or: [
      { sku: idClean }, 
      { slug: idClean }, 
      { id: idClean },
      { sku: idClean.replace(/-/g, ' ') }, // Try matching with spaces instead of dashes
      { sku: idClean.replace(/\s+/g, '-') }, // Try matching with dashes instead of spaces
    ] };

    if (ObjectId.isValid(id) && id.length === 24) {
      query.$or.push({ _id: new ObjectId(id) });
    }

    const raw = await db.collection("products").findOne(query);
    return raw ? processProduct(raw) : null;
  } catch (error) {
    console.error("DB_FETCH_PRODUCT_BY_ID_ERROR", error);
    return getProductById(id);
  }
}

export async function getFeaturedProductsDB(limit = 6) {
  try {
    const db = await getDb();
    const rawItems = await db.collection("products")
      .find({ status: "ACTIVE", featured: true })
      .limit(limit)
      .toArray();
    
    if (rawItems.length === 0) {
      // Fallback if no featured products
      return (await db.collection("products")
        .find({ status: "ACTIVE" })
        .limit(limit)
        .toArray()).map(processProduct);
    }
    
    return rawItems.map(processProduct);
  } catch (error) {
    console.error("DB_FETCH_FEATURED_ERROR", error);
    return [];
  }
}

export async function getTopSellingProductsDB(limit = 5) {
  try {
    const db = await getDb();
    const rawItems = await db.collection("products")
      .find({ status: "ACTIVE", topSelling: true })
      .limit(limit)
      .toArray();
    
    if (rawItems.length === 0) {
      // Fallback: just get any 5 active products if none are marked as topSelling
      const fallbackItems = await db.collection("products")
        .find({ status: "ACTIVE" })
        .limit(limit)
        .toArray();
      return fallbackItems.map(processProduct);
    }
    
    return rawItems.map(processProduct);
  } catch (error) {
    console.error("DB_FETCH_TOP_SELLING_ERROR", error);
    return [];
  }
}

export async function getSimilarProductsDB(product, limit = 4) {
  if (!product) return [];
  try {
    const db = await getDb();
    const query = {
      status: "ACTIVE",
      id: { $ne: product.id },
      $or: [
        { category: product.category },
        { brand: product.brand }
      ]
    };
    
    const rawItems = await db.collection("products")
      .find(query)
      .limit(limit)
      .toArray();
      
    return rawItems.map(processProduct);
  } catch (error) {
    console.error("DB_FETCH_SIMILAR_ERROR", error);
    return [];
  }
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

export async function getBrandsDB() {
  try {
    const db = await getDb();
    const brands = await db.collection("products").aggregate([
      { $match: { status: "ACTIVE" } },
      { $group: { 
          _id: "$brand", 
          slug: { $first: "$brandSlug" },
          name: { $first: "$brand" },
          count: { $sum: 1 } 
      } },
      { $project: {
          _id: 0,
          name: 1,
          slug: { $ifNull: [ "$slug", { $replaceAll: { input: { $toLower: "$name" }, find: " ", replacement: "-" } } ] },
          count: 1
      } },
      { $sort: { name: 1 } }
    ]).toArray();
    return brands;
  } catch (error) {
    console.error("DB_FETCH_BRANDS_ERROR", error);
    return [];
  }
}

export async function getAllAvailableBrandsDB() {
  try {
    const db = await getDb();
    
    // Get product brands and their counts for ACTIVE products with STOCK > 0
    const productBrands = await db.collection("products").aggregate([
      { $match: { status: "ACTIVE", stock: { $gt: 0 } } },
      { $group: { 
          _id: "$brand", 
          slug: { $first: "$brandSlug" },
          count: { $sum: 1 } 
      } },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    return productBrands.map(pb => ({
      name: pb._id,
      slug: pb.slug || pb._id.toLowerCase().replace(/\s+/g, '-'),
      count: pb.count,
      status: "ACTIVE"
    }));
  } catch (error) {
    console.error("DB_FETCH_AVAILABLE_BRANDS_ERROR", error);
    return [];
  }
}

export async function getShowcaseBrandsDB() {
  try {
    const db = await getDb();
    const brands = await db.collection("brands")
      .find({ status: "ACTIVE", showcase: true })
      .sort({ order: 1 })
      .limit(7)
      .toArray();
    
    if (brands.length === 0) {
      // Fallback: If no brands are specifically selected for showcase, 
      // just show the first 7 active brands.
      const fallback = await db.collection("brands")
        .find({ status: "ACTIVE" })
        .sort({ order: 1 })
        .limit(7)
        .toArray();
      return fallback.map(b => ({ ...b, _id: b._id.toString() }));
    }
    
    return brands.map(b => ({
      ...b,
      _id: b._id.toString()
    }));
  } catch (error) {
    console.error("DB_FETCH_SHOWCASE_BRANDS_ERROR", error);
    return [];
  }
}

export async function getCategoriesDB() {
  try {
    const db = await getDb();
    const categories = await db.collection("products").aggregate([
      { $match: { status: "ACTIVE", stock: { $gt: 0 } } },
      { $group: { 
          _id: { 
            $let: {
              vars: { upperCat: { $toUpper: { $trim: { input: "$category" } } } },
              in: {
                $cond: [
                  { $or: [
                    { $eq: ["$$upperCat", "SUNGLASS"] },
                    { $eq: ["$$upperCat", "SUNGLASSES"] }
                  ]},
                  "SUNGLASSES",
                  "$$upperCat"
                ]
              }
            }
          }, 
          count: { $sum: 1 },
          allImages: { $push: "$image" }
      } },
      { $project: {
          _id: 0,
          name: "$_id",
          slug: { $replaceAll: { input: { $toLower: "$_id" }, find: " ", replacement: "-" } },
          count: 1,
          images: { $slice: ["$allImages", 5] }
      } },
      { $sort: { name: 1 } }
    ]).toArray();
    return categories;
  } catch (error) {
    console.error("DB_FETCH_CATEGORIES_ERROR", error);
    return [];
  }
}

export async function getHeroSlidesDB() {
  try {
    const db = await getDb();
    const slides = await db.collection("hero_slides")
      .find({ status: "ACTIVE" })
      .sort({ order: 1 })
      .toArray();
    
    return slides.map(s => ({
      ...s,
      _id: s._id.toString()
    }));
  } catch (error) {
    console.error("DB_FETCH_HERO_SLIDES_ERROR", error);
    return [];
  }
}

// ─── SYNCHRONOUS HELPERS (FOR ARRAYS) ────────────────────────────────────────

export function getBrands(productsArray = []) {
  const brands = new Map();
  for (const product of productsArray) {
    if (!product.brand) continue;
    const slug = product.brandSlug || product.brand.toLowerCase().replace(/\s+/g, '-');
    if (!brands.has(slug)) {
      brands.set(slug, {
        slug: slug,
        name: product.brand,
        count: 0,
      });
    }
    brands.get(slug).count += 1;
  }
  return Array.from(brands.values());
}

export function getCategories(productsArray = []) {
  const categories = new Map();
  for (const product of productsArray) {
    if (!product.category) continue;
    
    // Normalize to uppercase and merge similar terms
    let normalized = product.category.trim().toUpperCase();
    if (normalized === 'SUNGLASS' || normalized === 'SUNGLASSES') {
      normalized = 'SUNGLASSES';
    }
    
    const slug = normalized.toLowerCase().replace(/\s+/g, '-');
    
    if (!categories.has(normalized)) {
      categories.set(normalized, {
        slug: slug,
        name: normalized,
        count: 0,
      });
    }
    categories.get(normalized).count += 1;
  }
  return Array.from(categories.values()).sort((a, b) => a.name.localeCompare(b.name));
}

