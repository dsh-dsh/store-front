import {get} from "@/js/common"

export const CatalogStore = {
    state: () => {
            return {
            docTypes: [],
            workshops: [],
            units: [],
            projects: [],
            storages: [],
            users: [],
            items: []
        }
    },
    mutations: {
		setDocTypes (state, res) {
			state.docTypes = res;
		},
		setWorkShops (state, res) {
			state.workshops = res;
		},
		setUnits (state, res) {
			state.units = res;
		},
		setStorages (state, res) {
			state.storages = res;
		},
		setUsers (state, res) {
			state.users = res;
		},
		setCompanies (state, res) {
			state.companies = res;
		},
		setProject (state, res) {
			state.projects = res;
		},
		setItems (state, res) {
			state.items = res;
		}
    },
    actions: {
		async getDocTypes({rootState, commit}) {
			const response = await get('/api/v1/catalogs/document/types', rootState)
			commit('setDocTypes', response)
		},
		async getProjects({rootState, commit}) {
			const response = await get('/api/v1/catalogs/projects', rootState)
			commit('setProject', response)
		},
		async getWorkShops({rootState, commit}) {
			const response = await get('/api/v1/catalogs/workshops', rootState)
			commit('setWorkShops', response)
		},
		async getUnits({rootState, commit}) {
			const response = await get('/api/v1/catalogs/units', rootState);
			commit('setUnits', response)
		},
		async getStorages({rootState, commit}) {
			const response = await get('/api/v1/catalogs/storages', rootState)
			commit('setStorages', response)
		},
		async getUsers({rootState, commit}) {
			const response = await get('/api/v1/catalogs/users', rootState)
			commit('setUsers', response)
		},
		async getCompanies({rootState, commit}) {
			const response = await get('/api/v1/catalogs/companies', rootState)
			commit('setCompanies', response)
		},
    }
}