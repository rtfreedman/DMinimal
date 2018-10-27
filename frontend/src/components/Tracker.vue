<template>
  <v-card>
    <app-character-actions
      :character="character"
    />
    <!-- flesh out and make collapsible -->
    <!-- character info -->
    <v-layout px-3 mb-3>
      <v-expansion-panel light>
        <v-expansion-panel-content style="color: #303030; background-color: #ffd700; opacity: 0.9;">
          <h3 slot="header">CHARACTER INFO</h3>
          <v-card flat dark class="text-xs-left ma-2">
            <v-card-text>
              <v-text-field
                v-model="localName"
                label="Name"
                @blur="$emit('changeName', localName)"
                hide-details
              ></v-text-field>
              <v-textarea label="Bio"></v-textarea>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-layout>

    <!-- dynamic state -->
    <v-layout
      justify-space-between
      align-center
      mb-3
    >
      <app-initiative :character="character"/>
      <app-hit-points :character="character"/>
    </v-layout>
    <app-death-throws
      v-if="character.hitPoints <= 0 && character.maxHitPoints > 0"
      :character="character"
    />
    <!-- End "Buttons" -->
    <!-- Ability Scores -->
    <app-ability-scores
      :scores="character.abilityScores"
      :character="character"
    />
    <!-- End Ability Scores -->
    <v-card-text
      v-for="characterClass in character.classes"
      :key="characterClass.name"
    >
      <!-- TODO Class-specific stuff -->

      <app-character-class
        :characterClass="characterClass"
        :character="character"
      />
    </v-card-text>
    <app-spell-cast
      :character="character"
      ref="spellCast"
    />
  </v-card>
</template>

<script>
import CharacterActions from './CharacterActions'
import AbilityScores from './AbilityScores'
import CharacterClass from './CharacterClass'
import SpellCast from './SpellCast'
import HitPoints from './HitPoints'
import DeathSavingThrows from './DeathSavingThrows'
import Initiative from './Initiative'

export default {
  name: 'tracker',

  props: ['character'],

  components: {
    'app-character-actions': CharacterActions,
    'app-ability-scores': AbilityScores,
    'app-character-class': CharacterClass,
    'app-death-throws': DeathSavingThrows,
    'app-spell-cast': SpellCast,
    'app-hit-points': HitPoints,
    'app-initiative': Initiative,
  },

  data() {
    return {
      localName: this.character.name,
    }
  },
}
</script>
