<template>
  <Toolbar class="top-menu">
    <template #end>
      <UserAvatar />
      <Button label="logout" @click="logout()" class="p-button-sm p-button-rounded" />
    </template>
  </Toolbar>
  <div class="conteiner">
    <MainMenu />
    <ItemTree />
    <ItemForm />
  </div>
</template>

<script>
import ItemTree from '@/components/ItemTree.vue';
import ItemForm from '@/components/ItemForm.vue';
import MainMenu from '@/components/MainMenu.vue';
import UserAvatar from '@/components/UserAvatar.vue';
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';

export default {
  name: 'ItemContent',
  components: {
    ItemTree, 
    ItemForm,
    MainMenu,
    Toolbar,
    Button,
    UserAvatar
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