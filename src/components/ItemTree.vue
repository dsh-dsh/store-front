<template>
  <div class="tree">
    <Tree :value="nodes" selectionMode="single" v-model:selectionKeys="selectedKey" 
    :metaKeySelection="false" @node-select="onNodeSelect"></Tree>
  </div>
</template>

<script>
import Tree from 'primevue/tree';
export default {
  name: 'ItemTree',
  components: {
    Tree
  },
  data() {
    return {
      selectedKey: null
    }
  },
  computed: {
    nodes() {
      return this.$store.state.itemTree;
    }
  },
  mounted() {
      this.$store.dispatch('getItemTree');
  },
  methods: {
    onNodeSelect(node) {
        this.$store.dispatch('getItem', node.data);
    }
  }
}
</script>
<style scoped>
  .tree {
    width: 250pt;
    margin-left: 30px;
  }
</style>