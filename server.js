const express = require('express');
const path = require('path');

const app = express();

// Serve frontend
app.use(express.static(path.join(__dirname, 'public')));

// Load JSON
const data = require('./phones.json');

// API route
app.get('/api/phones', (req, res) => {
  try {
    const phonesArray = data.phones || [];

    const phones = phonesArray.map((p, index) => {

      return {
        id: p.phone_id || index,

        // ✅ brand from brand_id (fallback to model)
        brand: getBrandName(p.brand_id) || extractBrand(p.model_name),

        model: p.model_name || "Unknown",

        // ✅ price fix
        price: p.price_inr ? `₹${p.price_inr}` : "N/A",

        specs: {
          display: formatDisplay(p.display),
          processor: p.platform?.chipset || "N/A",
          ram: (p.memory?.ram_options || []).join(", ") || "N/A",
          storage: (p.memory?.storage_options || []).join(", ") || "N/A",
          battery: formatBattery(p.battery),
          charging: p.battery?.wired_charging || "N/A",

          rearCamera: formatRearCamera(p.camera_main),
          frontCamera: formatFrontCamera(p.camera_front),

          os: p.platform?.os || "N/A",
          network: p.network?.technology || "N/A",

          dimensions: p.body?.dimensions || "N/A",
          weight: p.body?.weight || "N/A",

          colors: (p.colors || []).join(", ") || "N/A",

          fingerprint: extractFingerprint(p.features),
          waterResistance: p.body?.ip_rating || "N/A"
        },

        reviews: [] // you don’t have reviews yet
      };
    });

    res.json(phones);

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: 'Server error processing data' });
  }
});


// ───────── HELPERS ─────────

// Get brand name using brand_id
function getBrandName(id) {
  const brand = data.brands.find(b => b.brand_id === id);
  return brand ? brand.brand_name : "Unknown";
}

// Display
function formatDisplay(d) {
  if (!d) return "N/A";

  return [
    d.size,
    d.type,
    d.resolution,
    d.refresh_rate
  ].filter(Boolean).join(" | ");
}

// Battery
function formatBattery(b) {
  if (!b) return "N/A";
  return `${b.capacity || ""} ${b.type || ""}`.trim();
}

// Rear camera
function formatRearCamera(cam) {
  if (!cam?.sensors) return "N/A";
  return cam.sensors.map(c => `${c.megapixels}MP`).join(" + ");
}

// Front camera
function formatFrontCamera(cam) {
  if (!cam) return "N/A";
  return cam.megapixels ? `${cam.megapixels}MP` : "N/A";
}

// Fingerprint
function extractFingerprint(features) {
  if (!features?.sensors) return "N/A";

  const fp = features.sensors.find(s =>
    s.toLowerCase().includes("fingerprint")
  );

  return fp || "N/A";
}

// Extract brand fallback
function extractBrand(model) {
  if (!model) return "Unknown";
  return model.split(" ")[0];
}


// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});