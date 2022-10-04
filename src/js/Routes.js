import { createRouter, createWebHashHistory } from 'vue-router'

import LoginPage from "@/pages/LoginPage.vue";
import DocContent from "@/pages/DocContent.vue";
import ItemContent from "@/pages/ItemContent.vue";
import SettingPage from "@/pages/SettingPage.vue";
import UserContent from "@/pages/UserContent.vue";
import CompanyContent from "@/pages/CompanyContent.vue";

const routes = [
  { path: '/', redirect: '/documents/default' },
  { path: '/login', component: LoginPage },
  { path: '/documents/:filter?', component: DocContent, props: true },
  { path: '/items', component: ItemContent },
  { path: '/companies', component: CompanyContent },
  { path: '/users', component: UserContent },
  { path: '/settings', component: SettingPage }
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);
  let loggedIn = JSON.parse(localStorage.getItem('user'));
  if (authRequired && !loggedIn) {
    return next('/login');
  }
  next();
})
