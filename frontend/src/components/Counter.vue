<template>
  <v-flex xs2>
      <v-btn flat @click="increment()" color="yellow">+</v-btn>
      <v-btn flat disabled color="red"> {{internalValue}} </v-btn>
      <v-btn flat @click="decrement()" color="yellow">-</v-btn>
      <v-btn flat disabled color="red"> Lv {{level}} </v-btn>
  </v-flex>
</template>

<script>
export default {
  props: ['level', 'value'],
  data () {
    return {
      internalValue: this.value
    }
  },
  methods: {
    increment () {
      this.internalValue++
    },
    decrement () {
      if (this.internalValue > 0) {
        this.internalValue--
      }
    }
  }
}
</script>