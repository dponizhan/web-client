import Vue from 'vue'
import Router from 'vue-router'

import { vuexTypes } from '@/vuex'

import { resolveRedirect } from '@/vue-router/redirect'
import { vueRoutes } from '@/vue-router/routes'
import { SchemeRegistry } from '@/modules-arch/scheme-registry'

Vue.use(Router)

export function buildRouter (store) {
  // TODO: find a way to rebuild router’s routes.
  // Because would be nice if we do not even build routes that the logged in
  // user cannot access

  return new Router({
    mode: 'history',
    routes: [
      {
        path: '*',
        redirect: vueRoutes.app,
      },
      {
        path: '/r/*',
        name: 'horizon-redirect',
        beforeEnter: resolveRedirect,
      },
      {
        path: '/terms',
        name: vueRoutes.terms.name,
        component: _ => import('@/vue/pages/Terms'),
      },
      {
        path: '/downloads',
        name: vueRoutes.downloads.name,
        component: _ => import('@/vue/pages/Downloads'),
      },
      {
        path: '/ios-installation-guide',
        name: vueRoutes.iosInstallationGuide.name,
        component: _ => import('@/vue/pages/IosInstallationGuide'),
      },
      {
        path: '/pre-issuance-guide',
        name: vueRoutes.preIssuanceGuide.name,
        component: resolve => require(['@/vue/pages/PreIssuanceGuide'], resolve),
      },
      {
        path: '/auth',
        name: vueRoutes.auth.name,
        redirect: vueRoutes.login,
        component: _ => import('@/vue/pages/Auth'),
        children: [
          {
            path: '/sign-in',
            name: vueRoutes.login.name,
            component: _ => import('@/vue/pages/Login'),
            beforeEnter: buildAuthPageGuard(store),
          },
          {
            path: '/sign-up',
            name: vueRoutes.signup.name,
            component: _ => import('@/vue/pages/Signup'),
            beforeEnter: buildAuthPageGuard(store),
          },
          {
            path: '/verify/:paramsBase64',
            name: vueRoutes.verify.name,
            component: _ => import('@/vue/pages/Verify'),
            beforeEnter: buildAuthPageGuard(store),
            props: true,
          },
          {
            path: '/recovery',
            name: vueRoutes.recovery.name,
            component: _ => import('@/vue/pages/Recovery'),
            beforeEnter: buildAuthPageGuard(store),
          },
        ],
      },
      {
        path: '/',
        name: 'app',
        meta: { isNavigationRendered: true },
        component: _ => import('@/vue/AppContent'),
        beforeEnter: buildInAppRouteGuard({
          scheme: SchemeRegistry.current,
          store,
        }),
        // TODO: redirect sanity check
        // TODO: featureWhiteList name sanity check
        // TODO: meta structure sanity check
        // TODO: isCorporateOnly calc
        redirect: vueRoutes.dashboard,
        children: [
          {
            path: '/dashboard',
            name: vueRoutes.dashboard.name,
            component: _ => import('@/vue/pages/Dashboard'),
            meta: {
              pageNameTranslationId: 'pages-names.dashboard',
              featureWhiteList: [
                { name: 'reg.db.issuance-form', options: { isCorporateOnly: true } },
                { name: 'reg.db.transfer-form' },
                { name: 'reg.db.chart' },
                { name: 'reg.db.latest-activity' },
              ],
              sidebar: {
                menuButtonTranslationId: 'pages-names.dashboard',
                menuButtonMdiName: 'view-dashboard',
              },
            },
          },
        ],
      },
    ],
    scrollBehavior: _ => ({ x: 0, y: 0 }),
  })
}

// doesn't allow to visit auth page if user is already logged in
function buildAuthPageGuard (store) {
  return function authPageGuard (to, from, next) {
    const isLoggedIn = store.getters[vuexTypes.isLoggedIn]

    isLoggedIn
      ? next(vueRoutes.app)
      : next()
  }
}

// doesn't allow to visit in-app page if user is not already logged in
function buildInAppRouteGuard ({ store, scheme }) {
  return function inAppRouteGuard (to, from, next) {
    const isLoggedIn = store.getters[vuexTypes.isLoggedIn]
    // TODO: remove when all components modulerized
    const isAccessible = scheme.findModuleByPath(to.path)
      ? scheme.findModuleByPath(to.path).isAccessible
      : true

    isLoggedIn && isAccessible
      ? next()
      : next({
        name: vueRoutes.login.name,
        query: { redirectPath: to.fullPath },
      })
  }
}
