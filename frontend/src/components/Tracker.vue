<template>
  <v-card>
    <app-character-actions
      :character="character"
    />
    <!-- flesh out and make collapsible -->
    <!-- character info -->
    <v-layout px-3>
      <v-expansion-panel light>
        <v-expansion-panel-content
          style="color: #303030; background-color: #ffd700; opacity: 0.8;"
        >
          <h3 slot="header">CHARACTER INFO</h3>
          <v-card
            flat
            dark
            class="text-xs-left ma-2"
          >
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
    <v-layout mb-3>
        <app-initiative :character="character"/>
        <app-hit-points :character="character"/>
    </v-layout>
    <app-death-throws
      v-if="character.hitPoints <= 0 && character.maxHitPoints > 0"
      :character="character"
    />
    <app-ability-scores
      :scores="character.abilityScores"
      :character="character"
    />
    <v-layout align-center>
      <h3 class="ml-3">CLASS</h3>
      <v-tooltip bottom>
        <v-btn
          icon
          flat
          slot="activator"
          color="primary"
          @click="character.multiclass()"
        >
          <v-icon>add_circle_outline</v-icon>
        </v-btn>
        <span>MULTICLASS</span>
      </v-tooltip>
    </v-layout>
    <v-layout column>
      <app-character-class
        v-for="characterClass in character.classes"
        :key="characterClass.name"
        :characterClass="characterClass"
        :character="character"
      />
    </v-layout>
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
