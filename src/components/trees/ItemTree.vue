<template>
    <Tree :value="nodes" :filter="true" filterMode="strict" :expandedKeys="expandedKeys" selectionMode="single" v-model:selectionKeys="selectedKey" 
    :metaKeySelection="false" @node-collapse="onNodeCollapse" @node-expand="onNodeExpand" @node-select="onNodeSelect"
    scrollHeight="600px"></Tree>
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
  props: {
    type: String
  },
  emits: {
    getItemId: null,
  },
  computed: {
    nodes() {
      return this.$store.state.is.itemTree;
    },
    expandedKeys() {
      let result = this.$store.state.is.expandedKeys;
      return result;
    }
  },
  mounted() {
      this.$store.dispatch('getItemTree');
  },
  methods: {
    onNodeSelect(node) {
      if(this.type == 'direct') {
        this.$emit('getItemId', node);
        return;
      }
      if(!node.is_node) {
        this.$store.dispatch('getItem', node.data);
        this.$store.dispatch('delCrumbs');
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
</style>