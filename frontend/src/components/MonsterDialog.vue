<template>
    <v-dialog>
        <v-card>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
    props: ['monster'],
    computed: {
        ...mapGetters(['monsters', 'monsterOptions'])
    }
}
</script>
