<template>
  <v-card>
    <app-character-actions
      :character="character"
    />
    <!-- flesh out and make collapsible -->
    <!-- character info -->
    <v-layout>
      <v-flex>
        <v-card light class="text-xs-left ma-2">
          <h3 class="pl-3 pt-3">CHARACTER INFO</h3>
          <v-card-text class="pt-0">
            <v-text-field
              v-model="localName"
              label="Name"
              @blur="$emit('changeName', localName)"
              hide-details
            ></v-text-field>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout ml-3></v-layout>
    <!-- dynamic state -->
    <v-layout column>
      <app-initiative :character="character"/>
      <app-hit-points :character="character"/>
    </v-layout>
    <app-death-throws
      v-if="character.hitpoints <= 0 && character.maxHitpoints > 0"
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
      v-for="(characterClass, classindex) in character.classes"
      :key="classindex"
    >
      <!-- TODO Class-specific stuff -->

      <app-character-class
        :characterClass="characterClass"
        :character="character"
        :classIndex="classindex"
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
