
<template>
    <OverlayPanel ref="op">
        11111
    </OverlayPanel>
</template>

<script>
import OverlayPanel from 'primevue/overlaypanel';
export default {
  name: 'Panel',
  components: {
        OverlayPanel
    },
    props: {
        content: String
    },
    data() {
        return {
        };
    },
    computed: {
        // content()
    }, 
    watch: {
      content(value) {
        console.log('togle in Panel')
        this.$refs.op.toggle(value);
      }
    },
    methods: {
    },
}
</script>