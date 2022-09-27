<template>
  <div class="tree">
    <Tree :value="nodes" :expandedKeys="expandedKeys" selectionMode="single" v-model:selectionKeys="selectedKey" 
    :metaKeySelection="false" @node-collapse="onNodeCollapse" @node-expand="onNodeExpand" @node-select="onNodeSelect"></Tree>
  </div>
</template>

<script>
import Tree from 'primevue/tree';

export default {
  name: 'CompanyTree',
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
      return this.$store.state.fs.companyTree;
    },
    expandedKeys() {
      let result = this.$store.state.fs.expandedCompanyKeys;
      return result;
    }
  },
  mounted() {
      this.$store.dispatch('getCompanyTree');
  },
  methods: {
    onNodeSelect(node) {
      if(!node.is_node) {
        this.$store.dispatch('getCompany', node.data);
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
  }
</style>