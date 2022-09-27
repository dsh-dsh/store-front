import {get, post, put} from "@/js/common"
import {Company} from "@/js/model/Company"

export const CompanyStore = {
    state: () => {
        return {
            companyTree: null,
            expandedCompanyKeys: {},
            company: null
        }
    },
    mutations: {
		setCompanyTree (state, res) {
			state.companyTree = res;
		},
		setCompany (state, res) {
			state.company = res;
		}
    },
    actions: {
		async getCompanyTree({rootState, commit}) {
			const response = await get('/api/v1/companies/tree', rootState)
			commit('setCompanyTree', response)
		},
		async getCompany({rootState, commit}, companyId) {
			let company;
			if(companyId != 0) {
				company = await get('/api/v1/companies?id=' + companyId, rootState);
			} else {
				company = new Company();
			}
			commit('setCompany', company)
		},
		async saveCompany({rootState, commit}, company) {
			let headers = {'Content-Type': 'application/json', 'Authorization': rootState.token };
			let response;
			if(company.id == 0) {			
				response = await post('/api/v1/companies', headers, company, rootState);
			} else {
				response = await put('/api/v1/companies', headers, company, rootState);
			}
			if(response == 'ok') { 
				commit('setSuccess'); 
				this.dispatch('getCompanyTree');
			}
			commit('setCompany', new Company());
		},
    }
}