export default {
  characters: state => state.characters,
  monsters: state => state.monsters,
  monsterOptions: state => state.monsterOptions,
  classOptions: state => state.classOptions,
  magicClassOptions: state => state.magicClassOptions,
  spells: state => state.spells,
  currentSpellInfo: state => state.currentSpellInfo,
  currentSpellClass: state => state.currentSpellClass,
  currentSpellKeys: state => Object.keys(state.currentSpellInfo),
}
