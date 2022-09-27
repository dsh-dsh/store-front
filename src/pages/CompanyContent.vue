<template>
  <MainMenu />
  <div class="conteiner">
    <CompanyTree />
    <CompanyForm />
  </div>
</template>

<script>
import CompanyTree from '@/components/CompanyTree.vue';
import CompanyForm from '@/components/CompanyForm.vue';
import MainMenu from '@/components/MainMenu.vue';

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