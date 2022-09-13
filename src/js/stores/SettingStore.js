
import {get, post} from "@/js/common"
import {Property} from '@/js/Constants';

export const SettingStore = {
    state: () => {
        return {
            defaultProperties: [],
            addShortageForHold: true,
            averagePriceForPeriodCloseProperty: Boolean,
            аveragePriceForDocsProperty: Boolean,
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
        setAveragePriceForPeriodCloseProperty(state, res) {
            state.аveragePriceForPeriodCloseProperty = res.property == 1;
        },
        getAveragePriceForDocsProperty(state, res) {
            state.аveragePriceForDocsProperty = res.property == 1;
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
        async getAveragePriceForPeriodCloseProperty({commit, rootState}) {
            const response = await get('/api/v1/setting/average/price/period', rootState);
			commit('setAveragePriceForPeriodCloseProperty', response);
        },
        async getAveragePriceForDocsProperty({commit, rootState}) {
            const response = await get('/api/v1/setting/average/price/docs', rootState);
			commit('setAveragePriceForDocsProperty', response);
        },
        async setProperty ({rootState}, [user, type, value]) {
			let request = {'user': user, 'type': type, 'property': value};
			let headers = {'Content-Type': 'application/json', 'Authorization': rootState.token };
			const response = await post('/api/v1/setting/property', headers, request, rootState);
            if(response.data == "ok") {
                this.dispatch("getDefaultProperties");
            }
        },
        async setAddShortageForHoldProperty({rootState}, value) {
			let request = {'type': Property.ADD_REST_FOR_HOLD, 'property': value};
			let headers = {'Content-Type': 'application/json', 'Authorization': rootState.token };
			const response = await post('/api/v1/setting/add/shortage', headers, request, rootState);
            if(response.data == "ok") {
                this.dispatch("getDefaultProperties");
            }
        },
        async setAveragePriceForPeriodCloseProperty({rootState}, value) {
			let request = {'type': Property.AVERAGE_COST, 'property': value};
			let headers = {'Content-Type': 'application/json', 'Authorization': rootState.token };
			const response = await post('/api/v1/setting/average/price/period', headers, request, rootState);
            if(response.data == "ok") {
                this.dispatch("getAveragePriceForPeriodCloseProperty");
            }
        },
        async setAveragePriceForDocsProperty({rootState}, value) {
			let request = {'type': Property.AVERAGE_COST, 'property': value};
			let headers = {'Content-Type': 'application/json', 'Authorization': rootState.token };
			const response = await post('/api/v1/setting/average/price/docs', headers, request, rootState);
            if(response.data == "ok") {
                this.dispatch("getAveragePriceForDocsProperty");
            }
        },
        async getPeriod({commit, rootState}) {
            const response = await get('/api/v1/setting/period', rootState);
			commit('setPeriod', response);
        },
        async closePeriod({commit, rootState}) {
			let headers = {'Content-Type': 'application/json', 'Authorization': rootState.token };
            const response = await post('/api/v1/setting/period', headers, null, rootState);
			commit('setPeriod', response.data);
        }
    }
}