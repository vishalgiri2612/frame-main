/**
 * config/magazine.js
 * 
 * Central configuration for the FRAME Magazine editorial slots.
 */

export const SLOT_FALLBACKS = {
  celebrity:  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1080&auto=format&fit=crop',
  bestseller: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=1080&auto=format&fit=crop',
  model:      'https://images.unsplash.com/photo-1536766768598-e09213fdcf22?q=80&w=1080&auto=format&fit=crop',
  detail:     'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?q=80&w=1080&auto=format&fit=crop',
  street:     'https://images.unsplash.com/photo-1519419166318-4f5978601b64?q=80&w=1080&auto=format&fit=crop',
};

export const EDITORIAL_SLOTS = [
  {
    id: "celebrity",
    label: "Celebrity Sunglasses — Stars and Their Iconic Eyewear",
    style: "Oversized bold celebrity sunglasses",
    tag: "Celebrity Sightings",
    contentType: "Celebrity eyewear feature",
    tone: "High-octane, aspirational, and trend-setting. Reference A-list icons from both Hollywood and Bollywood (e.g., Deepika Padukone, SRK, Brad Pitt, Zendaya). Emphasize their signature eyewear style.",
    setting: "glamorous paparazzi moment, red carpet, or luxury airport look — the celebrity MUST be wearing the sunglasses",
    slotOrder: 0,
    fallbackImage: SLOT_FALLBACKS.celebrity,
  },
  {
    id: "bestseller",
    label: "Best-Selling Sunglasses — The Frames Everyone Is Buying Right Now",
    style: "Aviator / classic bestselling frames",
    tag: "Trend Alert",
    contentType: "Best-seller product editorial",
    tone: "Informative yet aspirational. Explain why these specific sunglasses sell out repeatedly and what makes them a must-own.",
    setting: "sleek fashion studio with product highlight lighting",
    slotOrder: 1,
    fallbackImage: SLOT_FALLBACKS.bestseller,
  },
  {
    id: "model",
    label: "Model Off-Duty Sunglasses — High Fashion Eyewear on the World's Top Models",
    style: "Cat-eye or statement editorial frames",
    tag: "Red Carpet",
    contentType: "Fashion model editorial",
    tone: "High-fashion, dramatic, Vogue-editorial. Focus on the model's look and how the sunglasses complete the ensemble.",
    setting: "luxury fashion studio with dramatic studio lighting",
    slotOrder: 2,
    fallbackImage: SLOT_FALLBACKS.model,
  },
  {
    id: "detail",
    label: "The Craft — Inside the Making of Luxury Sunglasses",
    style: "Artisan luxury frames with visible craftsmanship details",
    tag: "Style Guide",
    contentType: "Sunglasses design and craftsmanship feature",
    tone: "Intellectual, connoisseur-level. Explain materials (acetate, titanium), hinge design, lens technology, and why details matter.",
    setting: "close-up detail shot on a luxury background",
    slotOrder: 3,
    fallbackImage: SLOT_FALLBACKS.detail,
  },
  {
    id: "street",
    label: "Street Style Sunglasses — The Looks Taking Over City Streets",
    style: "Trendy round or shield street-style frames",
    tag: "Style Guide",
    contentType: "Street style sunglasses trend piece",
    tone: "Cool, urban, trend-aware. Reference street style weeks in major cities (Milan, Tokyo, NYC) and how real people style sunglasses.",
    setting: "vibrant city street during golden hour",
    slotOrder: 4,
    fallbackImage: SLOT_FALLBACKS.street,
  },
];
