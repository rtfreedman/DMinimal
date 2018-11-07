export default {
  characters: state => state.characters,
  monsters: state => state.monsters,
  monsterOptions: state => state.monsterOptions,
  classOptions: state => state.classOptions,
  magicClassOptions: state => state.magicClassOptions,
  spells: state => state.spells,
  spellOptions: state =>
    [...state.spells].sort(
      (s1, s2) => parseInt(s1.level, 10) - parseInt(s2.level, 10),
    ),
  currentSpellInfo: state => state.currentSpellInfo,
  currentSpellClass: state => state.currentSpellClass,
  currentSpellKeys: state => Object.keys(state.currentSpellInfo),
  snackbar: state => state.snackbar,
}
