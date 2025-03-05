import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Insertion des classes
  const classes = [
    { name: 'Warrior', colorCode: '#C79C6E' },
    { name: 'Paladin', colorCode: '#F58CBA' },
    { name: 'Hunter', colorCode: '#ABD473' },
    { name: 'Rogue', colorCode: '#FFF569' },
    { name: 'Priest', colorCode: '#FFFFFF' },
    { name: 'Death Knight', colorCode: '#C41E3A' },
    { name: 'Shaman', colorCode: '#0070DE' },
    { name: 'Mage', colorCode: '#69CCF0' },
    { name: 'Warlock', colorCode: '#9482C9' },
    { name: 'Monk', colorCode: '#00FF96' },
    { name: 'Druid', colorCode: '#FF7D0A' },
    { name: 'Demon Hunter', colorCode: '#A330C9' },
    { name: 'Evoker', colorCode: '#33937F' }
  ]

  // Insertion des serveurs
  const servers = [
    { name: 'Archimonde', region: 'EU' },
    { name: 'Arthas', region: 'EU' },
    { name: 'Aszune', region: 'EU' },
    { name: 'Dalaran', region: 'EU' },
    { name: 'Drek\'Thar', region: 'EU' },
    { name: 'Hyjal', region: 'EU' },
    { name: 'Illidan', region: 'EU' },
    { name: 'Kael\'thas', region: 'EU' },
    { name: 'Medivh', region: 'EU' },
    { name: 'Ner\'zhul', region: 'EU' },
    { name: 'Ragnaros', region: 'EU' },
    { name: 'Sargeras', region: 'EU' },
    { name: 'Silvermoon', region: 'EU' },
    { name: 'Stormrage', region: 'EU' },
    { name: 'Thrall', region: 'EU' },
    { name: 'Varimathras', region: 'EU' },
    { name: 'Ysondre', region: 'EU' },
    { name: 'Zenedar', region: 'EU' }
  ]

  // Insertion des factions
  const factions = [
    { name: 'Alliance', colorCode: '#0078FF' },
    { name: 'Horde', colorCode: '#B30000' }
  ]

  console.log('Insertion des classes...')
  for (const classData of classes) {
    await prisma.class.create({
      data: classData,
    })
  }

  console.log('Insertion des serveurs...')
  for (const serverData of servers) {
    await prisma.server.create({
      data: serverData,
    })
  }

  console.log('Insertion des factions...')
  const createdFactions = []
  for (const factionData of factions) {
    const faction = await prisma.faction.create({
      data: factionData,
    })
    createdFactions.push(faction)
  }

  console.log('Insertion des races...')
  // Insertion des races
  const races = [
    // Alliance
    { name: 'Humain', factionId: 1 },
    { name: 'Nain', factionId: 1 },
    { name: 'Gnome', factionId: 1 },
    { name: 'Elfe de la nuit', factionId: 1 },
    { name: 'Draeneï', factionId: 1 },
    { name: 'Worgen', factionId: 1 },
    { name: 'Pandaren (Alliance)', factionId: 1 },
    { name: 'Elfe du vide', factionId: 1 },
    { name: 'Mécagnome', factionId: 1 },

    // Horde
    { name: 'Orc', factionId: 2 },
    { name: 'Mort-vivant', factionId: 2 },
    { name: 'Tauren', factionId: 2 },
    { name: 'Troll', factionId: 2 },
    { name: 'Elfe de sang', factionId: 2 },
    { name: 'Gobelin', factionId: 2 },
    { name: 'Pandaren (Horde)', factionId: 2 },
    { name: 'Troll zandalari', factionId: 2 },
    { name: 'Tauren de Haut-Roc', factionId: 2 },
    { name: 'Orc mag\'har', factionId: 2 },
    { name: 'Mort-vivant déchu', factionId: 2 }
  ]

  for (const raceData of races) {
    await prisma.race.create({
      data: raceData,
    })
  }

  console.log('Données initiales insérées avec succès')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })