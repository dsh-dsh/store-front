import {createStore} from 'vuex';
import {router} from '../Routes';
import {post} from "@/js/common"
import {DocStore} from "@/js/stores/DocStore"
import {ItemStore} from "@/js/stores/ItemStore"
import {CatalogStore} from "@/js/stores/CatalogStore"
import {WebSocketStore} from "@/js/stores/WebSocketStore"
import {SettingStore} from "@/js/stores/SettingStore"
import {UserStore} from "@/js/stores/UserStore"
import {CompanyStore} from "@/js/stores/CompanyStore"


const store = createStore({

	modules: {
		ds: DocStore,
		is: ItemStore,
		cs: CatalogStore,
		ws: WebSocketStore,
		ss: SettingStore,
		us: UserStore,
		fs: CompanyStore
	},

    state () {
		return {
			user: null,
			success: 0,
			message: String,
			toast: null,
			token: "",
		}
    },
    mutations: {
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
		setSuccess (state) {
			state.success++;
		},
    },

    actions: { 
		async login(context, body) {
			let headers = {'Content-Type': 'application/json' }
			const response = await post('/api/v1/auth/login', headers, body, context.state)
			context.commit('setUser', response)
			this.dispatch('getInitialData')
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
		getInitialData(context) {
			this.dispatch('getToken')
			if(context.state.token != "") {
				this.dispatch('installToast')
				this.dispatch('getWorkShops')
				this.dispatch('getUnits')
				this.dispatch('getProjects')
				this.dispatch('getStorages')
				this.dispatch('getUsers')
				this.dispatch('getCompanies')
				this.dispatch('getDocTypes')
				this.dispatch('getDefaultProperties')
				this.dispatch('getPeriod')
				this.dispatch('setDates')
				this.dispatch('getItemDirList')
			}
		}
    }
})

export { store }
