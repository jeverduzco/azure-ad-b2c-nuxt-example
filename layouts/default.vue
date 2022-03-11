<template>
  <v-app dark>
    <v-app-bar fixed app>
      <v-toolbar-title v-text="title" />
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      title: 'Msal Browser Demo',
    }
  },
  beforeMount() {
    this.getUser()
  },
  methods: {
    async getUser() {
      const accounts = await this.$msal.getAccounts()
      if (accounts.length) {
        const user = {
          isUserSignedIn: true,
          name: accounts[0].name,
          id: accounts[0].localAccountId,
          homeId: accounts[0].homeAccountId,
          country: accounts[0].idTokenClaims.country,
        }
        this.$store.commit('user/setUser', user)
      }
    },
  },
}
</script>
