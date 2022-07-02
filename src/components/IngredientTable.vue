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
        <Column field="gross.quantity" header="Брутто">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" />
          </template>
        </Column>
        <Column field="netto.quantity" header="Нетто">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" />
          </template>
        </Column>
        <Column style="width:3rem">
          <template #body="{data}">
            <img v-if="data.enable.quantity == 1.0" @click="toogleDeleted(data)" src="../../dist/img/v.png" />
            <img v-else @click="toogleDeleted(data)" src="../../dist/img/x.png" />
          </template>
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
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import OverlayPanel from 'primevue/overlaypanel';
import InputText from 'primevue/inputtext';
export default {
  name: 'IngredientTable',
  components: {
    DataTable, 
    Column, 
    Button, 
    OverlayPanel, 
    InputText
  },
  data() {
    return {
      selectedItem: null,
    };
  },
  computed: {
    items() {
      return this.$store.state.cs.items;
    },
    ingredients() {
      return this.$store.state.is.ingredients;
    },
    itemDate() {
      return this.$store.state.is.itemDate;
    }
  },
  watch: {
  },
  methods: {
    onIngredientClick(ingredient) {
      let crumb = {label: ingredient.name, to:'/items?date=1655995857192&id=11'};
      this.$store.dispatch('addCrumb', crumb);
      this.$store.dispatch('expandNodes', ingredient.child_id);
      this.$store.dispatch('getItem', ingredient.child_id);
    },
    toogleDeleted(ingredient) {
      ingredient.enable.quantity = ingredient.enable.quantity == 1? 0 : 1;
      let timestamp = atStartOfDay(this.itemDate).getTime();
      if(ingredient.enable.date != timestamp) {
        ingredient.enable.id = 0;
        ingredient.enable.date = timestamp;
      }
    },
    addNewIngredient(event) {
      this.$refs.opItems.toggle(event);
    },
    onItemSelect(event) {
      this.addItem(event.data);
      this.$refs.opItems.hide();
    },
    addItem(item) {
      this.$store.dispatch('addIngredient', item);
    },
    onCellEditComplete(event) {
      let { data, newValue, field } = event;
      let fieldArr = field.split(".");
      data[fieldArr[0]].quantity = newValue;
      let timestamp = atStartOfDay(this.itemDate).getTime();
      if(data[fieldArr[0]].date != timestamp) {
        data[fieldArr[0]].id = 0;
        data[fieldArr[0]].date = timestamp;
      }
    },
  }
}

function atStartOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
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