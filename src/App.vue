<template>
  <Navbar />
  <main class="container-fluid px-3">
    <RouterView />
  </main>
</template>

<script>
import Navbar from './components/Navbar.vue'; // Importa el componente Navbar

export default {
  components: {
    Navbar, // Registra el componente Navbar
  },
};
</script>

<style scoped>
/* No es necesario aplicar padding-top aquí */
</style>