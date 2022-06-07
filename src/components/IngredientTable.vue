<template>
    <div class="ingrHeader">
      <div>Ингредиенты</div>
      <div><Button icon="pi pi-plus" @click="addNewIngredient" class="p-button-text p-button-rounded" /></div>
    </div>
    <div class="border contentRight">
      <DataTable :value="this.ingredients" class="p-datatable-sm">
        <Column field="name" header="Наименование"></Column>
        <Column field="netto" header="Нетто"></Column>
        <Column field="gross" header="Брутто"></Column>
      </DataTable>
    </div>
</template>

<script>
import IngredientService from '../services/IngredientService';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
export default {
  name: 'IngredientTable',
  components: {
    DataTable, Column, Button
  },
  props: {
    ingrObject: Object
  },
  ingredientService: null,
  data() {
    return {
      ingredients: null
    };
  },
  created() {
    this.ingredientService = new IngredientService();
  },
  watch: {
    ingrObject: function(val) {
      this.ingredients = this.ingredientService.getIngredients(val)
    }
  },
  methods: {
    addNewIngredient() {
      this.ingredients = this.ingredientService.addIngredient(this.ingredients);
    }
  }
}
</script>

<style scoped>
  .ingrHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 5px;
  }
</style>