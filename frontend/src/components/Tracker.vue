<template>
  <v-card>
    <app-character-actions
      :character="character"
      @characterRemoved="$emit('characterRemoved')"
    />
    <app-character-info class="mb-2"
      :character="character"
    />
    <v-layout mb-2>
      <app-initiative :character="character"/>
      <app-hit-points :character="character"/>
    </v-layout>
    <app-death-throws
      v-if="character.hitPoints <= 0 && character.maxHitPoints > 0"
      :character="character"
    />
    <app-ability-scores :character="character"/>
    <v-layout align-center>
      <h3 class="ml-3">CLASS</h3>
      <v-tooltip bottom>
        <v-btn
          icon
          flat
          slot="activator"
          color="primary"
          @click="character.addClass()"
        >
          <v-icon>add_circle_outline</v-icon>
        </v-btn>
        <span>ADD CLASS</span>
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
import CharacterInfo from './CharacterInfo'
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
    'app-character-info': CharacterInfo,
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
