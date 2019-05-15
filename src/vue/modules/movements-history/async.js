import { registerStoreModule } from '@/modules-arch/register-store-module'

export default () => {
  // TODO: here is a race condition
  // async is prohibited
  registerStoreModule(import('./store'))
  return {
    component: import('./index.vue'),
    // component: _ => {
    //   // await
    //   return import('./index.vue')
    // },
  }
}
