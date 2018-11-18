import { hitDice } from '@/common/constants'

export class Character {
  constructor(id, name) {
    this.id = id
    this.totalLevel = 1
    this.deathThrows = 0
    this.lifeThrows = 0
    this.initiative = null
    this.hitPoints = 3 // starting hurt for testing
    this.maxHitPoints = 8
    this.name = name || 'Leeroy Jenkins'
    this.rollHealth = true
    this.concentratingOn = ''
    this.good = null // -1 evil, 0 neutral, 1 good
    this.lawful = null // -1 chaotic, 0 neutral, 1 lawful
    this.race = null
    this.speed = null
    this.armorClass = null
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

  // returns hit dice ordered by class and value
  getHitDice() {
    const ret = []
    Object.keys(hitDice).forEach(c => {
      const existingClass = this.classes.find(ec => ec.className === c)
      if (existingClass) {
        ret.push(...existingClass.hitDice)
      }
    })
    return ret
  }

  // toggle a hit die's spent property
  toggleHitDie(className, state) {
    const hitDice = this.classes.find(c => c.className === className).hitDice
    const targetHitDie = hitDice.find(d => d.spent !== state)
    if (!targetHitDie) {
      // is this ever valid?
      return
    }
    targetHitDie.spent = state
  }

  // spend hit dice to recover hp
  shortRest(recoveredHitPoints, hitDiceToSpend) {
    this.hitPoints += recoveredHitPoints
    if (this.hitPoints > this.maxHitPoints) {
      this.hitPoints = this.maxHitPoints
    }
    hitDiceToSpend.map(d => d.className).forEach(c => {
      this.toggleHitDie(c, true)
    })
  }

  // restore hp
  // reset working slots
  // recover spent hit dice not to exceed one half of total
  longRest() {
    this.hitPoints = this.maxHitPoints
    this.classes.forEach(c => {
      c.workingSlots = Object.assign({}, c.slots)
    })
    let numHitDiceRecovered = Math.floor(this.totalLevel / 2) || 1
    const hitDice = this.classes.reduce((acc, c) => acc.concat(c.hitDice), [])
    const spentHitDice = hitDice
      .filter(d => d.spent)
      .sort((d1, d2) => d2.value - d1.value)

    if (spentHitDice.length < numHitDiceRecovered) {
      numHitDiceRecovered = spentHitDice.length
    }
    for (let i = 0; i < numHitDiceRecovered; i++) {
      spentHitDice[i].spent = false
    }
  }

  setSpeed(speed) {
    this.speed = speed
  }

  setArmorClass(armorClass) {
    this.armorClass = armorClass
  }

  castSpell(classIndex, slot, spellInfo) {
    this.classes[classIndex].workingSlots[slot]--
    if (spellInfo.Concentration) {
      this.concentratingOn = spellInfo.Name
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

  addClass(className, subClassName, level) {
    const newClass = new Class(false, className, subClassName, level)
    this.classes.push(newClass)
    this.totalLevel += 1
  }

  updateClass(existingClassName, className, subClassName, level) {
    const targetClass = this.classes.find(
      c => c.className === existingClassName,
    )
    const previousLevel = targetClass.level
    targetClass.className = className
    targetClass.subClassName = subClassName
    targetClass.level = level
    this.totalLevel += level - previousLevel
  }

  removeClass(index) {
    const cls = this.classes.splice(index, 1)
    this.totalLevel -= cls.level
  }

  levelUp(classIndex) {
    const cls = this.classes[classIndex]
    cls.levelUp()
    this.maxHitPoints += hitDice[cls.className]
    this.hitPoints = this.maxHitPoints
    this.totalLevel += 1

    // is this actually an affect of leveling up?
    this.getHitDice().forEach(d => {
      d.spent = false
    })

    // let levelOffset = newLevel - affectedClass.level

    // // update max hit points
    // if (affectedClass.isPrimary && affectedClass.level === 0) {
    //   this.maxHitPoints = Math.floor(
    //     this.maxHitPoints +
    //       hitDice[affectedClass.className] +
    //       (this.abilityScores.CON - 10) / 2,
    //   )
    //   levelOffset -= 1
    // }

    // const constitutionModifier = (this.abilityScores.CON - 10) / 2

    // if (this.rollHealth) {
    //   // update max hit points for roll case
    //   const roll = Math.random(hitDice[affectedClass.className] - 1) + 1

    //   this.maxHitPoints = Math.floor(
    //     levelOffset * (this.maxHitPoints + roll + constitutionModifier),
    //   )
    // } else {
    //   // update max hit points for average case
    //   this.maxHitPoints =
    //     levelOffset *
    //     (this.maxHitPoints +
    //       Math.ceil(hitDice[affectedClass.className] / 2) +
    //       constitutionModifier)
    // }
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
    this.hitDice = [
      {
        level: 1,
        value: hitDice[this.className],
        spent: false,
        className: this.className,
      },
    ]
  }

  levelUp() {
    this.level += 1
    this.hitDice.push({
      level: this.level,
      value: hitDice[this.className],
      spent: false,
      className: this.className,
    })
  }
}

export class Monster {
  constructor(stuff) {
    this.stuff = stuff
  }
}
