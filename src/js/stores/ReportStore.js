
import {get} from "@/js/common"

export const ReportStore = {
    state: () => {
        return {
            periodReport: null,
        }
    },
    mutations: {
        setPeriodReport(state, res) {
            state.periodReport = res;
        },
    },
    actions: {
        async getPeriodReport({commit, rootState}, [projectId, dateStart, dateEnd]) {
            const response = await get('/api/v1/reports/period?projectId=' + projectId + "&start=" + dateStart + "&end=" + dateEnd, rootState);
			commit('setPeriodReport', response);
        },
    }
}