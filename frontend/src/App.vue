<template>
  <v-app dark>
    <v-toolbar app class="py-2">
      <img src="./assets/logo.png" alt="">
      <h1
        style="color: #ccc; font-family: fantasy; font-size: 35px;"
        class="mx-2 mt-3"
      >DMinimal</h1>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
// Impact, fantasy;
// Arnoldboecklin, fantasy;
// Oldtown, fantasy;
// Blippo, fantasy;
// Brushstroke, fantasy;
// fantasy;

export default {
  name: 'App',
}
</script>

<style>
.border-primary {
  border: 1px solid #ffd700;
}
</style>
