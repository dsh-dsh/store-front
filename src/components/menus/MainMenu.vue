<template>
  <div class="mb-3">
    <Menubar :model="items">
      <template #start>
        <img alt="logo" src="@/assets/img/storelogo.png" height="30" class="mr-2">
      </template>
      <template #end>
        <div class="conteiner">
        <UserAvatar />
        <Button icon="pi pi-arrow-circle-right" @click="logout()" class="p-button-rounded p-button-secondary p-button-text" />
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
          label: "Контрагенты",
          icon: "pi pi-fw pi-clone",
          to: "/companies"
        },
        {
          label: "Пользователи",
          icon: "pi pi-fw pi-users",
          to: "/users"
        }
        
      ],
      user: null,
    };
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem('user'));
    let item = {
          label: "Отчеты",
          icon: "pi pi-fw pi-align-left",
          items:[
            {
              label:'Движения товара',
              icon:'pi pi-fw pi-th-large',
              to: "/reports/itemMoves"
            },
            {
              label:'Продажи',
              icon:'pi pi-fw pi-box',
              to: "/reports/sales"
            },]
        };
    if(this.user.role == 'ADMIN') {
        item.items.push(
            {
              label:'Отчет за период',
              icon:'pi pi-fw pi-clock',
              to: "/reports/period"
            }
        );
        item.items.push(
            {
              label:'Оплаты',
              icon:'pi pi-fw pi-money-bill',
              to: "/reports/payments"
            }
        );
      }
      this.items.push(item)
      this.items.push({
          label: "Настройки",
          icon: "pi pi-fw pi-cog",
          to: "/settings"
        });
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
    }
  }
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