<template>
  <div class="ingrHeader">
    <div>Ингредиенты</div>
    <div><Button icon="pi pi-plus" @click="addNewIngredient" class="p-button-text p-button-rounded" /></div>
  </div>
  <div>
     <!-- @cell-edit-init="onCellEditInit" -->
    <DataTable :value="this.ingredients" editMode="cell" @cell-edit-complete="onCellEditComplete"
      class="p-datatable-sm editable-cells-table"  responsiveLayout="scroll">
      <Column style="width: 2.2rem">
        <template #body="{data}">
          <img @click="onIngredientClick(data)" src="../../src/assets/img/ii.png" />
        </template>
      </Column>
      <Column field="name" header="Наименование"></Column>
      <Column field="gross.quantity" header="Брутто">
        <template #editor="{ data }">
          <InputNumber v-model="data['gross']['quantity']" :minFractionDigits="3" :maxFractionDigits="3" autofocus />
        </template>
      </Column>
      <Column field="netto.quantity" header="Нетто">
        <template #editor="{ data }">
          <InputNumber v-model="data['netto']['quantity']" :minFractionDigits="3" :maxFractionDigits="3" autofocus />
        </template>
      </Column>
      <Column  style="width:3rem">
        <template #body="{data}">
          <img v-if="data.enable.quantity == 1.0" @click="toogleDeleted(data)" src="../../src/assets/img/v.png" />
          <img v-else @click="toogleDeleted(data)" src="../../src/assets/img/x.png" />
        </template>
      </Column>
      <ColumnGroup type="footer">
        <Row>
          <Column colspan="2" />
          <Column :footer="totalGross" />
          <Column :footer="totalNetto" colspan="2" />
        </Row>
      </ColumnGroup>
    </DataTable>
  </div>
    
  <Dialog header="Подбор номенклатуры" v-model:visible="displayItems" :modal="true" :closable="false"
      :contentStyle="{height: '100%'}" :style="{width: '90%', height: '90%'}"> 
    <template #header>
      <div> 
        <InputText class="p-inputtext-sm mr-2" v-model="filters['global'].value" placeholder="поиск" autofocus />
        <Button icon="pi pi-times" class="p-button-rounded p-button-text p-button-plain p-button-sm" @click="clearFilter"/>
      </div>
    </template>
    <DataTable :value="items" class="p-datatable-sm" v-model:selection="selectedItem" selectionMode="single" 
                v-model:filters="filters" filterDisplay="menu" :globalFilterFields="['name']"
                @rowSelect="onItemSelect" responsiveLayout="scroll" :loading="loading">
        <template #loading>
          <div class="flex justify-content-center">
            <i class="pi pi-spin pi-spinner" style="font-size: 2rem">
          </i></div>
        </template>
        <Column field="name" header="Name" sortable />
    </DataTable>
    <br>
    <template #footer>
      <Button label="закрыть" icon="pi pi-times" @click="closeDialog" class="p-button-text p-button-sm" />
    </template>
  </Dialog>
</template>

<script>
import ColumnGroup from 'primevue/columngroup'; 
import Row from 'primevue/row'; 
import 'primeicons/primeicons.css';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import {FilterMatchMode, FilterOperator} from 'primevue/api';
export default {
  name: 'IngredientTable',
  components: {
    ColumnGroup,
    Row,
    DataTable, 
    Column, 
    Button, 
    Dialog,
    InputText,
    InputNumber
  },
  data() {
    return {
      filters:[],
      selectedItem: null,
      loading: false,
      displayItems: false
    };
  },
  created() {
      this.initFilters();
  },
  mounted() {
    this.$store.dispatch('getItems');
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
    items() {
      this.loading = false;
    }
  },
  methods: {
    totalNetto() {
      // let total = 0;
      // for(let ingredient of this.ingredients) {
      //     total += ingredient.netto.quantity;
      // }
      // console.log(total)
      return this.formatCurrency(2);
    },
    totalGross() {
      // let total = 0;
      // for(let ingredient of this.ingredients) {
      //     total += ingredient.gross.quantity;
      // }
      // console.log(total)
      return this.formatCurrency(1);
    },
    formatCurrency(value) {
      return value.toLocaleString('re-RU', {style: 'currency', currency: 'RUB'});
    },
    initFilters() {
      this.filters = {
        'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
        'name': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]}
      }
    },
    clearFilter() {
      this.initFilters();
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
    addNewIngredient() {
      this.displayItems = true;
    },
    onItemSelect(event) {
      this.displayItems = false;
      this.addItem(event.data);
    },
    addItem(item) {
      this.$store.dispatch('addIngredient', item);
    },
    onCellEditComplete(event) {
      let { data, field } = event;
      let fieldArr = field.split(".");
      let timestamp = atStartOfDay(this.itemDate).getTime();
      if(data[fieldArr[0]].date != timestamp) {
        data[fieldArr[0]].id = 0;
        data[fieldArr[0]].date = timestamp;
      }
    },
    closeDialog() {
      this.displayItems = false;
      this.clearFilter();
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
  .p-dialog, :deep(.p-dialog) {
    height : 500px;
    width : 900px;
  }
</style>