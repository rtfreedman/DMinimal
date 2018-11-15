<template>
  <v-card>
    <v-toolbar
      light
      card
      style="background-color: #ffd700"
    >
      <h3>NEW Monster</h3>
      <v-spacer></v-spacer>
      <v-btn icon @click="$emit('close')">
        <v-icon>close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <h3>What are we throwing at the party this time?</h3>
      <v-autocomplete
        label="Monster"
        :items="monsterOptions"
        style="max-width: 500px"
        @input="handleSelect"
      />
      <!-- GENERAL INFO -->
      <v-layout
        v-if="currentMonsterKeys.length > 1"
        class="border-primary"
        column
        pa-3
      >
        <v-layout
          v-for="key in currentMonsterKeys"
          :key="key"
          v-if="key !== 'Monster' && (typeof currentMonsterInfo[key] === 'string' || typeof currentMonsterInfo[key] === 'number')"
          column
        >
          <v-layout class="text-xs-right">
            <v-flex xs6 py-1>{{ key }}</v-flex>
            <v-divider vertical class="mx-3"></v-divider>
            <v-flex xs6 py-1 class="text-xs-left">{{ currentMonsterInfo[key] }}</v-flex>
          </v-layout>
          <v-layout class="text-xs-left">
          </v-layout>
        </v-layout>
      </v-layout>
      <!-- END GENERAL INFO -->
      <!-- ABILITY SCORES -->
      <v-layout
        v-if="currentMonsterKeys.length > 1"
        class="border-primary"
        row
        pa-3
      >
        <v-layout
          column
          v-if="currentMonsterKeys.length > 1 && currentMonsterKeys.includes('Ability Scores')"
          v-for="(value, stat) in currentMonsterInfo['Ability Scores']"
          :key="stat"
          class="text-xs-center"
        >
          <v-layout justify-center>
            <div>
              <strong>{{ stat }}</strong>
              <h1>{{ value }}</h1>
            </div>
            <h4
              style="margin-top: 36px; margin-left: 5px;"
            >{{ getModifier(value) >= 0 ? '+' : '-' }} {{ Math.abs(getModifier(value)) }}</h4>
          </v-layout>
        </v-layout>
      </v-layout>
      <!-- END ABILITY SCORES -->
      <!-- OTHERS -->
      <v-layout
        v-if="currentMonsterKeys.length > 1"
        class="border-primary"
        column
        pa-3
      >
        <v-expansion-panel light
          v-if="currentMonsterKeys.length > 1 && key !== 'Monster' && key !== 'Ability Scores' && typeof currentMonsterInfo[key] !== 'string' && typeof currentMonsterInfo[key] !== 'number'"
          v-for="key in currentMonsterKeys"
          :key="key"
        >
          <v-expansion-panel-content
            style="color: #303030; background-color: #ffd700;"
            >
            <h3 slot="header">{{key}}</h3>
            <v-expansion-panel dark>
              <v-expansion-panel-content
                style="color: #303030; background-color: #efc700;"
                v-for="(subdict, subkey) in currentMonsterInfo[key]"
                :key="subkey"
              >
                <h3 slot="header">{{subdict["Name"]}}</h3>
                
                <v-layout
                  v-for="(value, supersubkey) in subdict"
                  :key="supersubkey"
                  v-if="supersubkey !== 'Name'"
                  column
                >
                  <v-layout class="text-xs-right">
                    <v-flex xs6 py-1>{{ supersubkey }}</v-flex>
                    <v-divider vertical class="mx-3"></v-divider>
                    <v-flex xs6 py-1 class="text-xs-left">{{ value }}</v-flex>
                  </v-layout>
                  <v-layout class="text-xs-left"/>
                </v-layout>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-layout>
      <!-- END OTHERS -->
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  computed: {
    ...mapGetters([
      'monsters',
      'currentMonsterInfo',
      'monsterOptions',
      'currentMonsterKeys',
    ]),
  },
  methods: {
    ...mapActions(['dispatchRetrieveMonsterInfo']),
    handleSelect(name) {
      this.dispatchRetrieveMonsterInfo({ name })
    },
    getModifier(val) {
      return Math.floor((val - 10) / 2)
    },
  },
}
</script>
