<template>
    <MainMenu />
    <Button label="Submit" @click="connect" />
</template>

<script>
import MainMenu from '@/components/MainMenu.vue'
import Button from 'primevue/button';
export default {
  name: 'DefaultContent',
  components: {
    MainMenu,
    Button
  },
  data() {
    return {
    };
  },
  computed: {
  },
  methods: {
    connect() {
      this.$store.dispatch("connect");
    }
  },
}
</script>