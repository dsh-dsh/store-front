<template>
  <Toolbar class="top-menu">
    <template #end>
      <Button label="logout" @click="logout()" class="p-button-sm p-button-rounded" />
    </template>
  </Toolbar>
  <div class="conteiner">
    <MainMenu />
    <UserTree />
    <UserForm />
  </div>
</template>

<script>
import UserTree from '@/components/UserTree.vue';
import UserForm from '@/components/UserForm.vue';
import MainMenu from '@/components/MainMenu.vue';
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';

export default {
  name: 'UserContent',
  components: {
    UserTree, 
    UserForm,
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
    logout() {
      this.$store.dispatch('logout');
    }
  },
}
</script>

<style scoped>
  .top-menu {
    background-color: rgb(55, 59, 65);
    margin-bottom: 15px;
  }
  .conteiner {
    display: flex;
  }
</style>