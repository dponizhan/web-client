import {
  incomingWithdrawalRequestsModule,
  mutations,
  getters,
  actions,
} from './index'
import { types } from './types'

import { base } from '@tokend/js-sdk'

import { IncomingWithdrawalRequest } from '../wrappers/incoming-withdrawal-request'

import { api } from '@/api'

describe('incoming-withdrawals-requests.module', () => {
  describe('vuex types', () => {
    const getModuleKeys = (module) => {
      return Object.keys({
        ...module.actions,
        ...module.mutations,
        ...module.getters,
      })
    }

    it('every entity in module should be mentioned in vuex-types', () => {
      for (const key of getModuleKeys(incomingWithdrawalRequestsModule)) {
        expect(types).to.have.property(key)
      }
    })

    it('every key described in vuex-types should be a real vuex-entity', () => {
      const moduleKeys = [
        ...getModuleKeys(incomingWithdrawalRequestsModule),
      ]

      for (const key of Object.keys(types)) {
        expect(moduleKeys).to.include(key)
      }
    })
  })

  describe('mutations', () => {
    it('SET_REQUESTS should properly modify state', () => {
      const state = {
        requests: [],
      }
      const requests = [
        { id: '1' },
        { id: '2' },
      ]

      mutations[types.SET_REQUESTS](state, requests)

      expect(state).to.deep.equal({
        requests: [
          { id: '1' },
          { id: '2' },
        ],
      })
    })

    it('CONCAT_REQUESTS should properly modify state', () => {
      const state = {
        requests: [
          { id: '1' },
          { id: '2' },
        ],
      }
      const requests = [
        { id: '3' },
        { id: '4' },
      ]

      mutations[types.CONCAT_REQUESTS](state, requests)

      expect(state).to.deep.equal({
        requests: [
          { id: '1' },
          { id: '2' },
          { id: '3' },
          { id: '4' },
        ],
      })
    })
  })

  describe('actions', () => {
    describe('LOAD_REQUESTS', () => {
      it('calls api.getWithSignature method with provided params', async () => {
        sinon.stub(api, 'getWithSignature').resolves()

        await actions[types.LOAD_REQUESTS]({
          rootGetters: { accountId: 'SOME_ACCOUNT_ID' },
        })

        expect(api.getWithSignature)
          .to.have.been.calledOnceWithExactly(
            '/v3/create_withdraw_requests',
            {
              page: { order: 'desc' },
              filter: { reviewer: 'SOME_ACCOUNT_ID' },
              include: ['request_details'],
            }
          )

        api.getWithSignature.restore()
      })
    })

    describe('APPROVE_REQUEST', () => {
      beforeEach(() => {
        sinon.stub(api, 'postOperations').resolves()
        sinon.stub(base.ReviewRequestBuilder, 'reviewWithdrawRequest')
      })

      afterEach(() => {
        api.postOperations.restore()
        base.ReviewRequestBuilder.reviewWithdrawRequest.restore()
      })

      it('calls base.ReviewRequestBuilder.reviewWithdrawRequest with provided params', async () => {
        await actions[types.APPROVE_REQUEST]({}, {
          id: 'REQUEST_ID',
          hash: 'REQUEST_HASH',
          typeI: 1,
          pendingTasks: 1024,
        })

        expect(base.ReviewRequestBuilder.reviewWithdrawRequest)
          .to.have.been.calledOnceWithExactly({
            requestID: 'REQUEST_ID',
            requestHash: 'REQUEST_HASH',
            requestType: 1,
            reviewDetails: {
              tasksToAdd: 0,
              tasksToRemove: 1024,
              externalDetails: {},
            },
            requestDetails: '{"tasksToAdd":0,"tasksToRemove":1024,"externalDetails":{}}',
            action: base.xdr.ReviewRequestOpAction.approve().value,
            reason: '',
          })
      })

      it('calls api.postOperations', async () => {
        await actions[types.APPROVE_REQUEST]({}, {})

        expect(api.postOperations).to.have.been.calledOnce
      })
    })

    describe('REJECT_REQUEST', () => {
      beforeEach(() => {
        sinon.stub(api, 'postOperations').resolves()
        sinon.stub(base.ReviewRequestBuilder, 'reviewWithdrawRequest')
      })

      afterEach(() => {
        api.postOperations.restore()
        base.ReviewRequestBuilder.reviewWithdrawRequest.restore()
      })

      it('calls base.ReviewRequestBuilder.reviewWithdrawRequest with provided params', async () => {
        await actions[types.REJECT_REQUEST]({}, {
          request: {
            id: 'REQUEST_ID',
            hash: 'REQUEST_HASH',
            typeI: 1,
            pendingTasks: 1024,
          },
          reason: 'Some reason',
        })

        expect(base.ReviewRequestBuilder.reviewWithdrawRequest)
          .to.have.been.calledOnceWithExactly({
            requestID: 'REQUEST_ID',
            requestHash: 'REQUEST_HASH',
            requestType: 1,
            reviewDetails: {
              tasksToAdd: 0,
              tasksToRemove: 1024,
              externalDetails: {},
            },
            requestDetails: '{"tasksToAdd":0,"tasksToRemove":1024,"externalDetails":{}}',
            action: base.xdr.ReviewRequestOpAction.permanentReject().value,
            reason: 'Some reason',
          })
      })

      it('calls api.postOperations', async () => {
        await actions[types.REJECT_REQUEST]({}, { request: {}, reason: '' })

        expect(api.postOperations).to.have.been.calledOnce
      })
    })
  })

  describe('getters', () => {
    it('requests', () => {
      const state = {
        requests: [
          { id: '1' },
          { id: '2' },
        ],
      }

      expect(getters[types.requests](state))
        .to.deep.equal([
          new IncomingWithdrawalRequest({ id: '1' }),
          new IncomingWithdrawalRequest({ id: '2' }),
        ])
    })
  })
})
