<template>
<div>
    <router-view></router-view>
    <Toast position="top-right"> 
      <template #message="slotProps">
        <div class="flex flex-column">
          <div><b>{{slotProps.message.summary}}</b></div>
          <div class="flex mb-2">{{slotProps.message.detail}}</div>
          <div v-if="slotProps.message.list" style="max-width: 27rem">
            <div class="flex mb-1" v-for="line in slotProps.message.list" v-bind:key="line.itemId">
              <div class="flex-none flex mr-2">{{ formatName(line.itemName) + ", " + line.unit }}</div>
              <div class="flex-grow-1 flex white-space-nowrap overflow-hidden">
                . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . </div>
              <div class="flex-none flex ml-2">{{ formatQuantity(line.value)}}</div>
            </div>
            <Button v-if="isAdmin" icon="pi pi-check" label="исправить и провести" class="p-button-sm p-button-outlined p-button-success mt-2" 
                @click="fixShortages(slotProps.message.docId, slotProps.message.list)" />
          </div>
        </div>
      </template>
    </Toast>
</div>
</template>

<script>
import Toast from 'primevue/toast';
import {Property} from '@/js/Constants';
import Button from 'primevue/button';
export default {
  name: 'App',
  components: {
    Toast,
    Button
  },
  data() {
    return {
      isAdmin: Boolean
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
    let user = JSON.parse(localStorage.getItem('user'));
    this.isAdmin = (user.role == 'ADMIN' || user.role == 'ACCOUNTANT') ? true :  false;
    this.$store.dispatch('getInitialData')
    this.$store.dispatch('installToast', this.$toast)
    this.$store.dispatch('getAllSystemSettings');
    this.$store.dispatch('getDefaultProperties');
  },
  methods: {
    setFontSize() {
      let fontSizeProperty = this.defaultProperties.find(prop => prop.type == Property.FONT_SIZE);
      if(fontSizeProperty) {
        let root= document.documentElement;
        root.style.setProperty('--app-font-size', 1 + (fontSizeProperty.property / 200) + 'rem');
      }
    },
    formatName(value) {
      return value.substring(0, 36);
    },
    formatQuantity(value) {
      return Number(value).toFixed(3);
    },
    fixShortages(docId, shortages) {
      this.$store.dispatch('fixShortages', [docId, shortages]);
      this.$toast.removeAllGroups();
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
    width: 30rem !important;
  }
  /* width */
  ::-webkit-scrollbar {
      width: 6px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
      box-shadow: inset 0 0 4px grey;
      border-radius: 4px;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
      background: rgb(145, 144, 144);
      border-radius: 6px;
  }
</style>
