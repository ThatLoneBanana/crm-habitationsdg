import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import { calculateTaskStatus } from './task-status';

const MOIS_FR = ['jan', 'fév', 'mar', 'avr', 'mai', 'juin', 'juil', 'aoû', 'sep', 'oct', 'nov', 'déc'];

const styles = StyleSheet.create({
  page: {
    padding: 15,
    fontFamily: 'Helvetica',
    fontSize: 6,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 10,
  },
  headerLeft: {
    width: 70,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    width: 140,
    fontSize: 5.5,
    lineHeight: 1.4,
  },
  logo: {
    width: 60,
    height: 30,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  rqb: {
    fontSize: 5,
    marginTop: 2,
  },
  table: {
    flexDirection: 'column',
    borderWidth: 0.5,
    borderColor: '#000',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    minHeight: 10,
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
    fontSize: 6,
  },
  colTache: {
    width: 140,
    padding: 2,
    borderRightWidth: 0.5,
    borderRightColor: '#ccc',
  },
  colDate: {
    width: 35,
    padding: 2,
    borderRightWidth: 0.5,
    borderRightColor: '#ccc',
    textAlign: 'center',
  },
  colAssigne: {
    width: 100,
    padding: 2,
    borderRightWidth: 0.5,
    borderRightColor: '#ccc',
  },
  ganttContainer: {
    position: 'relative',
    height: '100%',
  },
  ganttBar: {
    position: 'absolute',
    height: 6,
    borderRadius: 1,
    top: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 5,
    borderTopWidth: 0.5,
    borderTopColor: '#ccc',
    fontSize: 5,
  },
});

export function generateCedulePDF(projet: any, logoBase64: string) {
  const typeLabel = projet.typeProjet === 'JUMELE' ? 'JUMELÉ' : 'MAISON';
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Convertir les tâches avec dates en Date objects
  const tachesWithDates = projet.taches.map((t: any) => ({
    ...t,
    dateDebut: new Date(t.dateDebut),
    dateFin: new Date(t.dateFin),
  }));

  // Calculer la plage de dates
  const dates = tachesWithDates.map((t: any) => t.dateDebut);
  dates.push(new Date(projet.dateLivraison));
  const minDate = new Date(Math.min(...dates.map((d: Date) => d.getTime())));
  const maxDate = new Date(Math.max(...dates.map((d: Date) => d.getTime())));

  // Générer les colonnes de dates (sans weekends)
  const dateColumns: Date[] = [];
  let current = new Date(minDate);
  while (current <= maxDate) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      dateColumns.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
  }

  const totalDays = dateColumns.length;
  const ganttWidth = 452;
  const pixelPerDay = ganttWidth / totalDays;

  // Calculer les jours ouvrables entre deux dates
  const countWorkingDays = (debut: Date, fin: Date) => {
    let count = 0;
    let current = new Date(debut);
    while (current <= fin) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }
    return count;
  };

  // Position et largeur PROPORTIONNELLES au projet
  const getTaskPosition = (dateDebut: Date) => {
    const daysFromStart = countWorkingDays(minDate, dateDebut);
    return (daysFromStart / totalDays) * ganttWidth;
  };

  const getTaskWidth = (dateDebut: Date, dateFin: Date) => {
    const dureeJours = countWorkingDays(dateDebut, dateFin);
    const width = (dureeJours / totalDays) * ganttWidth;
    return Math.max(2, width); // Minimum 2px de largeur
  };

  const getBarColor = (dateDebut: Date | null, dateFin: Date | null) => {
    const taskStatus = calculateTaskStatus(dateDebut, dateFin);
    switch (taskStatus.status) {
      case 'completed':
        return '#639922'; // vert
      case 'inProgress':
        return '#1D9E75'; // teal
      case 'preparation':
        return '#3b82f6'; // bleu
      default:
        return '#B4B2A9'; // gris
    }
  };

  return (
    <Document>
      <Page size="LETTER" orientation="landscape" style={styles.page}>
        {/* Entête */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {logoBase64 && <Image src={logoBase64} style={styles.logo} />}
            <Text style={styles.rqb}>RBQ: 5856-1036-01</Text>
          </View>

          <View style={styles.headerCenter}>
            <Text style={styles.title}>ÉCHÉANCIER DES TRAVAUX — {typeLabel}</Text>
          </View>

          <View style={styles.headerRight}>
            <Text>{projet.client.prenom} {projet.client.nom}</Text>
            <Text>{projet.adresse}</Text>
            <Text>{projet.ville}</Text>
            <Text>{projet.client.telephone}</Text>
            <Text>{projet.client.email}</Text>
            <Text>Livraison: {new Date(projet.dateLivraison).toLocaleDateString('fr-CA')}</Text>
            <Text>MAJ: {today.toLocaleDateString('fr-CA')}</Text>
          </View>
        </View>

        {/* Tableau */}
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.colTache}>Étape</Text>
            <Text style={styles.colDate}>Début</Text>
            <Text style={styles.colDate}>Fin</Text>
            <Text style={styles.colAssigne}>Assigné</Text>
            <View style={{ width: ganttWidth + 20, padding: 2 }}>
              <Text>Échéancier</Text>
            </View>
          </View>

          {tachesWithDates.map((tache: any) => {
            const debut = tache.dateDebut;
            const fin = tache.dateFin;
            const debutStr = `${debut.getDate()} ${MOIS_FR[debut.getMonth()]}`;
            const finStr = `${fin.getDate()} ${MOIS_FR[fin.getMonth()]}`;
            return (
            <View key={tache.id} style={styles.tableRow}>
              <Text style={styles.colTache}>
                {tache.ordre}. {tache.nom}
              </Text>
              <Text style={styles.colDate}>{debutStr}</Text>
              <Text style={styles.colDate}>{finStr}</Text>
              <Text style={styles.colAssigne}>{tache.assigneA || '-'}</Text>
              <View style={[styles.ganttContainer, { width: ganttWidth + 20 }]}>
                {dateColumns.map((date, i) => {
                  // Calculer le numéro de semaine pour alterner
                  const daysFromStart = Math.floor((date.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
                  const weekNumber = Math.floor(daysFromStart / 7);
                  const isEvenWeek = weekNumber % 2 === 0;
                  return (
                  <View
                    key={i}
                    style={{
                      position: 'absolute',
                      width: pixelPerDay,
                      height: '100%',
                      left: i * pixelPerDay,
                      backgroundColor: isEvenWeek ? '#fff' : '#f5f5f5',
                      borderRightWidth: 0.3,
                      borderRightColor: '#ddd',
                    }}
                  />
                  );
                })}

                {tache.dateDebut && tache.dateFin && (
                  <View
                    style={[
                      styles.ganttBar,
                      {
                        left: getTaskPosition(tache.dateDebut),
                        width: Math.max(2, getTaskWidth(tache.dateDebut, tache.dateFin)),
                        backgroundColor: getBarColor(tache.dateDebut, tache.dateFin),
                      },
                    ]}
                  />
                )}

                {today >= minDate && today <= maxDate && (
                  <View
                    style={{
                      position: 'absolute',
                      width: 0.5,
                      height: '100%',
                      left: getTaskPosition(today),
                      backgroundColor: '#ff0000',
                      zIndex: 10,
                    }}
                  />
                )}
              </View>
            </View>
            );
          })}
        </View>

        {/* Pied de page */}
        <View style={styles.footer}>
          <Text>Habitations DG — RBQ: 5856-1036-01 — habitations-dg.com</Text>
          <Text>Imprimé: {today.toLocaleDateString('fr-CA')} à {today.getHours().toString().padStart(2, '0')}h{today.getMinutes().toString().padStart(2, '0')}</Text>
        </View>
      </Page>
    </Document>
  );
}
