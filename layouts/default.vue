<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar color="white" app flat class="custom-app-bar">
      <v-container class="d-flex align-center justify-space-between">
        <!-- Burger Icon -->
        <v-btn
          v-if="$auth.loggedIn && $route.path === '/home'"
          icon
          @click="drawer = !drawer"
        >
          <v-icon :color="drawer ? '#bbbbbb' : 'black'">mdi-menu</v-icon>
        </v-btn>

        <!-- Centered Title Wrapper -->
        <div class="title-wrapper">
          <h1 class="app-title">Online Color Detection</h1>
        </div>

        <!-- Spacer -->
        <div style="width: 40px;"></div>
      </v-container>
    </v-app-bar>

    <!-- Divider under the app bar -->
    <div class="custom-divider"></div>

    <!-- Side Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      app
      right
      temporary
      :color="drawerColor"
      dark
    >
      <v-list dense>
        <v-list-item @click="logout">
          <v-list-item-icon>
            <v-icon color="white">mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="white--text">Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <v-container class="pt-10">
        <Nuxt />
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer app class="justify-center" color="#bbbbbb" dark>
      <span>&copy; {{ new Date().getFullYear() }} Online Color Detection</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      drawer: false,
      drawerColor: '#bbbbbb'
    }
  },
  methods: {
    logout() {
      this.drawer = false
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 70%;
}

.app-title {
  color: #bbbbbb;
  font-size: clamp(16px, 5vw, 20px);
  font-weight: 700;
  margin: 0;
}

.custom-divider {
  height: 2px;
  background-color: #bbbbbb;
  width: 100%;
}

.custom-app-bar {
  border-bottom: none;
  box-shadow: none;
}
</style>
