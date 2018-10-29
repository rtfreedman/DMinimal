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
              @blur="$emit('changeName', localName)"
            ></v-text-field>
            <v-layout
              class="border-white"
              pt-3 px-3 mb-3
              column
            >
              <h3>
                Alignment:
                <span v-if="character.lawful !== null && character.good !== null">
                  {{ lawfulScale[character.lawful + 1] }}
                  {{ goodScale[character.good + 1] }}
                </span>
              </h3>
              <v-layout>
                <v-radio-group
                  style="max-width: 150px"
                  v-model="character.lawful"
                >
                  <v-radio
                    v-for="(n, i) in [-1, 0, 1]"
                    :key="n"
                    :label="lawfulScale[i]"
                    :value="n"
                  ></v-radio>
                </v-radio-group>
                <v-radio-group
                  style="max-width: 150px"
                  v-model="character.good"
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
}
</script>

<style>
</style>
