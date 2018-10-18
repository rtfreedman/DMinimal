<template>
  <v-app>
    <v-navigation-drawer persistent
                         :mini-variant="miniVariant"
                         :clipped="clipped"
                         v-model="drawer"
                         enable-resize-watcher
                         fixed
                         app>
      <v-list>
        <v-list-tile value="true"
                     v-for="(item, i) in items"
                     :key="i">
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app
               :clipped-left="clipped">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-btn icon
             @click.stop="miniVariant = !miniVariant">
        <v-icon v-html="miniVariant ? 'mdi-chevron-right' : 'mdi-chevron-left'"></v-icon>
      </v-btn>
      <v-btn icon
             @click.stop="clipped = !clipped">
        <v-icon>mdi-web</v-icon>
      </v-btn>
      <v-btn icon
             @click.stop="fixed = !fixed">
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon
             @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <router-view />
    </v-content>
    <v-navigation-drawer temporary
                         :right="right"
                         v-model="rightDrawer"
                         fixed
                         app>
      <v-list>
        <v-list-tile @click="right = !right">
          <v-list-tile-action>
            <v-icon>mdi-arrows-left-right-bold-outline</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Switch drawer (click me)</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-footer :fixed="fixed"
              app>
      <span>&copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      items: [
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js',
    }
  },
}
</script>
