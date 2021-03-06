import Document from "@/js/model/Document"
import {get, post, put, del} from "@/js/common"
import DocItem from "../model/DocItem";
import {DocumentType} from '@/js/Constants';

function fillRelativeDoc(relativeDoc, inventiryDoc) {
	relativeDoc.author = inventiryDoc.author;
	relativeDoc.project = inventiryDoc.project;
	if(relativeDoc.doc_type == DocumentType.WRITE_OFF_DOC) {
		relativeDoc.storage_from = inventiryDoc.storage_from;
	} else {
		relativeDoc.storage_to = inventiryDoc.storage_from;
	}
	relativeDoc.base_document_id = inventiryDoc.id;
	let k = relativeDoc.doc_type == DocumentType.WRITE_OFF_DOC? -1 : 1; 
	for(let docItem of inventiryDoc.doc_items) {
		let difference = (docItem.quantity_fact - docItem.quantity) * k;
		if(difference > 0) {
			let newDocItem = new DocItem(docItem.item_id, docItem.item_name, difference, docItem.price);
			relativeDoc.doc_items.push(newDocItem);
		}
	}
}

export const DocStore = {
    state: () => {
        return {
            document,
			documents: null,
			itemRest: 0,
			startDate: 0,
			endDate: 0,
			exsistNotHoldenDocs: 0
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
		},
		setRootSuccess(rootState) {
			rootState.success++;
		},
		setExsistNotHoldenDocs(state) {
			state.exsistNotHoldenDocs++;
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
		createRelativeDocks({commit}, doc) {
			let writeOffDocument = new Document('????????????????', doc.date_time);
			fillRelativeDoc(writeOffDocument, doc);
			if(writeOffDocument.doc_items.length > 0) {
				this.dispatch("addDocument", writeOffDocument);
			}
			let receiptDocument = new Document('??????????????????????????', doc.date_time);
			fillRelativeDoc(receiptDocument, doc);
			if(receiptDocument.doc_items.length > 0) {
				this.dispatch("addDocument", receiptDocument);
			}
			commit('setSuccess');
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
			const response = await post('/api/v1/docs/hold/' + docId, headers, null, rootState);
			if(response.type == 1) {
				commit('setExsistNotHoldenDocs');
			}
			if(response.data == 'ok') { commit('setSuccess'); }
		},
		async serialHoldDocument({commit, rootState}, docId) {
			let headers = {'Authorization': rootState.token };
			const response = await post('/api/v1/docs/hold/serial/' + docId, headers, null, rootState);
			if(response.data == 'ok') { commit('setSuccess'); }
		},
		async getRestOnDateAndStorage({commit, rootState}, [docId, docTime, storageId]) {
			let url = '/api/v1/rest/inventory?docId=' + docId + '&time=' + docTime.getTime() + "&storageId=" + storageId;
			const response = await get(url , rootState);
			commit('setItemRest', response)
		},
        
    }
}

