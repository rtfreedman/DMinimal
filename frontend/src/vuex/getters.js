export default {
  characters: state => state.characters,
  classOptions: state => state.classOptions,
  magicClassOptions: state => state.magicClassOptions,
  spells: state => state.spells,
  currentSpellInfo: state => state.currentSpellInfo,
  currentSpellClass: state => state.currentSpellClass,
  currentSpellKeys: state => Object.keys(state.currentSpellInfo),
  snackbar: state => state.snackbar,
}
