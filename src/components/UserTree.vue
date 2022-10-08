<template>
  <div class="tree">
    <Tree :value="nodes" :expandedKeys="expandedKeys" selectionMode="single" v-model:selectionKeys="selectedKey" 
    :metaKeySelection="false" @node-collapse="onNodeCollapse" @node-expand="onNodeExpand" @node-select="onNodeSelect"
    scrollHeight="900px"></Tree>
  </div>
</template>

<script>
import Tree from 'primevue/tree';

export default {
  name: 'UserTree',
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
      return this.$store.state.us.userTree;
    },
    expandedKeys() {
      let result = this.$store.state.us.expandedKeys;
      return result;
    }
  },
  mounted() {
      this.$store.dispatch('getUserTree');
  },
  methods: {
    onNodeSelect(node) {
      if(!node.is_node) {
        this.$store.dispatch('getPerson', node.data);
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
    width: 300pt;
  }
</style>