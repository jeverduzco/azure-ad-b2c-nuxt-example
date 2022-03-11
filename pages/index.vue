<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <v-card>
        <v-card-title class="underline">
          {{ user.isUserSignedIn ? 'Hola ' + user.name : 'Inicia sesión' }}
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <p class="caption">
            {{ token }}
          </p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn v-if="user.isUserSignedIn" :loading="signOutLoading" color="primary" text @click="signOutLoading = true, $msal.signOut(user.localAccountId)"> Cerrar Sesión </v-btn>
          <v-spacer />
          <v-btn v-if="user.isUserSignedIn" :loading="tokenLoading" color="primary" text @click="getToken()"> Token de Acceso </v-btn>
          <v-btn v-else color="primary" :loading="loginLoading" text @click="loginLoading = true, $msal.signIn()"> Iniciar Sesión </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'IndexPage',
  data() {
    return {
      loginLoading: false,
      signOutLoading: false,
      tokenLoading: false,
      token: '',
    }
  },
  computed: {
    // Get user from store
    ...mapGetters({
      user: 'user/user',
    }),
  },
  methods: {
    signIn() {
      this.$msal.signIn()
    },
    signOut(accountId) {
      this.$msal.signOut(accountId)
    },
    async getToken() {
      this.tokenLoading = true
      const token = await this.$msal.getToken()
      this.tokenLoading = false
      this.token = token
    },
  },
}
</script>
