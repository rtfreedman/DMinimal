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
          style="color: #303030; background-color: #ffd700;"
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
        v-for="(characterClass, classIndex) in character.classes"
        :key="characterClass.name"
        :characterClass="characterClass"
        :classIndex="classIndex"
        :character="character"
        @castSpell="castSpell(characterClass)"
        class="mx-3 mb-3"
      />
    </v-layout>
    <v-dialog
      v-if="spellClass"
      v-model="showSpellDialog"
    >
      <app-cast-spell-dialog
        :character="character"
        :spellClass="spellClass"
        @close="showSpellDialog = false"
      />
    </v-dialog>
  </v-card>
</template>

<script>
import CharacterActions from './CharacterActions'
import AbilityScores from './AbilityScores'
import CharacterClass from './CharacterClass'
import HitPoints from './HitPoints'
import DeathSavingThrows from './DeathSavingThrows'
import Initiative from './Initiative'
import CastSpellDialog from './CastSpellDialog'

export default {
  name: 'tracker',

  props: ['character'],

  components: {
    'app-character-actions': CharacterActions,
    'app-ability-scores': AbilityScores,
    'app-character-class': CharacterClass,
    'app-death-throws': DeathSavingThrows,
    'app-hit-points': HitPoints,
    'app-initiative': Initiative,
    'app-cast-spell-dialog': CastSpellDialog,
  },

  data() {
    return {
      localName: this.character.name,
      spellClass: null,
      showSpellDialog: false,
    }
  },

  methods: {
    castSpell(characterClass) {
      this.spellClass = characterClass
      this.showSpellDialog = true
    },
  },
}
</script>
