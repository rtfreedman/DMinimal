<template>
  <v-layout column class="border-primary">
    <v-expansion-panel light :value="0">
      <v-expansion-panel-content
        style="color: #303030; background-color: #ffd700;"
      >
        <template slot="header">
          <h3>LEVEL {{ characterClass.level}} {{ characterClass.name.toUpperCase() }}</h3>
        </template>
        <!-- class options -->
        <v-card
          flat
          dark
          class="text-xs-left"
          style="margin: 1px"
        >
          <v-card-text class="pt-0">
            <v-layout justify-end>
              <v-menu>
                <v-btn
                  class="mr-0"
                  icon
                  color="primary"
                  flat
                  slot="activator"
                >
                  <v-icon>menu</v-icon>
                </v-btn>
                <v-list>
                  <v-list-tile @click="levelUp">
                    <v-list-tile-title>Level Up</v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile @click="editClass">
                    <v-list-tile-title>Edit</v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile @click="removeClass">
                    <v-list-tile-title>Remove</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </v-layout>
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
    ...mapGetters(['magicClassOptions']),
  },

  created() {
    this.dispatchRetrieveSlots({
      index: this.classIndex,
      name: this.characterClass.name,
      level: this.characterClass.level,
      character: this.character,
    })
  },

  methods: {
    ...mapActions(['dispatchRetrieveSlots']),

    handleSelect() {
      if (this.characterClass.name && this.characterClass.level) {
        this.dispatchRetrieveSlots({
          index: this.classIndex,
          name: this.characterClass.name,
          level: this.characterClass.level,
          character: this.character,
        })
      }

      // do all that other shit
    },

    levelUp() {},

    editClass() {},

    removeClass() {},

    castSpell() {
      // TBD
    },
  },
}
</script>
