<template>
    <div class="ingrHeader">
      <div>Ингредиенты</div>
      <div><Button icon="pi pi-plus" @click="addNewIngredient" class="p-button-text p-button-rounded" /></div>
    </div>
    <div class="border contentRight">
      <DataTable :value="this.ingredients" editMode="cell" @cell-edit-complete="onCellEditComplete" class="p-datatable-sm editable-cells-table">
        <Column style="width: 2.2rem">
          <template #body="{data}">
            <img @click="onIngredientClick(data)" src="../../dist/img/ii.png" />
          </template>
        </Column>
        <Column field="name" header="Наименование"></Column>
        <Column field="gross" header="Брутто">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" />
          </template>
        </Column>
        <Column field="netto" header="Нетто">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" />
          </template>
        </Column>
        <Column style="width:3rem">
          <template #body="{data}">
            <img v-if="data.is_deleted" @click="toogleDeleted(data)" src="../../dist/img/x.png" />
            <img v-else @click="toogleDeleted(data)" src="../../dist/img/v.png" />
          </template>
          <!-- <template #body="{data}">
            <Button icon="pi pi-minus" class="p-button-rounded p-button-secondary p-button-text mr-2" @click="deleteRow(data)" />
          </template> -->
        </Column>
      </DataTable>
    </div>
    <OverlayPanel ref="opItems">
      <DataTable :value="items" v-model:selection="selectedItem" selectionMode="single" 
          :paginator="true" :rows="5" @rowSelect="onItemSelect" responsiveLayout="scroll" >
          <Column field="name" header="Name" sortable />
      </DataTable>
    </OverlayPanel>
</template>

<script>
import 'primeicons/primeicons.css';
import IngredientService from '../services/IngredientService';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import OverlayPanel from 'primevue/overlaypanel';
import InputText from 'primevue/inputtext';
export default {
  name: 'IngredientTable',
  components: {
    DataTable, Column, Button, OverlayPanel, InputText
  },
  props: {
    ingrObject: Object
  },
  ingredientService: null,
  data() {
    return {
      ingredients: [],
      selectedItem: null,
    };
  },
  computed: {
    items() {
      return this.$store.state.items;
    }
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
    onIngredientClick(ingredient) {
      this.$store.dispatch('getItem', ingredient.id);
    },
    toogleDeleted(ingredient) {
      ingredient.is_deleted = !ingredient.is_deleted;
    },
    addNewIngredient(event) {
      this.$refs.opItems.toggle(event);
    },
    onItemSelect(event) {
      // if(this.itemSelectType == 'update') {
      //   this.updateItem(event.data.id, event.data.name);
      // } else {
      //   this.addItem(event.data.name);
      // }
      this.addItem(event.data);
      this.$refs.opItems.hide();
    },
    // updateItem(item_id, item_name){
    //   this.currentData['item_name'] = item_name;
    //   this.currentData['item_id'] = item_id;
    // },
    addItem(item) {
        this.ingredients.push(new Ingredient(item.id, item.name, 0.0, 0.0, false));
    },
    deleteRow(value) {
      this.ingredients = this.ingredients.filter( currentValue => currentValue != value );
    },
    onCellEditComplete(event) {
      let { data, newValue, field } = event;
      data[field] = newValue;
    },
  }
}

class Ingredient {
    id = 0;
    name = "";
    netto = 0;
    gross = 0;
    is_deleted = false;
    constructor(id, name, netto, gross, deleted) {
      this.id = id;
      this.name = name;
      this.netto = netto;
      this.gross = gross;
      this.deleted = deleted;
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
  .m0 {
    padding: 0.5rem 0.1rem;
  }
</style>