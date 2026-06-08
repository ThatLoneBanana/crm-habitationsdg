export async function geocoderAdresse(adresse: string, ville: string): Promise<{lat: number, lng: number} | null> {
  const query = encodeURIComponent(`${adresse}, ${ville}, Québec, Canada`);
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'HabitationsDG-CRM/1.0 (noreply@habitations-dg.com)'
      }
    });
    const data = await res.json();
    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
  } catch (e) {
    console.error('Géocodage échoué:', e);
  }
  return null;
}
