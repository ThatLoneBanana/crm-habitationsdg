// Bloc d'identité d'un projet, PARTAGÉ entre la liste des projets et le tableau
// de bord pour que les deux ne divergent jamais.
//  Ligne 1 (gras) : adresse + ville — l'adresse prime visuellement.
//  Ligne 2 (atténuée) : nom du client.
export function ProjetIdentite({ adresse, ville, client }: { adresse: string; ville?: string | null; client: string }) {
  return (
    <>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {ville ? `${adresse}, ${ville}` : adresse}
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {client}
      </div>
    </>
  )
}
