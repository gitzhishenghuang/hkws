import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'
import Admin from '@/components/admin'
import User from '@/components/user'
import DirAdmin from '@/components/admin/dirAdmin'
import FileServer from '@/components/admin/fileServer'
import Report from '@/components/admin/report'
import FolderReport from '@/components/admin/report/FolderReport'
import RenewalOfApproval from '@/components/admin/report/RenewalOfApproval'
import Authorization from '@/components/admin/authorization'
import CommitLog from '@/components/admin/commitLog'
import notFount from '@/components/notFount'
import test from '@/components/test'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      alias: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/admin',
      component: Admin,
      children:[
        {
          path:'',
          alias: 'dirAdmin',
          component:DirAdmin
        },
        {
          path:'fileServer',
          component:FileServer
        },
        {
          path:'authorization',
          component:Authorization
        },
        {
          path:'commitLog',
          component:CommitLog
        },
        {
          path:'report',
          component:Report,
          children:[
            /*{
              path:'',
              alias: 'FolderReport',
              component:FolderReport
            },*/
            {
              path:'RenewalOfApproval',
              component:RenewalOfApproval
            }
          ]
        }
      ]
    },
    {
      path: '/user',
      component: User
    },
    {
      path: '/test',
      component: test
    },
    {
      path:'*',
      component:notFount
    }
  ]
})
