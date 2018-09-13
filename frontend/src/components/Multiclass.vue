<template>
  <v-card-title>
    <v-autocomplete 
      placeholder='Level...'
      :items="levels"
    />
    <v-autocomplete
      placeholder='Class...'
      :items="classOpts"
    />
  </v-card-title>
</template>

<script>
export default {
  props: ['classOpts'],
  data () {
    return {
      level: 1,
      class: 'Sorcerer',
      levels: [...Array(21).keys()]
    }
  }
}
</script>
