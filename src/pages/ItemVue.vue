<template>
  <VueAligner>
    <p>Item: {{id}}</p>
  </VueAligner>
  <p>Item: {{id}}</p>
</template>

<script>
import VueAligner from '@/components/VueAligner.vue'

export default {
  name: 'ItemVue',
  props: ['id'],
  components: {
    VueAligner
  },
  data() {
    return {
    };
  },
}
</script>