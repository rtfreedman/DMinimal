<template>
  <v-app dark>
    <v-navigation-drawer persistent
                         mini-variant
                         :clipped="clipped"
                         v-model="drawer"
                         disable-resize-watcher
                         app>
      <v-list>
        <v-list-tile value="true"
                     v-for="(item, i) in items"
                     :key="i">
          <a :href="item.loc">
            <v-list-tile-action>
              <v-tooltip right>
                <v-btn slot="activator"
                       flat
                       icon>
                  <v-icon v-html="item.icon"></v-icon>
                </v-btn>
                <span>{{item.title}}</span>
              </v-tooltip>
            </v-list-tile-action>
          </a>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app
               :clipped-left="clipped">
      <v-toolbar-side-icon @click="drawer=!drawer"></v-toolbar-side-icon>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
// adding a test comment
export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'bubble_chart',
          title: 'DMinimal',
          loc: '/',
        },
      ],
      miniVariant: false,
      title: 'DMinimal',
    }
  },
  methods: {
    newpage() {
      this.drawer = !this.drawer
    },
  },
  name: 'App',
}
</script>
