<template>
<div>
    <router-view></router-view>
    <Toast position="top-right" /> 
</div>
</template>

<script>
import Toast from 'primevue/toast';
import {Property} from '@/js/Constants';
export default {
  name: 'App',
  components: {
    Toast
  },
  data() {
    return {
    }
  },
  computed: {
    token() {
      return this.$store.state.token;
    },
    defaultProperties() {
      return this.$store.state.ss.defaultProperties;
    }
  },
  watch: {
    defaultProperties() {
      this.setFontSize();
    }
  },
  mounted() {
    this.$store.dispatch('getInitialData')
    this.$store.dispatch('installToast', this.$toast)
    this.$store.dispatch('getHoldingDialogProperty');
    this.$store.dispatch('getOurCompanyProperty');
    this.$store.dispatch('getDefaultProperties');
  },
  methods: {
    setFontSize() {
      let fontSizeProperty = this.defaultProperties.find(prop => prop.type == Property.FONT_SIZE);
      if(fontSizeProperty) {
        let root= document.documentElement;
        root.style.setProperty('--app-font-size', 1 + (fontSizeProperty.property / 200) + 'rem');
      }
    }
  }
}
</script>

<style>
  :root {
  --app-font-size: 1rem;
  }
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: left;
    color: #1d2c3a;
  }
  .p-component {
    font-size: var(--app-font-size);
  }
  .p-toast-top-right {
    top: 20px;
    right: 50px;
  }
  .p-toast {
    position: fixed;
    width: 28rem;
  }
</style>
