import Vue from 'vue';
import Vuex from 'vuex';
import state from './state';
import getWeb3 from '../util/getWeb3';
import {getContract} from '../util/getContract';

Vue.use(Vuex);

export const store = new Vuex.Store({
    strict: true,
    state,
    mutations: {
        getWeb3Instance(state, payload) {
            console.log('commited result to registerWeb3Instance mutation');
            const result = payload; let web3Copy = state.web3;
            web3Copy.networkId = result.netWorkId;
            web3Copy.web3Instance = result.web3;
            state.web3Instance = result.web3;
        },
        getContractInstance(state, payload) {
            let contract = payload.name;
            state.contracts[contract] = () => payload;
            console.log('Contracts: ', contract);
        },
        getAccountInstance(state, payload) {
            console.log('Account is:', payload[0]);
            state.account = payload[0];
        },

    },
    actions: {
        async getWeb3Instance({commit}) {
            await getWeb3.then(r => {
                commit('getWeb3Instance', r);
            }).catch(e => console.error('error in action getWeb3Instance', e));
        },
        async getContractInstance({commit}) {
            let contracts = state.contracts;
            for (let contract in contracts) {
                if (!contracts.contract) {
                    await getContract(contract).then(r => {
                        r.name = contract;
                        commit('getContractInstance', r);
                    }).catch(e => console.error('error in action getContractInstance', e));
                }
            }
        },
        async getAccount({commit}) {
            try {
                const web3 = state.web3.web3Instance();
                const accounts = await web3.eth.getAccounts();
                commit('getAccountInstance', accounts);
            } catch (err) {
                console.error('error in action getAccount', err);
            }
        }
    }

});