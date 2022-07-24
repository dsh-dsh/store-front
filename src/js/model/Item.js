export class Item {
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
    is_not_in_employee_menu = false;
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

export class Ingredient {
    id = 0;
    name = "";
	child_id = 0;
	parent_id = 0;
    netto = 0;
    gross = 0;
    enable = 0;
    constructor(id, name, childId, parentId, netto, gross, enable) {
      this.id = id;
      this.name = name;
      this.child_id = childId;
      this.parent_id = parentId;
      this.netto = netto;
      this.gross = gross;
      this.enable = enable;
    }
}

export class Quantity {
	id = 0;
	date = 0;
	quantity = 0.0;
	type = "";
	constructor(id, date, quantity, type) {
		this.id = id;
		this.date = date;
		this.quantity = quantity;
		this.type = type;
	}
}