<template>
  <v-card>
    <app-character-actions
      :character="character"
      @characterRemoved="$emit('characterRemoved')"
    />
    <app-character-info
      class="mb-2"
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
          :disabled="character.classes.length >= 10"
          @click="showClassDialog = true"
        >
          <v-icon>add_circle_outline</v-icon>
        </v-btn>
        <span>ADD CLASS</span>
      </v-tooltip>
    </v-layout>
    <v-layout column>
      <app-character-class
        v-for="(characterClass, classIndex) in character.classes"
        :key="characterClass.className"
        :characterClass="characterClass"
        :classIndex="classIndex"
        :character="character"
        @castSpell="castSpell(characterClass)"
        @edit="editClass(characterClass)"
        class="mx-3 mb-3"
      />
    </v-layout>
    <v-dialog v-model="showClassDialog">
      <app-class-dialog
        :character="character"
        :characterClass="classUnderEdit"
        @close="showClassDialog = false"
        @ok="dispatchAddClass($event); showClassDialog = false"
      />
    </v-dialog>
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
import { mapActions } from 'vuex'
import CharacterActions from './CharacterActions'
import CharacterInfo from './CharacterInfo'
import AbilityScores from './AbilityScores'
import CharacterClass from './CharacterClass'
import HitPoints from './HitPoints'
import DeathSavingThrows from './DeathSavingThrows'
import Initiative from './Initiative'
import CastSpellDialog from './CastSpellDialog'
import ClassDialog from './ClassDialog'

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
    'app-class-dialog': ClassDialog,
  },

  data() {
    return {
      spellClass: null,
      showSpellDialog: false,
      showClassDialog: false,
      classUnderEdit: null,
    }
  },

  methods: {
    ...mapActions(['dispatchAddClass']),

    editClass(targetClass) {
      this.showClassDialog = true
      this.classUnderEdit = targetClass
    },

    castSpell(characterClass) {
      this.spellClass = characterClass
      this.showSpellDialog = true
    },
  },

  watch: {
    showClassDialog(state) {
      if (!state) {
        this.classUnderEdit = null
      }
    },
  },
}
</script>
