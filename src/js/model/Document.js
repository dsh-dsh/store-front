export default class Document {
	id = 0;
    number = 0;
    date_time = "";
	amount = 0.0;
	tax = 0.0;
	doc_type = "";
	is_payed = true;
	is_hold = false;
	is_delivery = false;
    project = this.getDefaultProject();
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
			this.doc_items = [];
		}
	}

	getDefaultProject() {
		// console.log(this.$store.state.cs.projects);
		return {
			"id": 0,
			"name": ""
		};
	}

}