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
          to: '/documents/posting'
        },
        {
          label: "Номенклатура",
          icon: "pi pi-fw pi-shopping-bag",
          to: "/items"
        },
        {
          label: "Пользователи",
          icon: "pi pi-fw pi-users",
          to: "/users"
        },
        {
          label: "Настройки",
          icon: "pi pi-fw pi-cog",
          to: "/settings"
        },
      ],
    };
  },
}
</script>