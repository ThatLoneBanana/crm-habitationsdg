const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateFavicons() {
  const svgPath = path.join(__dirname, 'habitationsdg-icon.svg');
  const publicDir = path.join(__dirname, 'public');

  // Lire le SVG
  const svgBuffer = fs.readFileSync(svgPath);

  // Générer les PNG aux différentes résolutions
  const sizes = [
    { name: 'favicon-512x512.png', size: 512 },
    { name: 'favicon-192x192.png', size: 192 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'favicon.png', size: 32 },
  ];

  for (const { name, size } of sizes) {
    try {
      await sharp(svgBuffer)
        .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .png()
        .toFile(path.join(publicDir, name));
      console.log(`✅ ${name} générée (${size}x${size})`);
    } catch (err) {
      console.error(`❌ Erreur pour ${name}:`, err.message);
    }
  }

  // Générer favicon.ico à partir du PNG 32x32
  try {
    // Sharp ne supporte pas directement ICO, on va utiliser le PNG 32x32
    console.log('✅ favicon.png (32x32) peut servir de favicon.ico');
    console.log('ℹ️  Copier favicon.png vers favicon.ico');
    const favicon32 = fs.readFileSync(path.join(publicDir, 'favicon.png'));
    fs.writeFileSync(path.join(publicDir, 'favicon.ico'), favicon32);
  } catch (err) {
    console.error('❌ Erreur favicon.ico:', err.message);
  }
}

generateFavicons().catch(console.error);
