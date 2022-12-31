export default class DocItem {
    document_id = 0;
    item_id = 0;
    item_name = "";
    unit = "";
    quantity = 0.0;
    quantity_fact = 0.0;
    price = 0.0;
    amount = 0.0;
    amount_fact = 0.0;
    discount = 0.0;
    is_composite = false;
    
    constructor(item_id, item_name, unit, quantity, price, quantity_fact = 0, document_id = 0, is_composite = false) {
        this.item_id = item_id;
        this.item_name = item_name;
        this.unit = unit;
        this.quantity = quantity;
        this.price = price;
        this.quantity_fact = quantity_fact;
        this.document_id = document_id;
        this.amount = price * quantity;
        this.amount_fact = price * quantity_fact;
        this.is_composit = is_composite;
    }
}