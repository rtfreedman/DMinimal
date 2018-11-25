<template>
  <v-container>
    <h1>Character Builder</h1>
    <v-text-field label="Name"/>
    <v-tabs>
      <v-tab
        v-for="i in tabs.length"
        :key="i"
      >{{ tabs[i-1].name }}</v-tab>
      <v-tab-item v-for="i in tabs.length" :key="i">
        <component :is="tabs[i-1].component"></component>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script>
import RaceBuilder from '@/components/builder/RaceBuilder'
import ClassBuilder from '@/components/builder/ClassBuilder'
import AbilitiesBuilder from '@/components/builder/AbilitiesBuilder'
import DescriptionBuilder from '@/components/builder/DescriptionBuilder'
import EquipmentBuilder from '@/components/builder/EquipmentBuilder'

export default {
  components: {
    RaceBuilder,
    ClassBuilder,
    AbilitiesBuilder,
    DescriptionBuilder,
    EquipmentBuilder,
  },

  data() {
    return {
      tabs: [
        { name: 'race', component: RaceBuilder },
        { name: 'class', component: ClassBuilder },
        { name: 'abilities', component: AbilitiesBuilder },
        { name: 'description', component: DescriptionBuilder },
        { name: 'equipment', component: EquipmentBuilder },
      ],
    }
  },
}
</script>

<style scoped>
</style>
