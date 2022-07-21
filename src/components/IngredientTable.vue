<template>
    <div class="ingrHeader">
      <div>Ингредиенты</div>
      <div><Button icon="pi pi-plus" @click="addNewIngredient" class="p-button-text p-button-rounded" /></div>
    </div>
    <div class="border contentRight">
      
       <!-- v-model:filters="filters" filterDisplay="row"  -->
      <DataTable :value="this.ingredients" editMode="cell" @cell-edit-complete="onCellEditComplete"
       class="p-datatable-sm editable-cells-table">
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
        <!-- field="enable.quantity" dataType="boolean" -->
        <Column  style="width:3rem">
          <template #body="{data}">
            <img v-if="data.enable.quantity == 1.0" @click="toogleDeleted(data)" src="../../dist/img/v.png" />
            <img v-else @click="toogleDeleted(data)" src="../../dist/img/x.png" />
          </template>
          <!-- <template #filter="{filterModel,filterCallback}">
            <TriStateCheckbox v-model="filterModel.value" @change="filterCallback()"/>
          </template> -->
        </Column>
      </DataTable>
    </div>
    <OverlayPanel ref="opItems">
      <DataTable :value="items" v-model:selection="selectedItem" selectionMode="single" 
          :paginator="true" :rows="5" @rowSelect="onItemSelect" responsiveLayout="scroll" >
          <Column field="name" header="Name" sortable />
          <Column v-for="storage of storages" :header="storage.name" :key="storage.id">
            <template #body="{data}">
              <span> {{getItemRestOnStorage(data, storage)}} </span>
            </template>
          </Column>
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
import {FilterMatchMode} from 'primevue/api';
// import TriStateCheckbox from 'primevue/tristatecheckbox';
export default {
  name: 'IngredientTable',
  components: {
    DataTable, 
    Column, 
    Button, 
    OverlayPanel, 
    InputText,
    // TriStateCheckbox
  },
  data() {
    return {
      selectedItem: null,
      filters:[]
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
    },
    storages() {
      return this.$store.state.cs.storages;
    }
  },
  watch: {
  },
  methods: {
    getItemRestOnStorage(item, storage) {
      for(let rest of item.rest_list) {
        if(rest.storage.id == storage.id) {
          return rest.quantity;
        }
      }
    },
    onIngredientClick(ingredient) {
      let item = this.$store.state.is.item;
      let crumb = {label: item.name, id: item.id};
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
    initFilters() {
      this.filters = {
        // 'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
        // 'name': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
        // 'country.name': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
        // 'representative': {value: null, matchMode: FilterMatchMode.IN},
        // 'date': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.DATE_IS}]},
        // 'balance': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.EQUALS}]},
        // 'status': {operator: FilterOperator.OR, constraints: [{value: null, matchMode: FilterMatchMode.EQUALS}]},
        // 'activity': {value: null, matchMode: FilterMatchMode.BETWEEN},
        'enable.quantity': {value: null, matchMode: FilterMatchMode.EQUALS}
      }
    }
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