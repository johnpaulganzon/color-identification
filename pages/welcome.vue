<template>
  <v-container class="fill-height d-flex justify-center align-center text-center">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="welcome-card" elevation="12">
          <h1 class="welcome-title">Welcome to Online Color Detection</h1>
          <p class="welcome-subtitle">Instantly detect and recognize colors through your camera.</p>
          <v-btn class="continue-btn" color="teal" large rounded @click="login">
            Continue
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  methods: {
    login() {
      this.$auth.loginWith('auth0')
    }
  }
}
</script>

<style scoped>
.welcome-card {
  padding: 48px;
  background: linear-gradient(135deg, #1e1e1e, #2b2b2b);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.welcome-title {
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 16px;
}

.welcome-subtitle {
  font-size: 16px;
  color: #bbbbbb;
  margin-bottom: 32px;
}

.continue-btn {
  font-weight: 600;
  padding: 12px 28px;
  font-size: 16px;
}
</style>
