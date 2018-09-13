<template>
  <v-card>
    <v-flex xs6>
    <v-card-text>
      <div>
        <v-text-field v-model="name" placeholder="Name..."></v-text-field>
        <div v-for="c in classes" :key="c">
          <v-layout row>
            <multiclass v-bind:classOpts='classOpts'> </multiclass>
            <v-btn flat color="red" @click="deleteClass(c)"> x </v-btn>
          </v-layout>
        </div>
        <v-btn @click="multiclass()">+ Multiclass</v-btn>
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
      <v-btn flat color="green" @click="$refs.spellsearch.dialog=true">Cast Spell</v-btn>
      <v-btn flat color="blue">Long Rest</v-btn>
    </v-card-actions>
    <searchDialog ref="spellsearch"></searchDialog>
  </v-card>
</template>

<script>
import Counter from '@/components/Counter'
import Multiclass from '@/components/Multiclass'
import SearchDialog from '@/components/SearchDialog'
export default {
  props: ['classOpts'],
  data () {
    return {
      characterName: '',
      dialogOpen: false,
      spellLevels: [...Array(9).keys()],
      numClasses: 1,
      classes: [0]
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
    SearchDialog,
    Multiclass
  },
  methods: {
    multiclass () {
      this.classes.push(this.classes.length)
    },
    deleteClass (item) {
      let index = this.classes.findIndex(function (element) {
        return element === item
      })
      if (index === -1) {
        return
      }
      this.classes.splice(index, 1)
    }
  }
}
</script>