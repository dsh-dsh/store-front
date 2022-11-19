<template>
  <MainMenu />
  <div class="conteiner">
    <ItemTree />
    <ItemForm />
  </div>
</template>

<script>
import ItemTree from '@/components/trees/ItemTree.vue';
import ItemForm from '@/components/forms/ItemForm.vue';
import MainMenu from '@/components/menus/MainMenu.vue';

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