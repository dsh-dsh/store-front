<template>
  <MainMenu />
  <div class="conteiner">
    <ItemTree />
    <ItemForm />
  </div>
</template>

<script>
import ItemTree from '@/components/ItemTree.vue';
import ItemForm from '@/components/ItemForm.vue';
import MainMenu from '@/components/MainMenu.vue';

export default {
  name: 'ItemContent',
  components: {
    ItemTree, 
    ItemForm,
    MainMenu
  },
  data() {
    return {
    };
  }
}
</script>

<style scoped>
  .conteiner {
    display: flex;
    flex: 0 0 100%;
  }
</style>