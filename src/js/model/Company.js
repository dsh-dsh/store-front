export class Company {
    id = 0;
    name = "";
    inn = "";
    kpp = "";
    is_mine = "";
    
    constructor(id = 0, name = "", inn = "", kpp = "", is_mine = false){
        this.id = id;
        this.name = name;
        this.inn = inn;
        this.kpp = kpp;
        this.is_mine = is_mine;
    }
}