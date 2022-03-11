import * as msal from '@azure/msal-browser'

export default ({ store }, inject) => {
  // Config object to be passed to Msal on creation
  const msalConfig = {
    auth: {
      clientId: '<your client id>',
      authority:
        'https://<yourtentant>.b2clogin.com/<yourtentant>.onmicrosoft.com/<youruserflow>',
      knownAuthorities: ['<yourtentant>.b2clogin.com'],
      redirectUri: 'http://localhost:3000/auth',
    },
    cache: {
      cacheLocation: 'localStorage', // This configures where your cache will be stored
      storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
  }
  // Create the MSAL application object
  const myMSAL = new msal.PublicClientApplication(msalConfig)

  // Catch redirect callbacks
  myMSAL
    .handleRedirectPromise()
    .then(handleResponse)
    // eslint-disable-next-line node/handle-callback-err
    .catch((err) => {
      // catch any errors during the authentication process
    })
  // Handle the response from AAD
  function handleResponse(resp) {
    if (resp !== null) {
      myMSAL.setActiveAccount(resp.account)
      const user = {
        isUserSignedIn: true,
        name: resp.account.name,
        id: resp.account.localAccountId,
        homeId: resp.account.homeAccountId,
        country: resp.account.idTokenClaims.country,
      }
      store.commit('user/setUser', user)
    }
  }

  // Add here scopes for id token to be used at MS Identity Platform endpoints.
  const loginRequest = {
    scopes: [
      'openid',
      'offline_access',
      'https://<yourtentant>.onmicrosoft.com/<yourapiexposed>/<yourapi.permission>',
    ],
  }
  // Sign in the user
  function signIn() {
    return myMSAL.loginRedirect(loginRequest)
  }
  // Get the account object of the signed-in user
  function getAccounts() {
    return myMSAL.getAllAccounts()
  }
  // Sign out the user
  function signOut(accountId) {
    const logoutRequest = {
      account: myMSAL.getAccountByHomeId(accountId),
    }
    return myMSAL.logoutRedirect(logoutRequest)
  }
  // Get acces token for calling API's
  function getToken() {
    const activeAccount = myMSAL.getAllAccounts()[0]
    const tokenRequest = {
      scopes: [
        'https://<yourtentant>.onmicrosoft.com/<yourapiexposed>/<yourapi.permission>',
      ],
      account: activeAccount,
    }
    return myMSAL
      .acquireTokenSilent(tokenRequest)
      .then(function (accessTokenResponse) {
        const accessToken = accessTokenResponse.accessToken
        return accessToken
      })
      .catch(function (error) {
        // eslint-disable-next-line no-undef
        if (error instanceof InteractionRequiredAuthError) {
          myMSAL
            .acquireTokenPopup(tokenRequest)
            .then(function (accessTokenResponse) {
              const accessToken = accessTokenResponse.accessToken
              return accessToken
            })
            // eslint-disable-next-line node/handle-callback-err
            .catch(function (error) {
              // catch any errors during the authentication process
            })
        }
        // catch any errors during the authentication process
      })
  }
  // inject functions on vue instance
  inject('msal', {
    signIn,
    getAccounts,
    signOut,
    getToken,
  })
}
