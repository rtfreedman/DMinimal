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
    {{className}}
  </div>
</template>

<script>
export default {
  props: ['classIndex', 'characterIndex', 'classOpts'],
  data () {
    return {
      levelOpts: Array.from(new Array(20), (x, i) => i + 1), // [1,20]
      boiler: '',
      className: ''
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
  },
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
  }
}
</script>

