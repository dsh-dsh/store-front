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
  computed: {
    token() {
      return this.$store.state.token;
    }
  },
  mounted() {
    this.$store.dispatch('getInitialData')
    this.$store.dispatch('installToast', this.$toast)
    this.$store.dispatch('getHoldingDialogProperty');
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
}
</style>
