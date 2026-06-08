'use client';

import { useEffect, useState } from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';

Font.register({
  family: 'Helvetica',
  src: 'https://fonts.gstatic.com/s/helvetica/v1/Helvetica.ttf',
});

interface CedulePDFProps {
  projet: any;
  logoBase64?: string;
}

export function CedulePDF({ projet, logoBase64: initialLogo }: CedulePDFProps) {
  const [logoBase64, setLogoBase64] = useState<string | undefined>(initialLogo);
  const [dateImpression, setDateImpression] = useState<string>('');

  useEffect(() => {
    // Charger le logo PNG si disponible
    if (!logoBase64) {
      fetch('/habitationsdg.png')
        .then(res => res.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onloadend = () => {
            setLogoBase64(reader.result as string);
          };
          reader.readAsDataURL(blob);
        })
        .catch(() => {
          // Si le PNG n'existe pas, continuer sans logo
          console.log('Logo PNG non trouvé');
        });
    }

    // Définir la date d'impression
    const now = new Date();
    const dateFormatee = now.toLocaleDateString('fr-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const heureFormatee = now.toLocaleTimeString('fr-CA', {
      hour: '2-digit',
      minute: '2-digit'
    });
    setDateImpression(`Imprimé le ${dateFormatee} à ${heureFormatee}`);
  }, [logoBase64]);

  const typeLabel = projet.typeProjet === 'JUMELE' ? 'JUMELÉ' : 'MAISON';
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Convertir les étapes avec dates en Date objects
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

  // Calculer la largeur par jour (4-12px)
  // Largeur disponible: 792 (LETTER landscape) - 20*2 (marges) - 180 (étapes) - 35 (durée) - 80 (assigné) = 397px
  const availableWidth = 397;
  let pixelPerDay = availableWidth / totalDays;
  if (pixelPerDay > 12) pixelPerDay = 12;
  if (pixelPerDay < 4) pixelPerDay = 4;

  const ganttWidth = totalDays * pixelPerDay;

  // Calculer position d'une étape
  const getTaskPosition = (dateDebut: Date) => {
    let dayIndex = 0;
    for (let i = 0; i < dateColumns.length; i++) {
      if (dateColumns[i].toDateString() === dateDebut.toDateString()) {
        dayIndex = i;
        break;
      }
    }
    return dayIndex * pixelPerDay;
  };

  const getTaskWidth = (dateDebut: Date, dateFin: Date) => {
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);
    let daysCount = 0;
    let current = new Date(debut);
    while (current <= fin) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        daysCount++;
      }
      current.setDate(current.getDate() + 1);
    }
    return daysCount * pixelPerDay;
  };

  const getBarColor = (statut: string) => {
    switch (statut) {
      case 'COMPLETE':
        return '#639922';
      case 'EN_COURS':
        return '#1D9E75';
      case 'NON_COMMENCE':
        return '#B4B2A9';
      case 'DECALE':
        return '#EF9F27';
      default:
        return '#999';
    }
  };

  const styles = StyleSheet.create({
    page: {
      padding: 15,
      fontFamily: 'Helvetica',
      fontSize: 6,
    },
    header: {
      flexDirection: 'row',
      marginBottom: 10,
      alignItems: 'flex-start',
      gap: 8,
    },
    headerLeft: {
      width: 60,
    },
    headerCenter: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerRight: {
      width: 120,
      fontSize: 5,
      lineHeight: 1.3,
    },
    logo: {
      width: 50,
      height: 25,
    },
    title: {
      fontSize: 8,
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
      width: 150,
      padding: 2,
      borderRightWidth: 0.5,
      borderRightColor: '#ccc',
    },
    colDuree: {
      width: 30,
      padding: 2,
      borderRightWidth: 0.5,
      borderRightColor: '#ccc',
      textAlign: 'center',
    },
    colAssigne: {
      width: 70,
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

  return (
    <Document>
      <Page
        size="LETTER"
        orientation="landscape"
        style={styles.page}
      >
        {/* Entête */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {logoBase64 && (
              <Image
                src={logoBase64}
                style={styles.logo}
              />
            )}
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
          {/* Entête avec dates */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.colTache}>Étape</Text>
            <Text style={styles.colDuree}>J</Text>
            <Text style={styles.colAssigne}>Assigné</Text>
            <View style={{ width: ganttWidth + 20, padding: 2 }}>
              <Text>Échéancier</Text>
            </View>
          </View>

          {/* Ligne des mois */}
          <View style={[styles.tableRow, { backgroundColor: '#f9f9f9', minHeight: 8 }]}>
            <View style={[styles.colTache, { borderRightWidth: 0 }]} />
            <View style={[styles.colDuree, { borderRightWidth: 0 }]} />
            <View style={[styles.colAssigne, { borderRightWidth: 0 }]} />
            <View style={{ width: ganttWidth + 20, padding: 1, flexDirection: 'row' }}>
              {(() => {
                const moisGroupes: any[] = [];
                let currentMois = '';
                let startIdx = 0;
                dateColumns.forEach((date, idx) => {
                  const mois = date.toLocaleString('fr-CA', { month: 'short' });
                  if (mois !== currentMois) {
                    if (currentMois) {
                      moisGroupes.push({ nom: currentMois, start: startIdx, count: idx - startIdx });
                    }
                    currentMois = mois;
                    startIdx = idx;
                  }
                });
                if (currentMois) {
                  moisGroupes.push({ nom: currentMois, start: startIdx, count: dateColumns.length - startIdx });
                }
                return moisGroupes.map((m, i) => (
                  <Text key={i} style={{ width: m.count * pixelPerDay, fontSize: 5, textAlign: 'center', paddingRight: 1 }}>
                    {m.nom}
                  </Text>
                ));
              })()}
            </View>
          </View>

          {/* Ligne des jours */}
          <View style={[styles.tableRow, { backgroundColor: '#fafafa', minHeight: 8 }]}>
            <View style={[styles.colTache, { borderRightWidth: 0 }]} />
            <View style={[styles.colDuree, { borderRightWidth: 0 }]} />
            <View style={[styles.colAssigne, { borderRightWidth: 0 }]} />
            <View style={{ width: ganttWidth + 20, padding: 1, flexDirection: 'row' }}>
              {dateColumns.map((date, i) => (
                <Text key={i} style={{ width: pixelPerDay, fontSize: 4, textAlign: 'center' }}>
                  {date.getDate()}
                </Text>
              ))}
            </View>
          </View>

          {/* Lignes */}
          {tachesWithDates.map((tache: any, idx: number) => (
            <View key={tache.id} style={styles.tableRow}>
              <Text style={styles.colTache}>
                {tache.ordre}. {tache.nom?.substring(0, 30)}
              </Text>
              <Text style={styles.colDuree}>{tache.dureeJours}j</Text>
              <Text style={styles.colAssigne}>{tache.assigneA?.substring(0, 12) || '-'}</Text>
              <View style={[styles.ganttContainer, { width: ganttWidth + 20 }]}>
                {/* Grille alternée */}
                {dateColumns.map((date, i) => (
                  <View
                    key={i}
                    style={{
                      position: 'absolute',
                      width: pixelPerDay,
                      height: '100%',
                      left: i * pixelPerDay,
                      backgroundColor: i % 2 === 0 ? '#f9f9f9' : '#fff',
                      borderRightWidth: 0.3,
                      borderRightColor: '#ddd',
                    }}
                  />
                ))}

                {/* Barre étape */}
                {tache.dateDebut && tache.dateFin && (
                  <View
                    style={[
                      styles.ganttBar,
                      {
                        left: getTaskPosition(tache.dateDebut),
                        width: Math.max(2, getTaskWidth(tache.dateDebut, tache.dateFin)),
                        backgroundColor: getBarColor(tache.statut),
                      },
                    ]}
                  />
                )}

                {/* Ligne aujourd'hui */}
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
          ))}
        </View>

        {/* Pied de page */}
        <View style={styles.footer}>
          <Text>Habitations DG — RBQ: 5856-1036-01 — habitations-dg.com</Text>
          <Text>{dateImpression || 'Imprimé...'}</Text>
        </View>
      </Page>
    </Document>
  );
}
