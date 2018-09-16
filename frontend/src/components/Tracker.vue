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
        <v-tooltip right>
          <v-btn flat slot="activator" icon @click="getSpellSlots">
            <v-icon> autorenew </v-icon>
          </v-btn>
          <span>Update Slots</span>
        </v-tooltip>
      </div>
    </v-card-text>
    </v-flex>
    <v-card-text>
      <v-layout row grid-list-xs>
        <div v-for="(slot, index) in spellSlots" :key="slot">
          <counter v-bind:level=index+1 v-bind:value=slot[index] ref="'counter' + level"></counter>
        </div>
      </v-layout>
    </v-card-text>
    <v-card-actions>
      <v-btn flat color="green lighten-1" @click="$refs.spellsearch.dialog=true">Cast Spell</v-btn>
      <v-btn @click="getSpellSlots" flat color="blue lighten-2">Long Rest</v-btn>
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
      spellSlotLevels: [],
      levels: [...Array(21).keys()],
      characterName: '',
      dialogOpen: false,
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
    getSpellSlots () {
      let strBody = JSON.stringify({
        classes: this.classes
      })
      let r = new Request('http://localhost:8010/magic/slots/', {method: 'POST', body: strBody})
      fetch(r)
      .then(response => {
        if (response.status === 200) {
          return response.json()
        } else {
          throw new Error('Something went wrong on api server!')
        }
      })
      .then(response => {
        this.spellSlots = response.Slots
        this.spellSlotLevels = [...Array(this.spellSlots.length).keys()]
      })
      .catch(error => {
        console.error(error)
      })
    },
    multiclass () {
      if (this.classes.length < 10) {
        this.classes.push({
          class: 'Wizard',
          level: 1,
          id: Math.random() * (10 ** 10)
        })
      }
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