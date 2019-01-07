import store from '../store'
import router from './index'
import {
  getToken
} from '../assets/js/auth'

const list = [];

//不重定向白名单
const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
  if (getToken()) {
    if (to.path === '/login') {
      next('/')
    } else {
      if (store.state.app.navList.length == 0) {
        await store.dispatch('app/createNavList', list);
        next({ ...to,
          replace: true
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
    }
  }

})
