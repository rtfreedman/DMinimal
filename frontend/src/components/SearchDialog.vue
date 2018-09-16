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
            :search-input.sync="input"
            :items="spellOpts"
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
        classes: [],
        input: '',
        spellOpts: []
      }
    },
    watch: {
      input () {
        let strBody = JSON.stringify({
          classes: this.classes,
          spellName: this.input
        })
        let r = new Request('http://localhost:8010/magic/search/', {method: 'Post', body: strBody})
        fetch(r)
        .then(response => {
          if (response.status === 200) {
            return response.json()
          } else {
            throw new Error('Something went wrong on api server!')
          }
        })
        .then(response => {
          this.spellOpts = response.spellOpts
          return response.spellOpts
        })
        .catch(error => {
          console.error(error)
        })
      }
    }
  }
</script>
