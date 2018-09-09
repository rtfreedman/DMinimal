<template>
  <v-card-title>
    <v-autocomplete 
      placeholder='Level...'
      :items="levels"
    />
    <v-autocomplete
      placeholder='Class...'
      :items="classes"
    />
  </v-card-title>
</template>

<script>
export default {
  data () {
    return {
      level: 1,
      class: 'Sorcerer',
      classes: ['Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk', 'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'],
      levels: [...Array(21).keys()]
    }
  }
}
</script>
