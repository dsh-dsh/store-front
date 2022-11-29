import { createRouter, createWebHashHistory } from 'vue-router'

import LoginPage from "@/pages/LoginPage.vue";
import DocContent from "@/pages/DocContent.vue";
import ItemContent from "@/pages/ItemContent.vue";
import SettingPage from "@/pages/SettingPage.vue";
import UserContent from "@/pages/UserContent.vue";
import CompanyContent from "@/pages/CompanyContent.vue";
import ReportPage from "@/pages/ReportPage.vue";

const routes = [
  { path: '/', redirect: '/documents/posting' },
  { path: '/login', component: LoginPage },
  { path: '/documents/:filter?', component: DocContent, props: true },
  { path: '/items', component: ItemContent },
  { path: '/companies', component: CompanyContent },
  { path: '/users', component: UserContent },
  { path: '/settings', component: SettingPage },
  { path: '/reports/:type?', component: ReportPage, props: true }
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

const publicPages = ['/login'];

router.beforeEach((to, from, next) => {
  const authRequired = !publicPages.includes(to.path);
  let loggedIn = JSON.parse(localStorage.getItem('user'));
  if (authRequired && !loggedIn) {
    return next('/login');
  }
  next();
})
