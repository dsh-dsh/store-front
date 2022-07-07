
import {get} from "@/js/common"

export const SettingStore = {
    state: () => {
        return {
            defaultProperties: []
        }
    },
    mutations: {
        setDefaultProperties(state, res) {
            state.defaultProperties = res;
        }
    },
    actions: {
        async getDefaultProperties({commit, rootState}) {
            let user = JSON.parse(localStorage.getItem('user'));
            const response = await get('/api/v1/setting?userId=' + user.id, rootState);
			commit('setDefaultProperties', response);
        }
    }
}