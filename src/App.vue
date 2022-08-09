<template>
<div>
    <router-view></router-view>
    <Toast position="bottom-right" />
</div>
</template>

<script>
import Toast from 'primevue/toast';
export default {
  name: 'App',
  components: {
    Toast
  },
  data() {
    return {
    }
  },
  mounted() {
    this.$store.dispatch('installToast', this.$toast)
    this.$store.dispatch('getToken')
    this.$store.dispatch('getWorkShops')
    this.$store.dispatch('getUnits')
    this.$store.dispatch('getProjects')
    this.$store.dispatch('getStorages')
    // this.$store.dispatch('getItems')
    this.$store.dispatch('getUsers')
    this.$store.dispatch('getCompanies')
    this.$store.dispatch('getDocTypes')
    this.$store.dispatch('getDefaultProperties')
    this.$store.dispatch('getPeriod')
    this.$store.dispatch('setDates')
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
</style>
