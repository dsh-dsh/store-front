
import {get} from "@/js/common"

export const ReportStore = {
    state: () => {
        return {
            periodReport: null,
            itemMovesReport: null
        }
    },
    mutations: {
        setPeriodReport(state, res) {
            state.periodReport = res;
        },
        setItemMovesReport(state, res) {
            state.itemMovesReport = res;
        },
    },
    actions: {
        async getPeriodReport({commit, rootState}, [projectId, dateStart, dateEnd]) {
            const response = await get('/api/v1/reports/period?projectId=' + 
                        projectId + "&start=" + dateStart + "&end=" + dateEnd, rootState);
			commit('setPeriodReport', response);
        },
        async getItemMovesReport({commit, rootState}, [storageId, dateStart, dateEnd, includeNull, onlyHolden]) {
            const response = await get('/api/v1/reports/item/moves?storageId=' + 
                        storageId + "&start=" + dateStart + "&end=" + dateEnd + 
                        "&includeNull=" + includeNull + "&onlyHolden=" + onlyHolden, rootState);
			commit('setItemMovesReport', response);
        },

    }
}