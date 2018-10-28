<template>
  <v-app dark>
    <v-toolbar app class="py-2">
      <img src="./assets/logo.png" alt="">
      <h1 class="mx-2 mt-3 brand">DMinimal</h1>
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

<style scoped>
.brand {
  color: #ccc;
  font-family: fantasy;
  font-size: 35px;
}
</style>


<style>
.border-primary {
  border: 1px solid #ffd700;
}
</style>
