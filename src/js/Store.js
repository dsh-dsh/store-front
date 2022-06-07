import { createStore } from 'vuex';
import { router } from './Routes';
// import { config } from '@/utils/config';

const host = "http://localhost:8081";

  async function get(url, context) {
    return fetch(host + url, {
      method: 'GET',
      headers: {'Authorization': context.state.token}
    })
	.then(res => handleGetResponce(res, context))
    .then(res => res.json())
    .then(data => data.data);
  }

async function post(url, headers, body ) {
    return fetch(host + url, {
		method: 'POST',
		headers: headers,
		body: JSON.stringify(body)
    })
    .then(res => res.json())
    .then(data => data.data);

  }

  function handleGetResponce(response, context) {
	// let res = response.json;
	// if (res.error) {
	// 	context.state.toast?.add({severity:'error', summary: 'error', detail: res.error, life: 3000});
	// 	return null;
	// } else {
	// 	return res.data;
	// }
	// console.log(config)
	context.state.toast?.add({severity:'info', summary: 'Info Message', detail:'Message Content', life: 3000});
	return response;
  }

//   function handlePostResponce(response, context) {
// 	context.state.toast?.add({severity:'info', summary: 'Info Message', detail:'Message Content', life: 3000});
// 	return response;
//   }

const Store = createStore({

    state () {
		return {
			document,
			documents: null,
			workshops: [],
			units: [],
			projects: [],
			storages: [],
			message: String,
			toast: null,
			token: String,
			itemTree: null,
			item: "",
			items: [],
			users: [],
			companies: []
		}
    },

    mutations: {
		setWorkShops (state, res) {
			state.workshops = res;
		},
		setUnits (state, res) {
			state.units = res;
		},
		setStorages (state, res) {
			state.storages = res;
		},
		setDocuments (state, res) {
			state.documents = res;
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
		setDocument (state, res) {
			state.document = res;
		},
		setUser (state, res) {
			if(res) {
				localStorage.setItem('user', JSON.stringify(res));
				state.token = res.token;
				router.push("/");
			} else {
				localStorage.removeItem('user');
				router.push("/login");
			}
		},
		getToken (state) {
			let user = JSON.parse(localStorage.getItem('user'))
			state.token = user.token
		}, 
		installToast(state, toast) {
			state.toast = toast;
		},
		setItemTree (state, res) {
			state.itemTree = res;
		},
		setItem (state, res) {
			state.item = res;
		},
		setItems (state, res) {
			state.items = res;
		},
    },

    actions: {
		async getProjects(context) {
			const response = await get('/api/v1/catalogs/projects', context)
			context.commit('setProject', response)
		},
		async getWorkShops(context) {
			const response = await get('/api/v1/catalogs/workshops', context)
			context.commit('setWorkShops', response)
		},
		async getUnits(context) {
			const response = await get('/api/v1/catalogs/units', context)
			context.commit('setUnits', response)
		},
		async getStorages(context) {
			const response = await get('/api/v1/catalogs/storages', context)
			context.commit('setStorages', response)
		},
		async getDocuments(context, filter) {
			filter = filter !== "" ? "?filter=" + filter : ""
			const response = await get('/api/v1/docs/list' + filter, context)
			context.commit('setDocuments', response)
		},
		async getUsers(context) {
			const response = await get('/api/v1/catalogs/users', context)
			context.commit('setUsers', response)
		},
		async getCompanies(context) {
			const response = await get('/api/v1/catalogs/companies', context)
			context.commit('setCompanies', response)
		},
		async getDocument(context, id) {
			const response = await get('/api/v1/docs?id=' + id, context)
			context.commit('setDocument', response)
		},
		async login(context, body) {
			let headers = {'Content-Type': 'application/json' }
			const response = await post('/api/v1/auth/login', headers, body)
			context.commit('setUser', response)
		},
		async logout(context) {
			context.commit('setUser', null)
		},
		async getToken(context) {
			context.commit('getToken')
		}, 
		getMessage(context, message) {
			context.state.toast?.add({severity:'error', summary: 'Info Message', detail: message, life: 3000})
		},
		installToast(context, toast) {
			context.commit('installToast', toast)
		},
		async getItemTree(context) {
			const response = await get('/api/v1/items/tree', context)
			context.commit('setItemTree', response)
		},
		async getItem(context, itemId) {
			const response = await get('/api/v1/items' + '?date=2022-05-05&id=' + itemId, context)
			context.commit('setItem', response)
		},
		async getItems(context) {
			const response = await get('/api/v1/items/list', context)
			context.commit('setItems', response)
		},
		async updateDocument(context, body) {
			let headers = {'Content-Type': 'application/json' }
			const response = await post('/api/v1/auth/login', headers, body)
			context.commit('setUser', response)
		},
    }
})

export { Store }
