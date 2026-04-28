const XLSX = require('xlsx');
const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const uri = process.env.DATABASE_URL;
if (!uri) {
  console.error("DATABASE_URL not found in .env");
  process.exit(1);
}

function slugify(str) {
  if (!str) return '';
  return str.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function seed() {
  console.log("Connecting to MongoDB...");
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection("products");

    console.log("Reading Excel file...");
    const workbook = XLSX.readFile(path.join(__dirname, 'EXCEL CATALOGUE.xlsx'));
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    // Filter out the header row
    const rows = rawData.slice(1); 
    
    console.log(`Analyzing ${rows.length} rows...`);

    const processedProducts = [];
    let currentProduct = null;

    for (const row of rows) {
      // Check if this row starts a new product
      // A new product has a SNO (__EMPTY) or at least a BRAND and MODEL NO
      if (row['__EMPTY'] || (row['__EMPTY_1'] && row['__EMPTY_3'])) {
        if (currentProduct) {
          processedProducts.push(currentProduct);
        }

        const brand = row['__EMPTY_1'] || 'Unknown Brand';
        const category = row['__EMPTY_2'] || 'SUNGLASSES';
        const modelNo = row['__EMPTY_3'] || 'UNTITLED';
        const color = row['__EMPTY_4'] || '';
        const size = row['__EMPTY_5'] || '';
        const description = row['__EMPTY_6'] || '';
        const polarizedRaw = (row['__EMPTY_7'] || '').toString().toUpperCase();
        const priceRaw = row['__EMPTY_9'] || 0;
        
        const price = typeof priceRaw === 'string' ? parseFloat(priceRaw.replace(/[^0-9.]/g, '')) : parseFloat(priceRaw);
        
        const sku = `${modelNo}-${color}`.replace(/-+$/, '');

        const specs = [
          { label: 'Brand', value: brand },
          { label: 'Category', value: category },
          { label: 'Gender', value: 'Unisex' }, // Default for this catalog
          { label: 'Color Code', value: color },
          { label: 'Size', value: size },
          { label: 'Polarized', value: polarizedRaw === 'YES' ? 'Yes' : 'No' }
        ].filter(s => s.value);

        currentProduct = {
          name: `${brand} ${modelNo} ${color}`.trim(),
          sku: sku,
          price: price || 0,
          brand: brand,
          brandSlug: slugify(brand),
          category: category,
          categorySlug: slugify(category),
          stock: 50,
          status: "ACTIVE",
          image: row['__EMPTY_8'] || '',
          images: row['__EMPTY_8'] ? [row['__EMPTY_8']] : [],
          description: description || `Premium ${brand} ${category} from the latest collection.`,
          featured: false,
          tags: [brand, category, color].filter(Boolean),
          specs: specs,
          sections: {
            frame: [{ label: 'Style', value: modelNo }, { label: 'Fitting', value: size }],
            manufacturing: [{ label: 'Origin', value: 'Imported' }]
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          metadata: {
            color: color,
            size: size,
            polarized: polarizedRaw
          }
        };

        if (polarizedRaw === 'YES' || polarizedRaw === 'Y') {
          currentProduct.tags.push('Polarized');
        }

        currentProduct.slug = slugify(`${brand}-${category}-${sku}`);
      } else if (currentProduct && row['__EMPTY_8']) {
        // This is an additional image row for the current product
        currentProduct.images.push(row['__EMPTY_8']);
        // If main image was missing, set it
        if (!currentProduct.image) currentProduct.image = row['__EMPTY_8'];
      }
    }

    // Push the last product
    if (currentProduct) {
      processedProducts.push(currentProduct);
    }

    // Final uniqueness check by SKU (in case Excel has repeating headers or same model in different sections)
    const uniqueProductsMap = new Map();
    for (const p of processedProducts) {
      if (!uniqueProductsMap.has(p.sku)) {
        uniqueProductsMap.set(p.sku, p);
      } else {
        // Merge images if SKU is duplicated but has new images
        const existing = uniqueProductsMap.get(p.sku);
        const newImages = p.images.filter(img => !existing.images.includes(img));
        existing.images = [...existing.images, ...newImages];
      }
    }
    const finalProducts = Array.from(uniqueProductsMap.values());

    if (finalProducts.length > 0) {
      // Mark first 12 as featured for the homepage
      finalProducts.forEach((p, i) => {
        if (i < 12) p.featured = true;
      });

      console.log(`Inserting/Updating ${finalProducts.length} unique products...`);
      
      // Clear existing products to ensure clean sync as requested
      await collection.deleteMany({});
      
      await collection.insertMany(finalProducts);
      
      console.log("Seeding successful. MongoDB is now clean and unique.");
    } else {
      console.log("No valid products found to seed.");
    }

  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await client.close();
  }
}

seed();
