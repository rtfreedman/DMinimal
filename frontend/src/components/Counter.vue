<template>
  <v-flex xs2>
      <v-btn flat @click="internalValue++" color="yellow">+</v-btn>
      <v-btn flat disabled color="red"> {{internalValue}} </v-btn>
      <v-btn flat @click="internalValue--" color="yellow">-</v-btn>
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
  }
}
</script>