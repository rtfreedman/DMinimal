<template>
    <v-layout row>
        <v-btn>Roll Initiative!</v-btn>
        <!-- Initiative v-model'd input -->
        <v-text-field/>
        <!-- Conditional clear button -->
        <v-btn>Clear</v-btn>
    </v-layout>
</template>

<script>
export default {
    props: ['charIndex'],
    computed: {

    }
}
</script>

