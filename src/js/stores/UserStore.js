import {get, post, put} from "@/js/common"
import {Person} from "@/js/model/Person"

export const UserStore = {
    state: () => {
        return {
            userTree: null,
            expandedKeys: {},
            person: null
        }
    },
    mutations: {
		setUserTree (state, res) {
			state.userTree = res;
		},
		setPerson (state, res) {
			state.person = res;
		}
    },
    actions: {
		async getUserTree({rootState, commit}) {
			const response = await get('/api/v1/users/tree', rootState)
			commit('setUserTree', response)
		},
		async getPerson({rootState, commit}, userId) {
			let person;
			if(userId != 0) {
				person = await get('/api/v1/users?id=' + userId, rootState);
				person.birth_date = new Date(person.birth_date);
			} else {
				person = new Person(new Date());
			}
			commit('setPerson', person)
		},
		async savePerson({rootState, commit}, person) {
			let headers = {'Content-Type': 'application/json', 'Authorization': rootState.token };
			let response;
			let dtoPerson = new Person(0, person.id, person.first_name, person.last_name, person.email, person.phone, person.role, person.parent_id);
			dtoPerson.birth_date = person.birth_date.getTime();
			console.log(dtoPerson)
			if(person.id == 0) {			
				response = await post('/api/v1/users', headers, dtoPerson, rootState);
			} else {
				response = await put('/api/v1/users/', headers, dtoPerson, rootState);
			}
			if(response == 'ok') { 
				commit('setSuccess'); 
				this.dispatch('getUserTree');
			}
			commit('setPerson', new Person(new Date()));
		},
    }
}