<template>
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
              @blur="update"
            >
            </v-text-field>
            <v-layout
              class="border-white"
              pt-3
              px-3
              mb-3
              column
            >
              <h3>
                Alignment:
                <span
                  v-if="character.lawful === 0 && character.good === 0"
                >True Neutral</span>
                <span
                  v-else-if="character.lawful !== null && character.good !== null"
                >
                  {{ lawfulScale[character.lawful + 1] }}
                  {{ goodScale[character.good + 1] }}
                </span>
              </h3>
              <v-layout>
                <v-radio-group
                  style="max-width: 150px"
                  v-model="lawfulOrChaotic"
                >
                  <v-radio
                    v-for="(n, i) in [-1, 0, 1]"
                    :key="n"
                    :label="lawfulScale[i]"
                    :value="n"
                    @change="update"
                  ></v-radio>
                </v-radio-group>
                <v-radio-group
                  style="max-width: 150px"
                  v-model="goodOrEvil"
                  @change="update"
                >
                  <v-radio
                    v-for="(n, i) in [-1, 0, 1]"
                    :key="n"
                    :label="goodScale[i]"
                    :value="n"
                  ></v-radio>
                </v-radio-group>
              </v-layout>
            </v-layout>
            <v-textarea label="Bio"></v-textarea>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-layout>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: ['character'],

  data() {
    return {
      localName: this.character.name,
      lawfulOrChaotic: this.character.lawful,
      goodOrEvil: this.character.good,
      lawfulScale: ['Chaotic', 'Neutral', 'Lawful'],
      goodScale: ['Evil', 'Neutral', 'Good'],
    }
  },

  methods: {
    ...mapActions(['updateCharacterInfo']),

    update() {
      this.updateCharacterInfo({
        character: this.character,
        name: this.localName,
        lawful: this.lawfulOrChaotic,
        good: this.goodOrEvil,
      })
    }
  }
}
</script>

<style>
</style>
