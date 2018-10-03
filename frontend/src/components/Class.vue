<template>
  <div>
    <v-autocomplete
      placeholder='Class'
      :items="['Warlock']"
      :search-input.sync="classname"
      flat
    />
    <v-flex xs3>
      <v-autocomplete 
        placeholder='Level'
        :items="['1']"
        :search-input.sync="level"
        flat
      />
    </v-flex>
  </div>
</template>

<script>
export default {
  props: ['classindex', 'characterindex'],
  computed: {
    level: {
      get () {
        return this.$store.state.characters[this.characterindex].classes[this.classindex].level
      },
      set () {
      }
    },
    classname: {
      get () {
        return this.$store.state.characters[this.characterindex].classes[this.classindex].classname
      },
      set () {
      }
    }
  }
}
</script>

