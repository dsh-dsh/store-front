import Document from "@/js/model/Document"
import {get, post, put, del} from "@/js/common"
export const DocStore = {
    state: () => {
        return {
            document,
			documents: null,
			itemRest: 0
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
    },
    actions: {
        async getDocuments({commit, rootState}, filter) {
        filter = filter !== "" ? "?filter=" + filter : "";
        const response = await get('/api/v1/docs/list' + filter, rootState);
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
			const response = await put('/api/v1/docs', headers, request);
			if(response == 'ok') { commit('setSuccess'); }
		},
		async addDocument({commit, rootState}, doc) {
			doc.date_time = doc.date_time.getTime();
			if(doc.check_info) {
				doc.check_info.date_time = doc.check_info.date_time.getTime();
			}
			let request = {'item_doc_dto': doc};
			let headers = {'Content-Type': 'application/json', 'Authorization': rootState.token };
			const response = await post('/api/v1/docs', headers, request);
			if(response == 'ok') { commit('setSuccess'); }
		},
		async deleteDocument({commit, rootState}, doc) {
			doc.date_time = doc.date_time.getTime();
			let request = {'item_doc_dto': doc};
			let headers = {'Content-Type': 'application/json', 'Authorization': rootState.token};
			const response = await del('/api/v1/docs', headers, request);
			if(response == 'ok') { commit('setSuccess'); }
		},
		async holdDocument({commit, rootState}, docId) {
			let headers = {'Authorization': rootState.token };
			const response = await post('/api/v1/docs/hold/' + docId, headers);
			if(response == 'ok') { commit('setSuccess'); }
		},
		async getRestOnDateAndStorage({commit, rootState}, [docId, docTime, storageId]) {
			console.log(docId, docTime, storageId);
			let url = '/api/v1/rest/inventory?docID=' + docId + 'time=' + docTime.getTime() + "&storageId=" + storageId;
			const response = await get(url , rootState);
			commit('setItemRest', response)
		},
        
    }
}

