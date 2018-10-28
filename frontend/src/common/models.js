import $store from '@/store'
import { hitDice } from '../common/constants'

export class Class {
  constructor(isPrimary) {
    this.name = null
    this.level = null
    this.isPrimary = isPrimary || false
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
    this.hitPoints = 1
    this.maxHitPoints = 1
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
    this.customModifiers = {
      STR: 0,
      INT: 0,
      WIS: 0,
      DEX: 0,
      CON: 0,
      CHR: 0,
    }
  }

  setSlots(index, name, slots) {
    const cl = this.classes[index]
    cl.name = name
    cl.slots = slots
    cl.workingSlots = Object.assign({}, slots)
  }

  rest() {
    if (this.hitPoints === 0) {
      // you cannot gain the benefits of a long rest at 0 hitpoints
      $store.commit('showSnackbar', {
        message: `${
          this.name
        } cannot gain the benefits of a long rest at 0 HP.`,
      })
      return
    }
    this.hitPoints = this.maxHitPoints
    this.classes.forEach(c => {
      c.workingSlots = Object.assign({}, c.slots)
    })
  }

  multiclass(name) {
    // no more than 10 classes
    if (this.classes.length > 10) {
      return
    }
    // no duplicate classes
    if (this.classes.includes(name)) {
      return
    }
    this.classes.push(new Class(name))
  }

  removeClass(index) {
    this.classes.splice(index, 1)
  }

  setProficiencyBonus() {
    let totalLevel = 0
    this.classes.forEach(c => {
      if (c.level) {
        totalLevel += c.level
      }
    })
    this.proficiency = Math.floor(totalLevel / 5) + 2
  }

  levelUp(newLevel, classIndex) {
    const affectedClass = this.classes[classIndex]
    let levelOffset = newLevel - affectedClass.level

    // update max hit points
    if (affectedClass.isPrimary && affectedClass.level === 0) {
      this.maxHitPoints = Math.floor(
        this.maxHitPoints +
          hitDice[affectedClass.name] +
          (this.abilityScores.CON - 10) / 2,
      )
      levelOffset -= 1
    }

    const constitutionModifier = (this.abilityScores.CON - 10) / 2

    if (this.rollHealth) {
      // update max hit points for roll case
      const roll = Math.random(hitDice[affectedClass.name] - 1) + 1

      this.maxHitPoints = Math.floor(
        levelOffset * (this.maxHitPoints + roll + constitutionModifier),
      )
    } else {
      // update max hit points for average case
      this.maxHitPoints =
        levelOffset *
        (this.maxHitPoints +
          Math.ceil(hitDice[affectedClass.name] / 2) +
          constitutionModifier)
    }

    this.setProficiencyBonus()
  }
}
