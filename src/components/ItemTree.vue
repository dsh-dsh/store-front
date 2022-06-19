<template>
  <div class="tree">
    <Tree :value="nodes" selectionMode="single" v-model:selectionKeys="selectedKey" 
    :metaKeySelection="false" @node-collapse="onNodeCollapse" @node-expand="onNodeExpand" @node-select="onNodeSelect"></Tree>
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
      selectedKey: null,
      parentNode: null
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
      if(!node.is_node) {
        this.$store.dispatch('getItem', node.data);
      } else {
        this.$store.dispatch('setParentNode', node);
      }
    },
    onNodeExpand(node) {
      if(node.is_node) {
        node.icon ="pi pi-fw pi-folder-open";
        this.$store.dispatch('setParentNode', node);
      }
    },
    onNodeCollapse(node) {
      if(node.is_node) {
        node.icon ="pi pi-fw pi-folder";
      }
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