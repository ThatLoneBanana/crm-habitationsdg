const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function geocoder() {
  const projets = await prisma.projet.findMany({
    where: { OR: [{ latitude: null }, { longitude: null }] },
    select: { id: true, adresse: true, ville: true }
  });

  console.log(`${projets.length} projets à géocoder:`);
  projets.forEach(p => console.log(`  - ${p.adresse}, ${p.ville}`));

  for (const projet of projets) {
    const query = encodeURIComponent(`${projet.adresse}, ${projet.ville}, Quebec, Canada`);
    const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;

    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'HabitationsDG-CRM/1.0' } });
      const data = await res.json();

      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        await prisma.projet.update({
          where: { id: projet.id },
          data: { latitude: lat, longitude: lng }
        });
        console.log(`✅ ${projet.adresse} → ${lat}, ${lng}`);
      } else {
        console.log(`❌ Non trouvé: ${projet.adresse}, ${projet.ville}`);
      }
    } catch (err) {
      console.error(`⚠️  Erreur pour ${projet.adresse}:`, err.message);
    }

    await new Promise(r => setTimeout(r, 1200));
  }

  await prisma.$disconnect();
  console.log('✅ Terminé!');
}

geocoder().catch(console.error);
