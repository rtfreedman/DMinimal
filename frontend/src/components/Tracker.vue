<template>
  <v-card>
    <v-flex xs6>
    <v-card-text>
      <div>
        <v-text-field v-model="name" placeholder="Name..."></v-text-field>
        <div v-for="c in classes" :key="c">
          <v-layout row>
            <v-card-title>
              <v-autocomplete
                placeholder='Class'
                :items="classOpts"
                :search-input.sync="c.class"
                flat
              />
              <v-flex xs3>
              <v-autocomplete 
                placeholder='Level'
                :items="levels"
                :search-input.sync="c.level"
                flat
              />
              </v-flex>
            </v-card-title>
            <v-btn v-if="classes.length > 1" icon flat color="grey" @click="deleteClass(c.id)"> <v-icon>cancel</v-icon> </v-btn>
          </v-layout>
        </div>
        <v-tooltip right>
          <v-btn icon slot="activator" @click="multiclass()">
            <v-icon>add_circle_outline</v-icon>
          </v-btn>
          <span>Multiclass</span>
        </v-tooltip>
      </div>
    </v-card-text>
    </v-flex>
    <v-card-text>
      <v-layout row grid-list-xs>
        <div v-for="level in spellLevels" :key="level">
          <counter v-bind:level=level+1 v-bind:value=9-level ref="'counter' + level"></counter>
        </div>
      </v-layout>
    </v-card-text>
    <v-card-actions>
      <v-btn flat color="green lighten-1" @click="$refs.spellsearch.dialog=true">Cast Spell</v-btn>
      <v-btn flat color="blue lighten-2">Long Rest</v-btn>
    </v-card-actions>
    <searchDialog ref="spellsearch"></searchDialog>
  </v-card>
</template>

<script>
import Counter from '@/components/Counter'
import SearchDialog from '@/components/SearchDialog'
export default {
  props: ['classOpts'],
  data () {
    return {
      spellSlots: [],
      levels: [...Array(21).keys()],
      characterName: '',
      dialogOpen: false,
      spellLevels: [...Array(9).keys()],
      numClasses: 1,
      classes: [{
        class: 'Wizard',
        level: 1,
        id: 0
      }]
    }
  },
  computed: {
    name: {
      get () {
        return this.characterName
      },
      set (val) {
        this.characterName = val
      }
    }
  },
  components: {
    Counter,
    SearchDialog
  },
  methods: {
    getSpellSlots: function () {
      // let r = new Request('http://localhost:8010/magic/slots/', {method: 'POST', body: '{"foo":"bar"}'})
      // fetch(r)
      // .then(response => {
      //   if (response.status === 200) {
      //     return response.json()
      //   } else {
      //     throw new Error('Something went wrong on api server!')
      //   }
      // })
      // .then(response => {
      //   this.classOpts = response.Classes
      // })
      // .catch(error => {
      //   console.error(error)
      // })
    },
    multiclass () {
      if (this.classes.length < 10) {
        this.classes.push({
          class: 'Wizard',
          level: 1,
          id: Math.random() * (10 ** 10)
        })
      }
      this.getSpellSlots()
    },
    deleteClass (item) {
      let index = this.classes.findIndex(function (element) {
        return element.id === item
      })
      if (index === -1) {
        return
      }
      this.classes.splice(index, 1)
    }
  }
}
</script>