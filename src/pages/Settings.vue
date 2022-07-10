<template>
  <Toolbar class="top-menu">
    <template #end>
      <Button label="logout" @click="logout()" class="p-button-sm p-button-rounded" />
    </template>
  </Toolbar>
  <MainMenu />
  <Button label="Submit" @click="connect" />
</template>

<script>
import MainMenu from '@/components/MainMenu.vue'
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
export default {
  name: 'Settings',
  components: {
    MainMenu,
    Toolbar,
    Button
  },
  data() {
    return {
    };
  },
  computed: {
  },
  methods: {
    connect() {
      this.$store.dispatch("connect");
    },
    logout() {
      this.$store.dispatch('logout');
    },
  },
}
</script>

<style scoped>
  .top-menu {
    background-color: rgb(55, 59, 65);
    margin-bottom: 15px;
  }
</style>