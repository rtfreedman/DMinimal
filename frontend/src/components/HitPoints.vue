<template>
  <div>
    <v-btn @click="hitpointDialog=true" round flat><v-layout justify-space-around align-center><v-icon>mdi-heart</v-icon><span>{{hitpoints}} / {{maxHitpoints}}</span></v-layout></v-btn>
    <!-- Hit Point Counter md-heart -->
    <!-- Hit Point Roll md-refresh -->
    <!-- Receive Attack Dialog md-sword -->
    <v-dialog v-model="hitpointDialog" max-width="500">
      <v-card>
        <v-card-text>
          <h2>Health</h2>
          <v-layout row>
            <v-tooltip top>
              <v-btn icon flat slot="activator"><v-icon>mdi-dice-multiple</v-icon></v-btn>
              <span>Roll Health</span>
            </v-tooltip>
            <v-tooltip top>
              <v-btn icon flat slot="activator"><v-icon>mdi-sword</v-icon></v-btn>
              <span>Take Damage</span>
            </v-tooltip>
            <v-tooltip top>
              <v-btn icon flat slot="activator"><v-icon>mdi-medical-bag</v-icon></v-btn>
              <span>Heal</span>
            </v-tooltip>
          </v-layout>
        </v-card-text>
        <v-card-text>
          <v-layout align-center justify-space-between row fill-height>
            <h3>Current Health :</h3>
            <v-flex xs2>
              <v-text-field
                single-line
                reverse
                label="HP"
                v-model="hitpoints"
              />
            </v-flex>
          </v-layout>
          <v-layout align-center justify-space-between row>
            <h3>Maximum Health :</h3>
            <v-flex xs2>
              <v-text-field
                single-line
                reverse
                label="Max HP"
                v-model="maxHitpoints"
              />
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: ['charIndex'],
  computed: {
    maxHitpoints: {
      set (val) {
      },
      get () {
        return this.$store.state.characters[this.charIndex].maxHitpoints
      }
    },
    hitpoints: {
      set (val) { // commit mutation
      },
      get () {
        return this.$store.state.characters[this.charIndex].hitpoints
      }
    }
  },
  data () {
    return {
      hitpointDialog: false
    }
  }
}
</script>

