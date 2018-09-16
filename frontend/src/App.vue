<template>
  <v-app dark>
    <v-navigation-drawer
      persistent
      mini-variant
      :clipped="clipped"
      v-model="drawer"
      disable-resize-watcher
      app
    >
      <v-list>
        <v-list-tile
          value="true"
          v-for="(item, i) in items"
          :key="i"
        >
          <v-list-tile-action>
            <v-tooltip right>
              <v-btn slot="activator" flat icon>
                <v-icon v-html="item.icon"></v-icon>
              </v-btn>
              <span>{{item.title}}</span>
            </v-tooltip>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      app
      :clipped-left="clipped"
    >
      <v-toolbar-side-icon @click="drawer=!drawer"></v-toolbar-side-icon>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
    <v-footer :fixed="fixed" app>
      <span>&copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [{
        icon: 'bubble_chart',
        title: 'Spelltracker'
      }],
      miniVariant: false,
      title: 'TitlePending'
    }
  },
  methods: {
    newpage () {
      this.drawer = !this.drawer
      this.title = 'asdf'
    }
  },
  name: 'App'
}
</script>
