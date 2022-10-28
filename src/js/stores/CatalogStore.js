import {get} from "@/js/common"

export const CatalogStore = {
    state: () => {
        return {
			companies: [],
            docTypes: [],
            docTypeFilters: [],
            workshops: [],
            units: [],
            projects: [],
            storages: [],
            users: [],
            items: [],
			itemDirList: []
        }
    },
    mutations: {
		setDocTypes (state, res) {
			state.docTypes = res;
			state.docTypeFilters = state.docTypes.map(type => type.name);
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
		},
		setItemDirList (state, res) {
			state.itemDirList = res;
		},
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
		async getItems({rootState, commit}) {
			const response = await get('/api/v1/items/list', rootState)
			commit('setItems', response)
		},
		async getItemDirList({rootState, commit}) {
			const response = await get('/api/v1/items/dirs/list', rootState)
			commit('setItemDirList', response)
		},
    }
}