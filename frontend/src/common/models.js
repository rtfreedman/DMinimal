import $store from '@/store'

export class Class {
  constructor() {
    this.classname = 'Bard'
    this.level = 1
    this.slots = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
    }
    this.workingSlots = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
    }
  }
}

export class Character {
  constructor(id) {
    this.id = id
    this.deathThrows = 0
    this.lifeThrows = 0
    this.initiative = null
    this.hitpoints = 1
    this.maxHitpoints = 1
    this.name = ''
    this.proficiency = 0
    this.rollHealth = true
    this.concentrating = ''
    this.classes = [new Class()]
    this.abilityScores = {
      STR: 10,
      INT: 10,
      WIS: 10,
      DEX: 10,
      CON: 10,
      CHR: 10,
    }
  }

  setClass(clIndex, name, slots) {
    const cl = this.classes[clIndex]
    cl.classname = name
    cl.slots = slots
    cl.workingSlots = Object.assign({}, slots)
  }

  rest() {
    if (this.hitpoints === 0) {
      // you cannot gain the benefits of a long rest at 0 hitpoints
      $store.commit('showSnackbar', {
        message: `${
          this.name
        } cannot gain the benefits of a long rest at 0 HP.`,
      })
      return
    }
    this.hitpoints = this.maxHitpoints
    this.classes.forEach(c => {
      c.workingSlots = Object.assign({}, c.slots)
    })
  }
}
