<template>
  <v-overlay>
    <v-progress-circular indeterminate size="64"></v-progress-circular>
  </v-overlay>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'HolaPage',
    computed: {
    // Get user from store
    ...mapGetters({
      user: 'user/user',
    }),
  },
  mounted() {
    if (this.user.isUserSignedIn) {
      this.router.push('/')
    }
  },
}
</script>
