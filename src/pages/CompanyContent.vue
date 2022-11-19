<template>
  <MainMenu />
  <div class="conteiner">
    <CompanyTree />
    <CompanyForm />
  </div>
</template>

<script>
import CompanyTree from '@/components/trees/CompanyTree.vue';
import CompanyForm from '@/components/forms/CompanyForm.vue';
import MainMenu from '@/components/menus/MainMenu.vue';

export default {
  name: 'CompanyContent',
  components: {
    CompanyTree, 
    CompanyForm,
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