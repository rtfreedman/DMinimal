<template>
  <div>
    <v-btn flat color="blue lighten-2">Cast Spell</v-btn>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dialog: false,
      input: ''

    }
  },
  props: ['charIndex', 'classIndex']
}
</script>

