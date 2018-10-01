<template>
  <v-container>
    <v-btn flat @click="addCharacter()"> +Character </v-btn>
    <div v-for="(char, id) in $store.state.characters" v-bind:key=id>
    {{'character'}}
    {{char}}
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'HelloWorld',
  computed: {
    characters () {
      return this.$store.state.characters
    }
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    addCharacter () {
      console.log(this.characters)
      this.$store.commit('addCharacter')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #ffff00;
}
</style>
