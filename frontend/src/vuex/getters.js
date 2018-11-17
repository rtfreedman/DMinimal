export default {
  characters: state => state.characters,
  trigger: state => {
    const len = state.characters.length
    return len !== 1 && state.characters[len - 1].id === state.characters[0].id
  },
  monsters: state => state.monsters,
  currentMonsterInfo: state => state.currentMonsterInfo,
  currentMonsterKeys: state => Object.keys(state.currentMonsterInfo),
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
