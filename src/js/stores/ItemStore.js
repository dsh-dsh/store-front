import {Item, Quantity, Ingredient} from "@/js/model/Item"
import {get, post, put} from "@/js/common"

export const ItemStore = {
    state: () => {
        return {
            itemTree: null,
            item: "",
            parentNode: null,
            itemDate: new Date(),
            ingredients: [],
            crumbs: [],
            expandedKeys: {},
			calculation: null,
			timeOfRest: null,
            items: []
        }
    },
    mutations: {
		setItemTree (state, res) {
			state.itemTree = res;
		},
		setItem (state, res) {
			state.item = res;
		},
		setIngredients(state, res) {
			state.ingredients = res;
		},
		addIngredient(state, ingredient) {
			state.ingredients.push(ingredient);
		},
		saveParentNode (state, res) {
			state.parentNode = res
		},
		setDate(state, res) {
			state.itemDate = res;
		},
		addCrumb(state, crumb) {
			state.crumbs.push(crumb);
		},
		delCrumb(state, crumb) {
			for(var i = state.crumbs.length - 1; i >= 0; i--) {
				if(state.crumbs[i] == crumb) {
					state.crumbs.pop();
					break;
				}
				state.crumbs.pop();
			}
		},
		delCrumbs(state) {
			state.crumbs = [];
		},
		expandKey(state, key) {
			state.expandedKeys[key] = true;
		},
        setCalculation(state, res) {
			state.calculation = res;
		},
		setItems (state, res) {
			state.items = res;
		}
    },
    actions: {
		async getItemTree({rootState, commit}) {
			const response = await get('/api/v1/items/tree', rootState)
			commit('setItemTree', response)
		},
		async getItem({state, rootState, commit}, itemId) {
			let item;
			if(itemId != 0) {
				item = await get('/api/v1/items' + '?date=' + state.itemDate.getTime() + '&id=' + itemId, rootState);
			} else {
				item = new Item(new Date());
			}
			commit('setIngredients', item.ingredients);
			commit('setItem', item)
		},
		addIngredient({state, commit}, item) {
			let date = state.itemDate.getTime()
			let netto = new Quantity(0, date, 0.0, 'NET');
			let gross = new Quantity(0, date, 0.0, 'GROSS');
			let enable = new Quantity(0, date, 1, 'ENABLE');
			let ingredient = new Ingredient(0, item.name, item.id, state.item.id, netto, gross, enable);
			commit('addIngredient', ingredient);
		},
		async saveItem({rootState, commit}, [item, date]) {
			let headers = {'Content-Type': 'application/json', 'Authorization': rootState.token };
			let response;
			if(item.id == 0) {
				item.reg_time = date.getTime();				
				response = await post('/api/v1/items', headers, item, rootState);
			} else {
				response = await put('/api/v1/items/' + date.getTime(), headers, item, rootState);
			}
			if(response == 'ok') { 
				commit('setSuccess'); 
			}
			commit('setItem', new Item());
			commit('setIngredients', []);
		},
		setParentNode({commit}, parentNode) {
			commit('saveParentNode', parentNode);
		},
		expandNodes({state}, itemId) {
			console.log(itemId)
			let node = state.itemTree[0];
            this.dispatch('expandNode', node);
        },
		expandNode({commit}, node) {
            if (node.children && node.children.length) {
				commit('expandKey', node.key);
                for (let child of node.children) {
                    this.dispatch('expandNode', child);
                }
            }
        },
		addCrumb({commit}, crumb) {
			commit('addCrumb', crumb);
		},
		delCrumb({commit}, crumb) {
			commit('delCrumb', crumb);
		},
		delCrumbs({commit}) {
			commit('delCrumbs');
		},
		setDate({commit}, date) {
			commit('setDate', date);
		},
		async getCalculation({state, rootState, commit}, itemId) {
			let calculation = await get('/api/v1/items/calculation' + '?date=' + state.itemDate.getTime() + '&id=' + itemId, rootState);
			commit('setCalculation', calculation);
		},
		async getItems({rootState, commit}, time) {
			if(time.getTime() != this.timeOfRest) {
				this.timeOfRest = time.getTime();
				const response = await get('/api/v1/items/list?time=' + this.timeOfRest, rootState)
				commit('setItems', response)
			}
		},
    }
}
