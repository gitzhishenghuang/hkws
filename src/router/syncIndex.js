import Vue from 'vue'
import Router from 'vue-router'
import notFount from '@/components/notFount'
import test from '@/components/test'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      alias: '/login',
      component: resolve=> require(['@/components/login'],resolve)
    },
    {
      path: '/admin',
      component: require(['@/components/admin'],resolve),
      children:[
        {
          path:'',
          alias: 'dirAdmin',
          component:resolve=> require(['@/components/admin/dirAdmin'],resolve)
        },
        {
          path:'fileServer',
          component:resolve=> require(['@/components/admin/fileServer'],resolve)
        },
        {
          path:'authorization',
          component:resolve=> require(['@/components/admin/authorization'],resolve)
        },
        {
          path:'commitLog',
          component:resolve=> require(['@/components/admin/commitLog'],resolve)
        },
        {
          path:'report',
          component:resolve=> require(['@/components/admin/report'],resolve),
          children:[
            /*{
              path:'',
              alias: 'FolderReport',
              component:FolderReport
            },*/
            {
              path:'RenewalOfApproval',
              component:resolve=> require(['@/components/admin/report/RenewalOfApproval'],resolve)
            }
          ]
        }
      ]
    },
    {
      path: '/user',
      component:resolve=> require(['@/components/user'],resolve)
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
