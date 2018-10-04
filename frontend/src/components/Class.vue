<template>
  <div>
    <v-flex xs3>
      <v-autocomplete
        placeholder='Class'
        :items="classOpts"
        :search-input.sync="className"
        flat
        dense
      />
    </v-flex>
    <v-flex xs1>
      <v-autocomplete 
        placeholder='Level'
        :items="levelOpts"
        :search-input.sync="level"
        flat
        dense
      />
    </v-flex>
  </div>
</template>

<script>
export default { // TODO: spell save DC, spell attack modifier, spell slot counters, spell search dialog (all inside a conditional magic component)
  props: ['classIndex', 'characterIndex', 'classOpts'],
  computed: {
    classItem: {
      get () {
        return this.$store.state.characters[this.characterIndex].classes[this.classIndex]
      }
    },
    level: {
      get () {
        return this.classItem.level
      },
      set (state) {
        this.$store.commit('changeClassLevel', {
          charIndex: this.characterIndex,
          classIndex: this.classIndex,
          newLevel: state
        })
      }
    }
  },
  data () {
    return {
      levelOpts: Array.from(new Array(20), (x, i) => i + 1), // [1,20]
      boiler: '',
      className: ''
    }
  },
  method: {
    isMagicClass () {
      return true // TODO
    }
  },
  watch: {
    className (state) {
      if (this.classOpts.includes(state)) {
        this.$store.commit('changeClass', {
          charIndex: this.characterIndex,
          classIndex: this.classIndex,
          newClass: state
        })
      }
    }
  }
}
</script>

