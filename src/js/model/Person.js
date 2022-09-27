export class Person {
    id = 0;
    first_name = "";
    last_name = "";
    email = "";
    phone = "";
    reg_date = "";
    birth_date = "";
    role = "";
    parent_id = 0;
    constructor(time, id = 0, first_name = "", last_name = "", email = "", phone = "", role = "", parent_id = 0){
        this.reg_date = time;
        this.birth_date = time;
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email
        this.phone = phone
        this.role = role;
        this.parent_id = parent_id;
    }
}