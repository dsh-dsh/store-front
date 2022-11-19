<template>
  <MainMenu />
  <div class="conteiner">
    <UserTree />
    <UserForm />
  </div>
</template>

<script>
import UserTree from '@/components/trees/UserTree.vue';
import UserForm from '@/components/forms/UserForm.vue';
import MainMenu from '@/components/menus/MainMenu.vue';

export default {
  name: 'UserContent',
  components: {
    UserTree, 
    UserForm,
    MainMenu
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
  .conteiner {
    display: flex;
    flex: 0 0 100%;
  }
</style>