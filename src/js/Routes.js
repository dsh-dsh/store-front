import { createRouter, createWebHashHistory } from 'vue-router'

import LoginPage from "../pages/LoginPage.vue";
import DocContent from "../pages/DocContent.vue";
import ItemContent from "../pages/ItemContent.vue";
import DefaultContent from "../pages/DefaultContent.vue";

const routes = [
  { path: '/', redirect: '/documents' },
  { path: '/login', component: LoginPage },
  { path: '/documents/:filter?', component: DocContent, props: true },
  { path: '/items', component: ItemContent },
  { path: '/default', component: DefaultContent }
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

  // console.log("path: ", to.path)
  // console.log("authRequired: ", authRequired)
  // console.log("user: ", loggedIn)

  if (authRequired && !loggedIn) {
    return next('/login');
  }

  next();
})
