
import {get, post} from "@/js/common"
// import {Property} from '@/js/Constants';

export const SettingStore = {
    state: () => {
        return {
            defaultProperties: [],
            period: null,
            blockTime: 0,
            choosenDocFilters: [],
            disabledItems: [],
            blockingUsers: [],
            systemSettingMap: new Map(),
            docFilterTypes: [
                {type:'POSTING_DOC_TYPE_FILTER', name:'Поступление'},
                {type:'CHECK_DOC_TYPE_FILTER', name:'Чек ККМ'},
                {type:'RECEIPT_DOC_TYPE_FILTER', name:'Оприходование'},
                {type:'MOVEMENT_DOC_TYPE_FILTER', name:'Перемещение'},
                {type:'WRITE_OFF_DOC_TYPE_FILTER', name:'Списание'},
                {type:'WITHDRAW_ORDER_DOC_TYPE_FILTER', name:'ПКО'},
                {type:'CREDIT_ORDER_DOC_TYPE_FILTER', name:'Расходный кассовый ордер'},
                {type:'REQUEST_DOC_TYPE_FILTER', name:'Заявка'},
                {type:'INVENTORY_DOC_TYPE_FILTER', name:'Инвентаризация'},
                {type:'PERIOD_REST_MOVE_DOC_TYPE_FILTER', name:'Перенос остатков'}
            ]
        }
    },
    mutations: {
        setDefaultProperties(state, res) {
            state.defaultProperties = res;
            state.choosenDocFilters = res
                    .filter(setting => (setting.type.includes('DOC_TYPE_FILTER') && setting.property == 1))
                    .map(setting => state.docFilterTypes.find(filter => filter.type == setting.type).name);
        },
        setPeriod(state, res) {
            state.period = res;
        },
        setBlockTime(state, res) {
            state.blockTime = new Date(res);
        },
        setDisabledItems(state, res) {
            state.disabledItems = res.ids;
        },
        setBlockingUsers(state, res) {
            state.blockingUsers = res.ids;
        },
        setSystemSetting(state, [type, res]) {
            state.systemSettingMap.set(type, res.property);
        },
        setAllSystemSettings(state, res) {
            for(let setting of res) {
                state.systemSettingMap.set(setting.type, setting.property);
            }
        },
    },
    actions: {
        async getDefaultProperties({commit, rootState}) {
            let user = JSON.parse(localStorage.getItem('user'));
            const response = await get('/api/v1/setting?userId=' + user.id, rootState);
			commit('setDefaultProperties', response);
        },
        async getSystemSetting({commit, rootState}, type) {
            const response = await get('/api/v1/setting/system?type=' + type, rootState);
			commit('setSystemSetting', [type, response]);
        },
        async getAllSystemSettings({commit, rootState}) {
            const response = await get('/api/v1/setting/system/all', rootState);
			commit('setAllSystemSettings', response);
        },
        async setProperty({rootState}, [user, type, value]) {
			let request = {'user': user, 'type': type, 'property': value};
			let headers = {'Content-Type': 'application/json', 'Authorization': rootState.token };
			const response = await post('/api/v1/setting/property', headers, request, rootState);
            if(response.data == "ok") {
                this.dispatch("getDefaultProperties");
            }
        },
        async setDocTypeFilterProperties({rootState}, [user, settings]) {
			let request = {'user': user, 'settings': settings};
			let headers = {'Content-Type': 'application/json', 'Authorization': rootState.token };
			const response = await post('/api/v1/setting/doc/type/properties', headers, request, rootState);
            if(response.data == "ok") {
                this.dispatch("getDefaultProperties");
            }
        },
        async setSystemSetting({rootState}, [type, value]) {
			let request = {'type': type, 'property': value};
			let headers = {'Content-Type': 'application/json', 'Authorization': rootState.token };
			const response = await post('/api/v1/setting/system/property', headers, request, rootState);
            if(response.data == "ok") {
                this.dispatch("getSystemSetting", type);
            }
        },
        async setDisabledItems({rootState}, value) {
			let request = {'ids': value};
			let headers = {'Content-Type': 'application/json', 'Authorization': rootState.token };
			const response = await post('/api/v1/setting/disabled/items', headers, request, rootState);
            if(response.data == "ok") {
                this.dispatch("getDisabledItem");
            }
        },
        async setBlockingUsers({rootState}, value) {
			let request = {'ids': value};
			let headers = {'Content-Type': 'application/json', 'Authorization': rootState.token };
			const response = await post('/api/v1/setting/blocking/users', headers, request, rootState);
            if(response.data == "ok") {
                this.dispatch("getBlockingUsers");
            }
        },
        async getDisabledItem({commit, rootState}) {
            const response = await get('/api/v1/setting/disabled/items', rootState);
			commit('setDisabledItems', response);
        },
        async getBlockingUsers({commit, rootState}) {
            const response = await get('/api/v1/setting/blocking/users', rootState);
			commit('setBlockingUsers', response);
        },
        async getPeriod({commit, rootState}) {
            const response = await get('/api/v1/setting/period', rootState);
			commit('setPeriod', response);
        },
        async closePeriod({commit, rootState}) {
			let headers = {'Content-Type': 'application/json', 'Authorization': rootState.token };
            const response = await post('/api/v1/setting/period', headers, null, rootState);
			commit('setPeriod', response.data);
        },
        async getBlockTime({commit, rootState}) {
            const response = await get('/api/v1/setting/block/time', rootState);
			commit('setBlockTime', response);
        },
    }
}