import { createRouter, createWebHashHistory } from 'vue-router'

import LoginPage from "@/pages/LoginPage.vue";
import DocContent from "@/pages/DocContent.vue";
import ItemContent from "@/pages/ItemContent.vue";
import Settings from "@/pages/Settings.vue";
import UserContent from "@/pages/UserContent.vue";

const routes = [
  { path: '/', redirect: '/documents' },
  { path: '/login', component: LoginPage },
  { path: '/documents/:filter?', component: DocContent, props: true },
  { path: '/items', component: ItemContent },
  { path: '/users', component: UserContent },
  { path: '/default', component: Settings }
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);
  // localStorage.setItem('user', {'token': "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjdXN0b21lckBtYWlsLnJ1IiwiZXhwIjoxNjU0OTI2MzI5fQ.YZj9WwPj19M4k-VGvcNmJTcOQiy92OvUAkd2nMiEAe0"})
  // localStorage.removeItem('user')
  let loggedIn = JSON.parse(localStorage.getItem('user'));

  if (authRequired && !loggedIn) {
    return next('/login');
  }

  next();
})
