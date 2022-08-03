
import {get, post} from "@/js/common"
import {Property} from '@/js/Constants';

export const SettingStore = {
    state: () => {
        return {
            defaultProperties: [],
            addShortageForHold: true,
            period: null
        }
    },
    mutations: {
        setDefaultProperties(state, res) {
            state.defaultProperties = res;
        },
        setAddShortageForHold(state, res) {
            state.addShortageForHold = res.property == 1;
        },
        setPeriod(state, res) {
            state.period = res;
        }
    },
    actions: {
        async getDefaultProperties({commit, rootState}) {
            let user = JSON.parse(localStorage.getItem('user'));
            const response = await get('/api/v1/setting?userId=' + user.id, rootState);
			commit('setDefaultProperties', response);
        },
        async getAddShortageForHold({commit, rootState}) {
            const response = await get('/api/v1/setting/add/shortage', rootState);
			commit('setAddShortageForHold', response);
        },
        async setProperty ({rootState}, [user, type, value]) {
			let request = {'user': user, 'type': type, 'property': value};
			let headers = {'Content-Type': 'application/json', 'Authorization': rootState.token };
			const response = await post('/api/v1/setting/property', headers, request, rootState);
            if(response.data == "ok") {
                this.dispatch("getDefaultProperties");
            }
        },
        async setAddShortageForHoldProperty ({rootState}, value) {
			let request = {'type': Property.ADD_REST_FOR_HOLD, 'property': value};
			let headers = {'Content-Type': 'application/json', 'Authorization': rootState.token };
			const response = await post('/api/v1/setting/add/shortage', headers, request, rootState);
            if(response.data == "ok") {
                this.dispatch("getDefaultProperties");
            }
        },
        async getPeriod({commit, rootState}) {
            const response = await get('/api/v1/setting/period', rootState);
			commit('setPeriod', response);
        },
    }
}