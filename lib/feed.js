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

// ─── HELPERS ─────────────────────────────────────────────────────────────────

export function getBrands(productsArray = localProducts) {
  const brands = new Map();
  for (const product of productsArray) {
    if (!product.brandSlug) continue;
    if (!brands.has(product.brandSlug)) {
      brands.set(product.brandSlug, {
        slug: product.brandSlug,
        name: product.brand,
        count: 0,
      });
    }
    brands.get(product.brandSlug).count += 1;
  }
  return Array.from(brands.values());
}

export function getCategories(productsArray = localProducts) {
  const categories = new Map();
  for (const product of productsArray) {
    if (!product.categorySlug) continue;
    if (!categories.has(product.categorySlug)) {
      categories.set(product.categorySlug, {
        slug: product.categorySlug,
        name: product.category,
        count: 0,
      });
    }
    categories.get(product.categorySlug).count += 1;
  }
  return Array.from(categories.values());
}

