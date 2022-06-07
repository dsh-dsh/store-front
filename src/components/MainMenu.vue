<template>
  <div class="main_menu">
    <MegaMenu :model="items" orientation="vertical" />
  </div>
</template>

<script>
import MegaMenu from 'primevue/megamenu'
export default {
  name: 'MainMenu',
  components: {
    MegaMenu,
  },
  data() {
    return {
      items: [
        {
          label: "Документы",
          icon: "pi pi-fw pi-file",
          to: '/documents'
        },
        {
          label: "Номенклатура",
          icon: "pi pi-fw pi-shopping-bag",
          to: "/items"
        },
        {
          label: "Настройки",
          icon: "pi pi-fw pi-curcle",
          to: "/default"
        },
      ],
    };
  },
}
</script>