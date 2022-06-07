export default class IngredientService {

    // ingredients = new Array();

    getIngredients(ingredientObject) {
        if (!ingredientObject) return [];

        const ingredients = []

        ingredientObject.forEach(element => {
            let netto = element.quantity_list[0].quantity;
            let gross = element.quantity_list[1].quantity;
            ingredients.push(new Ingredient(element.child.name, netto, gross, false));
        });

        return ingredients;
    }

    addIngredient(ingredients) {
        ingredients.push(new Ingredient("Сахар", 0.250, 0.200, false));
        return ingredients;
    }

}

class Ingredient {
    name = "";
    netto = 0;
    gross = 0;
    deleted = false;
    constructor(name, netto, gross, deleted) {
        this.name = name;
        this.netto = netto;
        this.gross = gross;
        this.deleted = deleted;
    }
}