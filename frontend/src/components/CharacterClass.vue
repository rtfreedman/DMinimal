<template>
  <v-layout column class="border-primary">
    <v-expansion-panel light :value="0">
      <v-expansion-panel-content style="color: #303030; background-color: #ffd700;">
        <template slot="header">
          <h3>
            <span>LEVEL {{ characterClass.level}} {{ characterClass.className.toUpperCase() }}</span>
            <span
              v-if="characterClass.subClassName"
            >- {{ characterClass.subClassName.toUpperCase() }}</span>
          </h3>
        </template>
        <!-- class options -->
        <v-card flat dark class="text-xs-left" style="margin: 1px">
          <v-card-text class="pt-0">
            <v-layout justify-end>
              <v-menu left offset-y>
                <v-btn class="mr-0" icon color="primary" flat slot="activator">
                  <v-icon>menu</v-icon>
                </v-btn>
                <v-list>
                  <v-list-tile @click="levelUp">
                    <v-list-tile-action>
                      <v-icon>add</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>LEVEL UP</v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile @click="$emit('edit')">
                    <v-list-tile-action>
                      <v-icon>edit</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>EDIT</v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile
                    @click="dispatchRemoveClass({ character, classIndex })"
                    :disabled="character.classes.length === 1"
                  >
                    <v-list-tile-action>
                      <v-icon :color="character.classes.length === 1 ? '#999' : '#eee'">delete</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>REMOVE</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </v-layout>
            <v-layout column>
              <v-divider color="#ffd700"></v-divider>
              <h3 class="text-xs-center my-1">CLASS ACTIONS</h3>
              <v-divider color="#ffd700"></v-divider>
              <v-layout justify-center>
                <v-tooltip v-if="magicClassOptions.includes(characterClass.className)" bottom>
                  <v-btn color="primary" flat slot="activator" icon @click="$emit('castSpell')">
                    <v-icon>mdi-auto-fix</v-icon>
                  </v-btn>
                  <span>CAST SPELL</span>
                </v-tooltip>
              </v-layout>
            </v-layout>
            <app-spell-slots
              v-if="magicClassOptions.includes(characterClass.className) && characterClass.level"
              :character="character"
              :characterClass="characterClass"
              :classIndex="classIndex"
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

export default {
  components: {
    'app-spell-slots': SpellSlots,
  },

  // TODO: spell save DC, spell attack modifier, spell slot counters, spell search dialog (all inside a conditional magic component)
  props: ['characterClass', 'classIndex', 'character'],

  computed: {
    ...mapGetters(['magicClassOptions']),
  },

  created() {
    this.dispatchRetrieveSlots({
      character: this.character,
      classIndex: this.classIndex,
      className: this.characterClass.className,
      level: this.characterClass.level,
    })
  },

  methods: {
    ...mapActions([
      'dispatchRetrieveSlots',
      'dispatchRemoveClass',
      'characterAction',
    ]),

    levelUp() {
      this.characterAction({
        character: this.character,
        method: 'levelUp',
        args: [this.classIndex],
      })
    },

    castSpell() {
      // TBD
    },
  },
}
</script>
