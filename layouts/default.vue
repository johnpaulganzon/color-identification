<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar color="white" app flat>
      <v-container class="d-flex align-center justify-space-between">
        <!-- Empty spacer for alignment -->
        <div style="width: 80px;"></div>

        <!-- Centered Title -->
        <h1 class="app-title">Online Color Detection</h1>

        <!-- Logout Button -->
        <v-btn color="primary" small @click="logout">
          Logout
        </v-btn>
      </v-container>
    </v-app-bar>

    <!-- Main content -->
    <v-main>
      <v-container class="pt-10">
        <Nuxt />
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer app class="justify-center">
      <span>&copy; {{ new Date().getFullYear() }} Online Color Detection</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  methods: {
    logout() {
      // Replace with actual logout logic
      alert('Logged out!')
    }
  }
}
</script>

<style scoped>
.app-title {
  color: #1976D2; /* Vuetify primary blue */
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  text-align: center;
}
</style>
