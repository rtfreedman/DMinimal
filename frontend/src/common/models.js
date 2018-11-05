import { hitDice } from '../common/constants'

export class Character {
  constructor(id, name) {
    this.id = id
    this.deathThrows = 0
    this.lifeThrows = 0
    this.initiative = null
    this.hitPoints = 1
    this.maxHitPoints = 1
    this.name = name || 'Leroy Jenkins'
    this.rollHealth = true
    this.concentratingOn = ''
    this.good = null // -1 evil, 0 neutral, 1 good
    this.lawful = null // -1 chaotic, 0 neutral, 1 lawful
    this.race = null
    this.classes = [new Class(true, 'Bard')]
    this.abilityScores = {
      STR: 10,
      INT: 10,
      WIS: 10,
      DEX: 10,
      CON: 10,
      CHR: 10,
    }
    this.customAbilityOffsets = {
      STR: 0,
      INT: 0,
      WIS: 0,
      DEX: 0,
      CON: 0,
      CHR: 0,
    }
  }

  concentrateOn(spellName) {
    this.concentratingOn = spellName
  }

  updateInfo(updates) {
    Object.keys(updates).forEach(k => {
      this[k] = updates[k]
    })
  }

  setStat(stat, value) {
    this.abilityScores[stat] = value
  }

  setStatOffset(stat, value) {
    this.customAbilityOffsets[stat] = value
  }

  setSlot(classIndex, slot, value) {
    this.classes[classIndex].workingSlots[slot] = value
  }

  setSlots(index, className, slots) {
    const cl = this.classes[index]
    cl.className = className
    cl.slots = slots
    cl.workingSlots = Object.assign({}, slots)
  }

  setHealth(value) {
    if (parseInt(value) !== 0) {
      this.lifeThrows = 0
      this.deathThrows = 0
    }
    if (parseInt(value) > parseInt(this.maxHitPoints)) {
      value = this.maxHitPoints
    }
    this.hitPoints = value
  }

  setMaxHealth(value) {
    this.maxHitPoints = value
  }

  setDeathThrows(val) {
    this.deathThrows = val
  }

  setLifeThrows(val) {
    this.lifeThrows = val
  }

  die() {
    this.deathThrows = 3
  }

  longRest() {
    this.hitPoints = this.maxHitPoints
    this.classes.forEach(c => {
      c.workingSlots = Object.assign({}, c.slots)
    })
  }

  shortRest(recoveredHitPoints) {
    this.hitPoints += recoveredHitPoints
  }

  addClass(className, level) {
    const newClass = new Class(false, className, level)
    this.classes.push(newClass)
  }

  removeClass(index) {
    this.classes.splice(index, 1)
  }

  levelUp(newLevel, classIndex) {
    const affectedClass = this.classes[classIndex]
    let levelOffset = newLevel - affectedClass.level

    // update max hit points
    if (affectedClass.isPrimary && affectedClass.level === 0) {
      this.maxHitPoints = Math.floor(
        this.maxHitPoints +
          hitDice[affectedClass.className] +
          (this.abilityScores.CON - 10) / 2,
      )
      levelOffset -= 1
    }

    const constitutionModifier = (this.abilityScores.CON - 10) / 2

    if (this.rollHealth) {
      // update max hit points for roll case
      const roll = Math.random(hitDice[affectedClass.className] - 1) + 1

      this.maxHitPoints = Math.floor(
        levelOffset * (this.maxHitPoints + roll + constitutionModifier),
      )
    } else {
      // update max hit points for average case
      this.maxHitPoints =
        levelOffset *
        (this.maxHitPoints +
          Math.ceil(hitDice[affectedClass.className] / 2) +
          constitutionModifier)
    }
  }

  getModifier(stat) {
    const total = this.abilityScores[stat] + this.customAbilityOffsets[stat]
    return Math.floor((total - 10) / 2)
  }

  setInitiative(initiative) {
    this.initiative = initiative
  }
}

export class Class {
  constructor(isPrimary, className, subClassName, level) {
    this.className = className
    this.subClassName = subClassName || ''
    this.level = level || 1
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
    this.availableHitDice = []
  }
}
