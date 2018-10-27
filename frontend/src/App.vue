<template>
  <v-app dark>
    <v-toolbar app>
      <v-toolbar-title>DMinimal</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App',
}
</script>
