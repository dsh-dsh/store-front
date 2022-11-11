
import {get, post} from "@/js/common"
import {Property} from '@/js/Constants';

export const SettingStore = {
    state: () => {
        return {
            defaultProperties: [],
            addShortageForHold: true,
            averagePriceForPeriodCloseProperty: Boolean,
            аveragePriceForDocsProperty: Boolean,
            ourCompanyIdProperty: 0,
            ingredientDirIdProperty: 0,
            holdingDialogProperty: Boolean,
            checkHoldingEnableProperty: Boolean,
            period: null,
            blockTime: 0,
            choosenDocFilters: [],
            docFilterTypes: [
                {type:'POSTING_DOC_TYPE_FILTER', name:'Поступление'},
                {type:'CHECK_DOC_TYPE_FILTER', name:'Чек ККМ'},
                {type:'RECEIPT_DOC_TYPE_FILTER', name:'Оприходование'},
                {type:'MOVEMENT_DOC_TYPE_FILTER', name:'Перемещение'},
                {type:'WRITE_OFF_DOC_TYPE_FILTER', name:'Списание'},
                {type:'WITHDRAW_ORDER_DOC_TYPE_FILTER', name:'ПКО'},
                {type:'CREDIT_ORDER_DOC_TYPE_FILTER', name:'РКО'},
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
        setAddShortageForHold(state, res) {
            state.addShortageForHold = res.property == 1;
        },
        setAveragePriceForPeriodCloseProperty(state, res) {
            state.аveragePriceForPeriodCloseProperty = res.property == 1;
        },
        setAveragePriceForDocsProperty(state, res) {
            state.аveragePriceForDocsProperty = res.property == 1;
        },
        setOurCompanyProperty(state, res) {
            state.ourCompanyIdProperty = res.property;
        },
        setIngredientDirIdProperty(state, res) {
            state.ingredientDirIdProperty = res.property;
        },
        setHoldingDialogProperty(state, res) {
            state.holdingDialogProperty = res.property == 1;
        }, 
        setCheckHoldingEnableProperty(state, res) {
            state.checkHoldingEnableProperty = res.property == 1;
        }, 
        setPeriod(state, res) {
            state.period = res;
        },
        setBlockTime(state, res) {
            state.blockTime = new Date(res);
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
        async getOurCompanyProperty({commit, rootState}) {
            const response = await get('/api/v1/setting/our/company', rootState);
			commit('setOurCompanyProperty', response);
        },
        async getIngredientDirIdProperty({commit, rootState}) {
            const response = await get('/api/v1/setting/ingredient/dir', rootState);
			commit('setIngredientDirIdProperty', response);
        },
        async getHoldingDialogProperty({commit, rootState}) {
            const response = await get('/api/v1/setting/hold/dialog/enable', rootState);
			commit('setHoldingDialogProperty', response);
        },
        async getCheckHoldingEnableProperty({commit, rootState}) {
            const response = await get('/api/v1/setting/check/holding/enable', rootState);
			commit('setCheckHoldingEnableProperty', response);
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
			await post('/api/v1/setting/doc/type/properties', headers, request, rootState);
        },
        async setAddShortageForHoldProperty({rootState}, value) {
			let request = {'type': Property.ADD_REST_FOR_HOLD_1C_DOCS, 'property': value};
			let headers = {'Content-Type': 'application/json', 'Authorization': rootState.token };
			const response = await post('/api/v1/setting/add/shortage', headers, request, rootState);
            if(response.data == "ok") {
                this.dispatch("getDefaultProperties");
            }
        },
        async setAveragePriceForPeriodCloseProperty({rootState}, value) {
			let request = {'type': Property.PERIOD_AVERAGE_PRICE, 'property': value};
			let headers = {'Content-Type': 'application/json', 'Authorization': rootState.token };
			const response = await post('/api/v1/setting/average/price/period', headers, request, rootState);
            if(response.data == "ok") {
                this.dispatch("getAveragePriceForPeriodCloseProperty");
            }
        },
        async setAveragePriceForDocsProperty({rootState}, value) {
			let request = {'type': Property.DOCS_AVERAGE_PRICE, 'property': value};
			let headers = {'Content-Type': 'application/json', 'Authorization': rootState.token };
			const response = await post('/api/v1/setting/average/price/docs', headers, request, rootState);
            if(response.data == "ok") {
                this.dispatch("getAveragePriceForDocsProperty");
            }
        },
        async setOurCompanyProperty({rootState}, value) {
			let request = {'type': Property.OUR_COMPANY_ID, 'property': value};
			let headers = {'Content-Type': 'application/json', 'Authorization': rootState.token };
			const response = await post('/api/v1/setting/our/company', headers, request, rootState);
            if(response.data == "ok") {
                this.dispatch("getOurCompanyProperty");
            }
        },
        async setIngredientDirIdProperty({rootState}, value) {
			let request = {'type': Property.INGREDIENT_DIR_ID, 'property': value};
			let headers = {'Content-Type': 'application/json', 'Authorization': rootState.token };
			const response = await post('/api/v1/setting/ingredient/dir', headers, request, rootState);
            if(response.data == "ok") {
                this.dispatch("getIngredientDirIdProperty");
            }
        },
        async setHoldingDialogEnableProperty({rootState}, value) {
			let request = {'type': Property.HOLDING_DIALOG_ENABLE, 'property': value};
			let headers = {'Content-Type': 'application/json', 'Authorization': rootState.token };
			const response = await post('/api/v1/setting/hold/dialog/enable', headers, request, rootState);
            if(response.data == "ok") {
                this.dispatch("getHoldingDialogProperty");
            }
        },
        async setCheckHoldingEnableProperty({rootState}, value) {
			let request = {'type': Property.CHECK_HOLDING_ENABLE, 'property': value};
			let headers = {'Content-Type': 'application/json', 'Authorization': rootState.token };
			const response = await post('/api/v1/setting/check/holding/enable', headers, request, rootState);
            if(response.data == "ok") {
                this.dispatch("getCheckHoldingEnableProperty");
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
        },
        async getBlockTime({commit, rootState}) {
            const response = await get('/api/v1/setting/block/time', rootState);
			commit('setBlockTime', response);
        },
    }
}