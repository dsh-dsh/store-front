import { createStore } from 'vuex';
import { router } from './Routes';

const host = "http://localhost:8081";

  async function get(url, context) {
    return fetch(host + url, {
      method: 'GET',
      headers: {'Authorization': context.state.token}
    })
	.then(res => handleGetResponce(res, context))
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

async function del(url, headers, body ) {
	return fetch(host + url, {
		method: 'DELETE',
		headers: headers,
		body: JSON.stringify(body)
	})
	.then(res => res.json())
	.then(data => data.data);

	}

  function handleGetResponce(response, context) {
	let res = response.json();
	if (res.error) {
		context.state.toast?.add({severity:'error', summary: 'error', detail: res.error, life: 3000});
	} else {
		context.state.toast?.add({severity:'info', summary: 'Info Message', detail: 'Message Content', life: 1000});
	}
	return res;
  }

//   function handlePostResponce(response, context) {
// 	context.state.toast?.add({severity:'info', summary: 'Info Message', detail:'Message Content', life: 3000});
// 	return response;
//   }

function setLidingNull(val) {
	if(val < 10) {
		return "0" + val;
	} else {
		return val;
	}
  }

function formateDate(date) {
	return setLidingNull(date.getMonth()+1 + "." + date.getDate()) + "." + date.getFullYear() + " " 
	+ setLidingNull(date.getHours()) + ":" + setLidingNull(date.getMinutes()) + ":" + setLidingNull(date.getSeconds());
}

class Document {
	id = 0;
    number = 0;
    date_time = "";
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
	constructor(docType, dateTime){
		this.doc_type = docType;
		this.date_time = dateTime;
		if(docType === "Чек ККМ") {
			this.check_info = {
				"waiter": "",
				"check_number": 0,
				"cash_register_number": 0,
				"amount_received": 0.0,
				"guest_number": 0,
				"table_number": 0,
				"date_time": dateTime,
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

class Item {
    id = 0;
    name = '';
    workshop =  {name: '---', code: 'NONE'};
    unit =  {name: '---', code: 'NONE'};
    number = 0;
    prices = [];
    sets = [];
    ingredients = [];
    print_name = '';
    reg_time = '';
    is_weight = false;
    is_in_employee_menu = false;
    is_alcohol = false;
    is_not_in_price_list = false;
    is_garnish = false;
    is_include_garnish = false;
    is_sauce = false;
    is_include_sauce = false;
    parent_id = 0;
    constructor(time){
        this.reg_time = time;
    }
}
class Ingredient {
    id = 0;
    name = "";
	childId = 0;
	parentId = 0;
    netto = 0;
    gross = 0;
    enable = true;
    constructor(id, name, childId, parentId, netto, gross, enable) {
      this.id = id;
      this.name = name;
      this.childId = childId;
      this.parentId = parentId;
      this.netto = netto;
      this.gross = gross;
      this.enable = enable;
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
			itemRest: 0,
			parentNode: null,
			itemDate: new Date(),
			ingredients: []
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
		setIngredients(state, res) {
			state.ingredients = res;
		},
		addIngredient(state, item) {
			console.log("store ", item)
			state.ingredients.push(new Ingredient(item.id, item.name, 0.0, 0.0, 1));
		},
		setItems (state, res) {
			state.items = res;
		},
		setSuccess (state) {
			state.success++;
		},
		setItemRest (state, res) {
			state.itemRest = res
		},
		saveParentNode (state, res) {
			state.parentNode = res
		},
		setDate(state, res) {
			state.itemDate = res;
		}
    },

    actions: { 
		aaa(context) {
			console.log(context.state.ingredients)
		},
		setDate(context, date) {
			context.commit('setDate', date);
		},
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
			const response = await get('/api/v1/catalogs/units', context);
			context.commit('setUnits', response)
		},
		async getStorages(context) {
			const response = await get('/api/v1/catalogs/storages', context)
			context.commit('setStorages', response)
		},
		async getDocuments(context, filter) {
			filter = filter !== "" ? "?filter=" + filter : "";
			const response = await get('/api/v1/docs/list' + filter, context);
			for (let i = 0; i < response.length; i++) {
				response[i].date_time = new Date(response[i].date_time);
			}
			context.commit('setDocuments', response);
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
				document = new Document(docType, new Date());
			} else {
				document = await get('/api/v1/docs?id=' + id, context)
			}
			document.date_time = new Date(document.date_time);
			if(document.check_info) {
				document.check_info.date_time = new Date(document.check_info.date_time);
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
			let item;
			if(itemId != 0) {
				item = await get('/api/v1/items' + '?date=' + context.state.itemDate.getTime() + '&id=' + itemId, context);
			} else {
				item = new Item(new Date());
			}
			this.dispatch('getIngredients', item.ingredients);
			context.commit('setItem', item)
		},
		getIngredients(context, ingredientObject) {
			let ingredients = []
			if (ingredientObject) {
				ingredientObject.forEach(element => {
					let gross, netto, enable;
					for(let quantity of element.quantity_list) {
						if(quantity.type == 'GROSS') gross = quantity; 
						if(quantity.type == 'NET') netto = quantity; 
						if(quantity.type == 'ENABLE') enable = quantity;
						// if(quantity.type == 'ENABLE') enable = quantity.quantity == 1.0? true : false;
					}
					ingredients.push(new Ingredient(element.id, element.child.name, element.child.id, element.parent.id, netto, gross, enable));
				});
			}
			context.commit('setIngredients', ingredients);
		},
		addIngredient(context, item) {
			console.log(item)
			context.commit('addIngredient', item);
		},
		async saveItem(context, [item, date]) {
			let headers = {'Content-Type': 'application/json', 'Authorization': context.state.token };
			let response;
			if(item.id == 0) {
				item.reg_time = date.getTime();				
				response = await post('/api/v1/items', headers, item);
			} else {
				response = await put('/api/v1/items/' + date.getTime(), headers, item);
			}
			if(response == 'ok') { 
				context.commit('setSuccess'); 
			}
			context.commit('setItem', new Item());
		},
		async getItems(context) {
			const response = await get('/api/v1/items/list', context)
			context.commit('setItems', response)
		},
		async updateDocument(context, doc) {
			doc.date_time = doc.date_time.getTime();
			if(doc.check_info) {
				doc.check_info.date_time = doc.check_info.date_time.getTime();
			}
			let request = {'item_doc_dto': doc};
			let headers = {'Content-Type': 'application/json', 'Authorization': context.state.token };
			const response = await put('/api/v1/docs', headers, request);
			if(response == 'ok') { context.commit('setSuccess'); }
		},
		async addDocument(context, doc) {
			doc.date_time = doc.date_time.getTime();
			if(doc.check_info) {
				doc.check_info.date_time = doc.check_info.date_time.getTime();
			}
			let request = {'item_doc_dto': doc};
			let headers = {'Content-Type': 'application/json', 'Authorization': context.state.token };
			const response = await post('/api/v1/docs', headers, request);
			if(response == 'ok') { context.commit('setSuccess'); }
		},
		async deleteDocument(context, doc) {
			doc.date_time = doc.date_time.getTime();
			let request = {'item_doc_dto': doc};
			let headers = {'Content-Type': 'application/json', 'Authorization': context.state.token};
			const response = await del('/api/v1/docs', headers, request);
			if(response == 'ok') { context.commit('setSuccess'); }
		},
		async getRestOnDateAndStorage(context, [docTime, storageId]) {
			const response = await get('/api/v1/rest/inventory?time=' + formateDate(docTime) + "&storageId=" + storageId , context);
			console.log(response);
			context.commit('setItemRest', response)
		},
		async holdDocument(context, docId) {
			let headers = {'Authorization': context.state.token };
			const response = await post('/api/v1/docs/hold/' + docId, headers);
			if(response == 'ok') { context.commit('setSuccess'); }
		},
		setParentNode(context, parentNode) {
			context.commit('saveParentNode', parentNode);
		}
    }
})

// id = 0;
//     name = "";
// 	childId = 0;
// 	parentId = 0;
//     netto = 0;
//     gross = 0;
//     enable = true;

// function getIngredients(arr) {
// 	let ingrArr;
// 	for(let i = 0; i < arr.length; i++) {
// 		let parent = new itemDTO(arr[i].parentId, '');
// 		let child = new itemDTO(arr[i].childId, arr[i].name);
// 		let dto = new IngredientDTO(arr[i].id, parent, child, false);
// 		dto.quantity_list = [arr[i].netto, arr[i].gross, arr[i].enable];
// 		ingrArr[i] = dto;
// 	}
// 	return ingrArr;
// }

// function addIngredient(arr) {
// 	let ingrArr;
// 	for(let i = 0; i < arr.length; i++) {
// 		let parent = new itemDTO(arr[i].parentId, '');
// 		let child = new itemDTO(arr[i].childId, arr[i].name);
// 		let dto = new IngredientDTO(arr[i].id, parent, child, false);
// 		dto.quantity_list = [arr[i].netto, arr[i].gross, arr[i].enable];
// 		ingrArr[i] = dto;
// 	}
// 	return ingrArr;
// }

// class itemDTO {
// 	id = 0;
// 	name = "";
// 	constructor(id, name) {
// 		this.id = id;
// 		this.name = name;
// 	}
// }

// class QuantityDTO {
// 	id = 0;
// 	date = "";
// 	quantity = 0.0;
// 	type = "";
// 	constructor(id, date, quantity, type) {
// 		this.id = id;
// 		this.date = date;
// 		this.quantity = quantity;
// 		this.type = type;
// 	}
// }

// class IngredientDTO {
// 	id = 0;
// 	parent = null;
// 	child = null;
// 	quantity_list = [];
// 	is_deleted = false;
// 	constructor(id, parent, child, is_deleted) {
// 		this.id = id;
// 		this.parent = parent;
// 		this.child = child;
// 		this.is_deleted = is_deleted;
// 	}
// }


export { Store }
