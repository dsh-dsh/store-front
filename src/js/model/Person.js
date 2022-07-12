export class Person {
    id = 0;
    first_name = "";
    last_name = "";
    email = "";
    phone = "";
    reg_date = "";
    birth_date = "";
    role = "";
    constructor(time){
        this.reg_date = time;
        this.birth_date = time;
    }
}