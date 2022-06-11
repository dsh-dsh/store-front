import { createStore } from 'vuex';
import { router } from './Routes';

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

  async function put(url, headers, body ) {
	return fetch(host + url, {
		method: 'PUT',
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
	context.state.toast?.add({severity:'info', summary: 'Info Message', detail:'Message Content', life: 1000});
	return response;
  }

//   function handlePostResponce(response, context) {
// 	context.state.toast?.add({severity:'info', summary: 'Info Message', detail:'Message Content', life: 3000});
// 	return response;
//   }
class Document {
	id = 0;
    number = 0;
    time = "08.06.2022 18:51:54";
	amount = 0.0;
	tax = 0.0;
	doc_type = "";
	is_payed = true;
	is_hold = false;
	is_delivery = false;
    project = {
			"id": 0,
			"name": ""
		};
    author = {
			"id": 0,
			"email": "",
			"name": ""
		};
	individual = {
			"id": 0,
			"email": "",
			"name": ""
		};
	supplier = {
		"id": 0,
		"name": "",
		"inn": 0,
		"kpp": 0,
		"accounts": [],
		"is_mine": false
		};
	recipient = {
		"id": 0,
		"inn": 0,
		"kpp": 0,
		"is_mine": false
		};
	storage_from = {
		"id": 0,
		"name": "",
		"type": ""
		};
	storage_to = {
		"id": 0
		};
        base_document_id = 0;	
	constructor(docType, time){
		this.doc_type = docType;
		this.time = time;
		if(docType === "Чек ККМ") {
			this.check_info = {
				"waiter": "",
				"check_number": 0,
				"cash_register_number": 0,
				"amount_received": 0.0,
				"guest_number": 0,
				"table_number": 0,
				"date_time": time,
				"is_return": false,
				"is_KKM_checked": false,
				"is_payed": false,
				"is_payed_by_card": false,
				"is_delivery": false
				};
		}
		if(docType != "РКО"  && docType != "ПКО") {
			this.doc_items = [
				{
					"quantity": 0.0,
					"price": 0.0,
					"discount": 0.0,
					"document_id": 0,
					"item_id": 0,
					"item_name": "",
					"quantity_fact": 0.0
				}];
		}
	}
}

const Store = createStore({

    state () {
		return {
			document,
			documents: null,
			docTypes: [],
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
			companies: [],
			success: 0,
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
		setSuccess (state) {
			state.success++;
		},
    },

    actions: { 
		async getDocTypes(context) {
			const response = await get('/api/v1/catalogs/document/types', context)
			context.commit('setDocTypes', response)
		},
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
		async getDocument(context, [id, docType]) {
			let document = null;
			if(id == 0) {
				console.log(docType)
				document = new Document(docType, "08.06.2022 18:51:54");
				console.log(document);
			} else {
				document = await get('/api/v1/docs?id=' + id, context)
			}
			context.commit('setDocument', document)
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
			context.state.toast?.add({severity:'error', summary: 'Info Message', detail: message, life: 1000})
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
			let request = {'item_doc_dto': body};
			let headers = {'Content-Type': 'application/json', 'Authorization': context.state.token };
			const response = await put('/api/v1/docs', headers, request);
			if(response == 'ok') { context.commit('setSuccess'); }
		},
		async addDocument(context, body) {
			let request = {'item_doc_dto': body};
			let headers = {'Content-Type': 'application/json', 'Authorization': context.state.token };
			const response = await post('/api/v1/docs', headers, request);
			if(response == 'ok') { context.commit('setSuccess'); }
		},
    }
})

export { Store }
