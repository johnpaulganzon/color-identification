<template>
  <v-app dark>
    <v-main>
      <v-container
        class="d-flex flex-column align-center justify-center text-center"
        style="min-height: 100vh;"
      >
        <h1 class="app-title">Online Color Detection</h1>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer app class="justify-center">
      <span>&copy; {{ new Date().getFullYear() }} Online Color Detection</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout'
}
</script>

<style scoped>
.app-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #e0e0e0;
  text-shadow: 0 0 8px rgba(0, 0, 0, 0.4);
}
</style>
