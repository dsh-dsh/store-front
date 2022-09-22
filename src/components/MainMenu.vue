<template>
  <div class="mb-3">
    <Menubar :model="items">
      <template #start>
        <img alt="logo" src="../../src/assets/img/storelogo.png" height="30" class="mr-2">
      </template>
      <template #end>
        <div class="conteiner">
        <UserAvatar />
        <Button label="logout" @click="logout()" class="p-button-sm p-button-rounded" />
        </div>
      </template>
    </Menubar>
  </div>
</template>

<script>
import Menubar from 'primevue/menubar';
import UserAvatar from '@/components/UserAvatar.vue';
import Button from 'primevue/button';
export default {
  name: 'MainMenu',
  components: {
    Menubar,
    UserAvatar,
    Button
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

<style scoped>
  .conteiner {
    display: flex;
  }
  .mb-3 {
    margin-bottom: 30px;
  }
</style>