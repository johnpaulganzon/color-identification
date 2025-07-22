<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar color="white" app flat>
      <v-container class="d-flex align-center justify-space-between">
        <!-- Left Spacer (same width as logout) -->
        <div style="width: 80px;"></div>

        <!-- Centered Title Wrapper -->
        <div class="title-wrapper">
          <h1 class="app-title">Online Color Detection</h1>
        </div>

        <!-- Logout Button -->
        <v-btn
          v-if="$auth.loggedIn && $route.path === '/home'"
          color="primary"
          small
          @click="logout"
        >
          Logout
        </v-btn>
      </v-container>
    </v-app-bar>

    <!-- Main Content -->
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
      this.$auth.logout()
    }
  }
}
</script>

<style scoped>
.title-wrapper {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  white-space: nowrap;            /* Prevents line break */
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 70%;                 /* Adjusts to screen size */
}

.app-title {
  color: #1976D2;                 /* Vuetify primary blue */
  font-size: clamp(16px, 5vw, 20px); /* Responsive font size */
  font-weight: 700;
  margin: 0;
}
</style>
