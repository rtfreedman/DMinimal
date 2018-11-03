<template>
  <v-layout column class="border-primary">
    <v-expansion-panel light :value="0">
      <v-expansion-panel-content
        style="color: #303030; background-color: #ffd700;"
      >
        <template slot="header">
          <h3>Level {{ characterClass.level}} {{ characterClass.name }}</h3>
        </template>
        <!-- class options -->
        <v-card
          flat
          dark
          class="text-xs-left"
          style="margin: 1px"
        >
          <v-card-text>
            <v-layout column>
              <v-divider color="#ffd700"></v-divider>
              <h3
                class="text-xs-center my-1"
              >CLASS ACTIONS</h3>
              <v-divider
                color="#ffd700"
                class="mb-1"
              ></v-divider>
              <v-layout justify-center>
                <v-tooltip
                  v-if="magicClassOptions.includes(characterClass.name)"
                  bottom
                >
                  <v-btn
                    color="primary"
                    flat
                    slot="activator"
                    icon
                    @click="$emit('castSpell')"
                  >
                    <v-icon>mdi-auto-fix</v-icon>
                  </v-btn>
                  <span>CAST SPELL</span>
                </v-tooltip>
              </v-layout>
            </v-layout>
            <app-spell-slots
              v-if="magicClassOptions.includes(characterClass.name) && characterClass.level"
              :character="character"
              :characterClass="characterClass"
            />
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SpellSlots from './SpellSlots'
import { oneToTwenty } from '../common/functions'

export default {
  // TODO: spell save DC, spell attack modifier, spell slot counters, spell search dialog (all inside a conditional magic component)
  props: ['characterClass', 'classIndex', 'character'],

  components: {
    'app-spell-slots': SpellSlots,
  },

  computed: {
    ...mapGetters(['classOptions', 'magicClassOptions']),
  },

  created() {
    this.retrieveSlots({
      index: this.classIndex,
      name: this.characterClass.name,
      level: this.characterClass.level,
      character: this.character,
    })
  },

  methods: {
    ...mapActions(['retrieveSlots']),

    handleSelect() {
      if (this.characterClass.name && this.characterClass.level) {
        this.retrieveSlots({
          index: this.classIndex,
          name: this.characterClass.name,
          level: this.characterClass.level,
          character: this.character,
        })
      }

      // do all that other shit
    },

    removeClass() {
      this.character.removeClass(this.classIndex)
    },

    castSpell() {
      // TBD
    },
  },
}
</script>
