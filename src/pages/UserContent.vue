<template>
  <MainMenu />
  <div class="conteiner">
    <UserTree />
    <UserForm />
  </div>
</template>

<script>
import UserTree from '@/components/UserTree.vue';
import UserForm from '@/components/UserForm.vue';
import MainMenu from '@/components/MainMenu.vue';

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