/* eslint-disable */
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