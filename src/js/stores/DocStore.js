import Document from "@/js/model/Document"
import {get, post, put, del} from "@/js/common"

export const DocStore = {
    state: () => {
        return {
            document,
			documents: null,
			itemRest: 0,
			startDate: 0,
			endDate: 0
        }
    },
    mutations: {
		setDocuments (state, res) {
			state.documents = res;
		},
		setDocument (state, res) {
			state.document = res;
		},
		setItemRest (state, res) {
			state.itemRest = res
		},
		setDates (state, [start, end]) {
			state.startDate = start;
			state.endDate = end;
		},
		setStartDate(state, date) {
			state.startDate = date;
		},
		setEndDate(state, date) {
			state.endDate = date;
		}
    },
    actions: {
		setDates({commit}) {
			let now = new Date();
			let year = now.getFullYear();
			let month = now.getMonth();
			let day = now.getDate();
			commit('setDates', [new Date(year, month, 1), new Date(year, month, day + 1)]);
		},
		setStartDate({commit}, date) {
			commit('setStartDate', date);
		},
		setEndDate({commit}, date) {
			commit('setEndDate', date);
		},
        async getDocuments({commit, rootState, state}, filter) {
			filter = filter !== "" ? "?filter=" + filter : "";
			let dateFilter = (filter == "" ? "?" : "&") + "start=" + state.startDate.getTime() + "&end=" + state.endDate.getTime();
			const response = await get('/api/v1/docs/list' + filter + dateFilter, rootState);
			for (let i = 0; i < response.length; i++) {
				response[i].date_time = new Date(response[i].date_time);
			}
			commit('setDocuments', response);
        },
		async getDocument({commit, rootState}, [id, docType]) {
			let document = null;
			if(id == 0) {
				document = new Document(docType, new Date());
			} else {
				document = await get('/api/v1/docs?id=' + id, rootState)
			}
			document.date_time = new Date(document.date_time);
			if(document.check_info) {
				document.check_info.date_time = new Date(document.check_info.date_time);
			}
			commit('setDocument', document)
		},
		async updateDocument({commit, rootState}, doc) {
			doc.date_time = doc.date_time.getTime();
			if(doc.check_info) {
				doc.check_info.date_time = doc.check_info.date_time.getTime();
			}
			let request = {'item_doc_dto': doc};
			let headers = {'Content-Type': 'application/json', 'Authorization': rootState.token };
			const response = await put('/api/v1/docs', headers, request, rootState);
			if(response == 'ok') { commit('setSuccess'); }
		},
		async addDocument({commit, rootState}, doc) {
			doc.date_time = doc.date_time.getTime();
			if(doc.check_info) {
				doc.check_info.date_time = doc.check_info.date_time.getTime();
			}
			let request = {'item_doc_dto': doc};
			let headers = {'Content-Type': 'application/json', 'Authorization': rootState.token };
			const response = await post('/api/v1/docs', headers, request, rootState);
			if(response == 'ok') { commit('setSuccess'); }
		},
		async deleteDocument({commit, rootState}, doc) {
			doc.date_time = doc.date_time.getTime();
			let request = {'item_doc_dto': doc};
			let headers = {'Content-Type': 'application/json', 'Authorization': rootState.token};
			const response = await del('/api/v1/docs', headers, request, rootState);
			if(response == 'ok') { commit('setSuccess'); }
		},
		async holdDocument({commit, rootState}, docId) {
			let headers = {'Authorization': rootState.token };
			const response = await post('/api/v1/docs/hold/' + docId, headers, rootState);
			if(response == 'ok') { commit('setSuccess'); }
		},
		async getRestOnDateAndStorage({commit, rootState}, [docId, docTime, storageId]) {
			let url = '/api/v1/rest/inventory?docId=' + docId + '&time=' + docTime.getTime() + "&storageId=" + storageId;
			const response = await get(url , rootState);
			commit('setItemRest', response)
		},
        
    }
}

