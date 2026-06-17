import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import DashboardClient from '@/components/dashboard/DashboardClient'
import { calculerPhaseAutomatique } from '@/lib/phase-calculator'

export default async function DashboardPage() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const [projets, userPrisma] = await Promise.all([
      prisma.projet.findMany({
        where: { phase: { not: 'TERMINE' } },
        include: {
          client: { select: { prenom: true, nom: true } },
          taches: { select: { nom: true, dateDebut: true, dateFin: true, assigneA: true, ancrageInspection: true } },
          extras: { select: { statut: true, montant: true, description: true, createdAt: true } },
          paiements: { select: { recu: true, montant: true, description: true, datePrevu: true } },
          inspectionsGCR: { select: { type: true, statut: true } },
        },
        orderBy: { dateLivraison: 'asc' }
      }),
      user?.email ? prisma.user.findUnique({
        where: { email: user.email },
        select: { prenom: true }
      }) : Promise.resolve(null)
    ])

    const prenomUser = userPrisma?.prenom || user?.email?.split('@')[0] || 'Utilisateur'

    // Mettre à jour les phases automatiquement
    for (const projet of projets) {
      const nouvellePhase = calculerPhaseAutomatique(projet);
      if (nouvellePhase !== projet.phase) {
        await prisma.projet.update({
          where: { id: projet.id },
          data: { phase: nouvellePhase }
        });
        projet.phase = nouvellePhase;
      }
    }

    const data = JSON.parse(JSON.stringify(projets))

    // DIAGNOSTIC: Vérifie les tâches
    console.log('Projets chargés:', projets.length)
    projets.forEach(p => {
      console.log(`${p.adresse}: ${p.taches.length} tâches`)
      if (p.taches.length > 0) {
        console.log('Première tâche:', p.taches[0])
      }
    })

    // Après sérialisation
    console.log('Après JSON.parse/stringify - tâches projet 0:', data[0]?.taches?.length)

    const aujourd_hui = new Date()
    aujourd_hui.setHours(0, 0, 0, 0)

    const projetsActifs = data.length
    const livraisonsCeMois = data.filter((p: any) => {
      if (!p.dateLivraison) return false
      const dl = new Date(p.dateLivraison)
      return dl.getMonth() === aujourd_hui.getMonth() && dl.getFullYear() === aujourd_hui.getFullYear()
    }).length
    const montantTotal = data.reduce((s: number, p: any) => s + (parseFloat(p.montantTotal) || 0), 0)
    const extrasNonSignes = data.reduce((s: number, p: any) => s + p.extras.filter((e: any) => e.statut === 'EN_ATTENTE').length, 0)
    const montantExtrasNonSignes = data.reduce((s: number, p: any) => s + p.extras.filter((e: any) => e.statut === 'EN_ATTENTE').reduce((ss: number, e: any) => ss + e.montant, 0), 0)
    const paiementsAttendus = data.reduce((s: number, p: any) => s + p.paiements.filter((pm: any) => !pm.recu).length, 0)
    const montantPaiementsAttendus = data.reduce((s: number, p: any) => s + p.paiements.filter((pm: any) => !pm.recu).reduce((ss: number, pm: any) => ss + parseFloat(pm.montant.toString()), 0), 0)

    const alertes: any[] = []
    data.forEach((p: any) => {
      if (!p.dateLivraison) return
      const joursRestants = Math.ceil((new Date(p.dateLivraison).getTime() - aujourd_hui.getTime()) / 86400000)
      if (joursRestants <= 14 && joursRestants >= 0) {
        alertes.push({
          type: joursRestants <= 7 ? 'urgent' : 'warning',
          titre: `Livraison dans ${joursRestants}j — ${p.client.prenom} ${p.client.nom}`,
          sous: `${p.adresse}, ${p.ville}`,
          badge: joursRestants <= 7 ? 'Urgent' : `${joursRestants}j`,
          projetId: p.slug || p.id,
        })
      }
    })

    // Alertes GCR : inspection GYPSE/FINITION non réservée dont l'étape ancrée
    // tombe à <= 21 jours (3 semaines). Disparaît dès que l'inspection est RESERVE.
    const TYPE_INSP_LABEL: Record<string, string> = { GYPSE: 'gypse', FINITION: 'finition' }
    data.forEach((p: any) => {
      for (const insp of p.inspectionsGCR || []) {
        if (insp.type !== 'GYPSE' && insp.type !== 'FINITION') continue
        if (insp.statut !== 'A_RESERVER') continue
        const ancre = p.taches.find((t: any) => t.ancrageInspection === insp.type)
        if (!ancre || !ancre.dateDebut) continue
        const jours = Math.ceil((new Date(ancre.dateDebut).getTime() - aujourd_hui.getTime()) / 86400000)
        if (jours > 21) continue
        const dateAncre = new Date(ancre.dateDebut).toLocaleDateString('fr-CA', { day: 'numeric', month: 'short' })
        alertes.push({
          type: 'warning',
          titre: `Inspection GCR ${TYPE_INSP_LABEL[insp.type]} à réserver — ${p.client.prenom} ${p.client.nom}`,
          sous: `${p.adresse} · ${ancre.nom} le ${dateAncre}`,
          badge: jours >= 0 ? `${jours}j` : 'En retard',
          projetId: p.slug || p.id,
        })
      }
    })

    const agendaSemaine: any[] = []
    const joursLabels = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam']
    const moisLabels = ['jan', 'fév', 'mar', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc']
    for (let i = 0; i < 7; i++) {
      const jour = new Date(aujourd_hui)
      jour.setDate(aujourd_hui.getDate() + i)
      if (jour.getDay() === 0 || jour.getDay() === 6) continue
      const etapesDuJour: any[] = []
      data.forEach((p: any) => {
        p.taches.forEach((t: any) => {
          if (!t.dateDebut || !t.dateFin) return
          const debut = new Date(t.dateDebut)
          const fin = new Date(t.dateFin)
          if (debut <= jour && fin >= jour) {
            etapesDuJour.push({
              nom: t.nom,
              assigneA: t.assigneA || 'Interne',
              projet: `${p.adresse}`,
              client: `${p.client.prenom} ${p.client.nom}`,
              projetSlug: p.slug || p.id,
              phase: p.phase,
            })
          }
        })
      })
      if (etapesDuJour.length > 0) {
        agendaSemaine.push({
          date: jour.toISOString(),
          label: `${joursLabels[jour.getDay()]} ${jour.getDate()} ${moisLabels[jour.getMonth()]}`,
          etapes: etapesDuJour,
        })
      }
    }

    // DIAGNOSTIC: Agenda
    console.log('Agenda semaine:', agendaSemaine.length, 'jours avec étapes')
    if (agendaSemaine.length === 0) {
      console.log('ALERTE: Aucune étape trouvée cette semaine')
      console.log('Vérification des filtres de dates:')
      data.forEach((p: any) => {
        p.taches.forEach((t: any) => {
          console.log(`Tâche: ${t.nom}, débute: ${t.dateDebut}, finit: ${t.dateFin}`)
        })
      })
    }

    const projetsEnrichis = data.map((p: any) => {
      const tachesTerminees = p.taches.filter((t: any) => t.dateFin && new Date(t.dateFin) < aujourd_hui).length
      const avancement = p.taches.length > 0 ? Math.round((tachesTerminees / p.taches.length) * 100) : 0
      const prochaineEtape = p.taches.find((t: any) => t.dateDebut && new Date(t.dateDebut) >= aujourd_hui)
      const joursRestants = p.dateLivraison ? Math.ceil((new Date(p.dateLivraison).getTime() - aujourd_hui.getTime()) / 86400000) : null
      return { ...p, avancement, joursRestants, prochaineEtape: prochaineEtape || null }
    })

    return (
      <DashboardClient
        projetsActifs={projetsActifs}
        livraisonsCeMois={livraisonsCeMois}
        montantTotal={montantTotal}
        alertes={alertes}
        agendaSemaine={agendaSemaine}
        projets={projetsEnrichis}
        extrasNonSignes={extrasNonSignes}
        montantExtrasNonSignes={montantExtrasNonSignes}
        paiementsAttendus={paiementsAttendus}
        montantPaiementsAttendus={montantPaiementsAttendus}
        prenomUser={prenomUser}
      />
    )
  } catch (error) {
    console.error('Dashboard error:', error)
    return (
      <div style={{ padding: '24px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 500, marginBottom: '8px' }}>Tableau de bord</h1>
        <p style={{ color: 'red', fontSize: '12px', marginBottom: '12px' }}>Erreur: {String(error)}</p>
        <a href='/projets' style={{ color: '#1D9E75', fontSize: '13px' }}>→ Voir les projets</a>
      </div>
    )
  }
}
