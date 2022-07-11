
import {get, post} from "@/js/common"

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
        },
        async setProperty ({rootState}, [user, type, value]) {
			let request = {'user': user, 'type': type, 'property': value};
			let headers = {'Content-Type': 'application/json', 'Authorization': rootState.token };
			const response = await post('/api/v1/setting/property', headers, request, rootState);
            if(response.data == "ok") {
                this.dispaatch("getDefaultProperties");
            }
        }
    }
}