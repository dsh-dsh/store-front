
import {get} from "@/js/common"

export const ReportStore = {
    state: () => {
        return {
            periodReport: null,
            itemMovesReport: null,
            salesReport: null,
            paymentsReport: null
        }
    },
    mutations: {
        setPeriodReport(state, res) {
            state.periodReport = res;
        },
        setItemMovesReport(state, res) {
            state.itemMovesReport = res;
        },
        setSalesReport(state, res) {
            state.salesReport = res;
        },
        setPaymentsReport(state, res) {
            state.paymentsReport = res;
        },
    },
    actions: {
        async getPeriodReport({commit, rootState}, [projectId, dateStart, dateEnd]) {
            const response = await get('/api/v1/reports/period?projectId=' + 
                        projectId + "&start=" + dateStart + "&end=" + dateEnd, rootState);
			commit('setPeriodReport', response);
        },
        async getItemMovesReport({commit, rootState}, [itemId, storageId, dateStart, dateEnd, includeNull, onlyHolden]) {
            const response = await get('/api/v1/reports/item/moves?itemId=' + itemId + '&storageId=' + 
                        storageId + "&start=" + dateStart + "&end=" + dateEnd + 
                        "&includeNull=" + includeNull + "&onlyHolden=" + onlyHolden, rootState);
			commit('setItemMovesReport', response);
        },
        async getSalesReport({commit, rootState}, [itemId, projectId, dateStart, dateEnd, includeNull, onlyHolden]) {
            const response = await get('/api/v1/reports/sales?itemId=' + itemId + '&projectId=' + 
                        projectId + "&start=" + dateStart + "&end=" + dateEnd + 
                        "&includeNull=" + includeNull + "&onlyHolden=" + onlyHolden, rootState);
			commit('setSalesReport', response);
        },
        async getPaymentsReport({commit, rootState}, companyId) {
            const response = await get('/api/v1/docs/to/pay?companyId=' + companyId, rootState);
			commit('setPaymentsReport', response);
        },

    }
}