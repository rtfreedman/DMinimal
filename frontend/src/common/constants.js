// needs to remain in descending value order
export const hitDice = {
  Barbarian: 12,
  Fighter: 10,
  Paladin: 10,
  Ranger: 10,
  Bard: 8,
  Cleric: 8,
  Druid: 8,
  Monk: 8,
  Rogue: 8,
  Warlock: 8,
  Sorcerer: 6,
  Wizard: 6,
}
export const chrClasses = ['Bard', 'Sorcerer', 'Paladin', 'Warlock']
export const wisClasses = ['Cleric', 'Druid', 'Ranger']
export const statNames = ['STR', 'CON', 'DEX', 'WIS', 'INT', 'CHR']

export const classes = [
  'Barbarian',
  'Bard',
  'Cleric',
  'Druid',
  'Fighter',
  'Monk',
  'Paladin',
  'Ranger',
  'Rogue',
  'Sorcerer',
  'Warlock',
  'Wizard',
]

export const races = [
  {
    name: 'Dragonborn',
    speed: 30,
    abilityScoreBonus: {
      STR: 2,
      CHA: 1,
    },
    ancestryOptions: [
      {
        color: 'Black',
        damageType: 'Acid',
        area: '5 x 30 ft (line)',
        save: 'DEX',
      },
      {
        color: 'Blue',
        damageType: 'Lightning',
        area: '5 x 30 ft (line)',
        save: 'DEX',
      },
      {
        color: 'Brass',
        damageType: 'Fire',
        area: '5 x 30 ft (line)',
        save: 'DEX',
      },
      {
        color: 'Bronze',
        damageType: 'Lightning',
        area: '5 x 30 ft (line)',
        save: 'DEX',
      },
      {
        color: 'Copper',
        damageType: 'Acid',
        area: '5 x 30 ft (line)',
        save: 'DEX',
      },
      {
        color: 'Gold',
        damageType: 'Fire',
        area: '15 ft (cone)',
        save: 'DEX',
      },
      {
        color: 'Green',
        damageType: 'Poison',
        area: '15 ft (cone)',
        save: 'CON',
      },
      {
        color: 'Red',
        damageType: 'Fire',
        area: '15 ft (cone)',
        save: 'DEX',
      },
      {
        color: 'Silver',
        damageType: 'Cold',
        area: '15 ft (cone)',
        save: 'CON',
      },
      {
        color: 'White',
        damageType: 'Cold',
        area: '15 ft (cone)',
        save: 'CON',
      },
    ],
    languages: ['Common', 'Draconic']
  },
  { name: 'Dwarf', speed: 25 },
  { name: 'Elf', speed: 30 },
  { name: 'Gnome', speed: 25 },
  { name: 'Halfling', speed: 25 },
  { name: 'Half-Elf', speed: 30 },
  { name: 'Half-Orc', speed: 30 },
  { name: 'Human', speed: 30 },
  { name: 'Tiefling', speed: 30 },
]

export const subClassMap = {
  Barbarian: [
    'Path of the Ancestral Guardian',
    'Path of the Battlerager',
    'Path of the Berserker',
    'Path of the Storm Herald',
    'Path of the Totem Warrior',
    'Path of the Zealot',
  ],
  Bard: [
    'College of Glamour',
    'College of Lore',
    'College of Satire ',
    'College of Swords',
    'College of Valor',
    'College of Whispers',
  ],
  Cleric: [
    'Arcana Domain',
    'City Domain',
    'Death Domain',
    'Forge Domain',
    'Grave Domain',
    'Knowledge Domain',
    'Life Domain',
    'Light Domain',
    'Nature Domain',
    'Protection Domain',
    'Tempest Domain',
    'Trickery Domain',
    'War Domain',
  ],
  Druid: [
    'Circle of Dreams',
    'Circle of the Land',
    'Circle of the Moon',
    'Circle of the Shepherd',
    'Circle of Spores',
    'Circle of Twilight',
  ],
  Fighter: [
    'Arcane Archer',
    'Banneret/Purple Dragon Knight',
    'Battle Master',
    'Brute',
    'Cavalier',
    'Champion',
    'Eldritch Knight',
    'Knight',
    'Samurai',
    'Sharpshooter',
  ],
  Monk: [
    'Way of the Drunken Master',
    'Way of the Four Elements',
    'Way of the Kensei',
    'Way of the Long Death',
    'Way of the Open Hand',
    'Way of Shadow',
    'Way of the Sun Soul',
    'Way of Tranquility',
  ],
  Paladin: [
    'Oath of the Ancients',
    'Oath of Conquest',
    'Oath of the Crown',
    'Oath of Devotion',
    'Oath of Redemption',
    'Oath of Treachery',
    'Oath of Vengeance',
    'Oathbreaker',
  ],
  Ranger: [
    'Beast Master',
    'Gloom Stalker',
    'Horizon Walker',
    'Hunter',
    'Monster Slayer',
    'Primeval Guardian',
  ],
  Rogue: [
    'Arcane Trickster',
    'Assassin',
    'Inquisitive',
    'Mastermind',
    'Scout',
    'Swashbuckler',
    'Thief',
  ],
  Sorceror: [
    'Divine Soul',
    'Draconic Bloodline',
    'Phoenix Sorcery',
    'Sea Sorcery',
    'Shadow Magic',
    'Stone Sorcery',
    'Storm Sorcery',
    'Wild Magic',
  ],
  Warlock: [
    'The Archfey',
    'The Celestial',
    'The Fiend',
    'Ghost in the Machine',
    'The Great Old One',
    'The Hexblade',
    'The Raven Queen',
    'The Seeker',
    'The Undying',
  ],
  Wizard: [
    'Artificer',
    'Bladesinging',
    'Lore Mastery',
    'School of Abjuration',
    'School of Conjuration',
    'School of Divination',
    'School of Enchantment',
    'School of Evocation',
    'School of Illusion',
    'School of Invention',
    'School of Necromancy',
    'School of Transmutation',
    'Technomancy',
    'Theurgy',
    'War Magic',
  ],
}
