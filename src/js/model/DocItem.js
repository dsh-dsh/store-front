export default class DocItem {
    document_id = 0;
    item_id = 0;
    item_name = "";
    quantity = 0.0;
    quantity_fact = 0.0;
    price = 0.0;
    amount = 0.0;
    discount = 0.0;
    constructor(item_id, item_name, quantity, price) {
        this.item_id = item_id;
        this.item_name = item_name;
        this.quantity = quantity;
        this.price = price;
    }
}