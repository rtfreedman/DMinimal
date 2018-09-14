<template>
  <v-layout row justify-center>
    <v-dialog
      v-model="dialog"
      max-width="300"
    >
      <v-card>
        <v-card-title class="headline">Find spell</v-card-title>

        <v-card-text>
          <v-autocomplete 
            placeholder='Spell...'
            :items="spells"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="red lighten-1"
            flat="flat"
            @click="dialog = false"
          >
            Close
          </v-btn>

          <v-btn
            color="green lighten-1"
            flat="flat"
            @click="dialog = false"
          >
            Cast
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  export default {
    data () {
      return {
        dialog: false,
        spells: ['1', '2', '3']
      }
    }
  }
</script>