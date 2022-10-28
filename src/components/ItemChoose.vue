<template>
    <Dialog header="Подбор номенклатуры" class="border" v-model:visible="displayDialog" :modal="true" :closable="false"
      :contentStyle="{height: '100%'}" :style="{width: '90%', height: '900px'}" @keyup.enter="addItemsToDoc"> 
        <template #header>

        </template>
        <div class="container">
            <DataTable :value="items" class="p-datatable-sm" v-model:selection="selectedItem" selectionMode="single" 
                        v-model:filters="filters" filterDisplay="menu" :globalFilterFields="['name']"
                        @rowSelect="onItemSelect" :scrollable="true" scrollHeight="420px" :rowHover="true"> 
                        <!-- responsiveLayout="scroll"> -->
                <template #loading>
                <div class="flex justify-content-center">
                    <i class="pi pi-spin pi-spinner" style="font-size: 2rem">
                </i></div>
                </template>
                <Column field="name" header="Наименование" sortable />
                <Column field="unit" header="Еденица" sortable />
                <Column v-for="storage of storages" :header="storage.name" :key="storage.id" style="max-width:7rem" >
                <template #body="{data}">
                    <div :class="boldClass(currentStorage, storage)"> {{getItemRestOnStorage(data, storage)}} </div>
                </template>
                </Column>
                <Column field="price" header="цена" sortable  style="max-width:7rem" />
            </DataTable>

            <Divider v-if="multiplySelect" align="left">
                <div class="inline-flex align-items-center">
                    <i class="pi pi-copy mr-2"></i>
                </div>
            </Divider> 
            
            <div class="formgrid grid form" :style="{height: '200px'}">
                <div class="col-12 md:col-3">
                    <InputText id="filterInput" class="p-inputtext-sm mr-2" v-model="filters['global'].value" placeholder="поиск" autofocus />
                    <Button icon="pi pi-times" class="p-button-rounded p-button-text p-button-plain p-button-sm" @click="clearFilter"/>
                </div>
                <div class="col-12 md:col-9">
                    <DataTable v-if="multiplySelect" :value="chosenItems" class="p-datatable-sm" @rowSelect="onItemSelect"
                        :scrollable="true" scrollHeight="200px" :style="{width: '100%', height: '200px'}">
                        <Column field="item_name" header="Наименование" />
                        <Column field="quantity" header="Количество"  style="max-width:7rem" />
                        <Column field="price" header="цена"  style="max-width:7rem" />
                    </DataTable>
                </div>
            </div>
        </div>
        <template #footer>
            <Button label="закрыть" icon="pi pi-times" @click="closeDialog" class="p-button-text p-button-sm" />
            <Button v-if="multiplySelect" label="ОК" @click="addItemsToDoc" class="p-button-secondary p-button-rounded p-button-sm" />
        </template>
    </Dialog>

    <Dialog header="Ввод колличества" v-model:visible="displayQuantityDialog" :modal="true" :closable="false" 
            :style="{width: '350px', height: '208px'}"> 
        <InputNumber inputId="minmaxfraction" v-model="newQuantity" mode="decimal" @keyup.enter="addItemAndQuantity"
                :minFractionDigits="3" :maxFractionDigits="3" :useGrouping="false" autofocus />
        <template #footer>
        <Button label="закрыть" icon="pi pi-times" @click="closeQuantityDialog" class="p-button-text p-button-sm" />
        <Button label="ОК" @click="addItemAndQuantity" class="p-button-secondary p-button-rounded p-button-sm" />
        </template>
    </Dialog>

</template>

<script>
import Dialog from 'primevue/dialog'; 
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import {FilterMatchMode, FilterOperator} from 'primevue/api';
import DocItem from "@/js/model/DocItem";
export default {
    name: 'ItemChoose',
    components: {
        Dialog,
        InputText,
        InputNumber,
        DataTable,
        Column,
        Button,
        Divider
    },
    data() {
        return {
            filters: null,
            selectedItem: null,
            itemSelectType: String,
            displayDialog: false,
            chosenItems: [],
            displayQuantityDialog: false,
            newItem: DocItem,
            newQuantity: 0,
            filterInput: null
        }
    }, 
    props: {
        multiplySelect: Boolean,
        currentStorage: null,
        dateTime: null,
        displayItems: Number
    },
    emits: {
        newItemList:  null
    },
    watch: {
        displayItems() {
            this.displayDialog = true;
        }
    },
    computed: {
        items() {
            return this.$store.state.is.items;
        },
        storages() {
            return this.$store.state.cs.storages
        },
    },
    mounted() {
        this.initFilters();
    },
    methods: {
        boldClass(currentStorage, storage) { 
            if(currentStorage.id == storage.id) {
                return 'b';
            }
        },
        getItemRestOnStorage(item, storage) {
            for(let rest of item.rest_list) {
                if(rest.storage.id == storage.id) {
                return rest.quantity;
                }
            }
        },
        clearFilter() {
            this.initFilters();
        },
        initFilters() {
            this.filters = {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
                'name': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]}
            }
        },
        closeDialog() {
            this.clearFilter();
            this.displayDialog = false;
        },
        closeQuantityDialog() {
            this.displayQuantityDialog = false;
        },
        onItemSelect(event) {
            this.newItem = new DocItem(event.data.id, event.data.name, 0.0, event.data.price, 0, 0, event.data.is_composite);
            if(this.multiplySelect) {
                this.displayQuantityDialog = true;
            } else {
                this.$emit('newItemList', Array.of(this.newItem));
                this.displayDialog = false;
            }
        },
        addItemAndQuantity() {
            let currentItem = this.chosenItems.filter(item => item.item_id == this.newItem.item_id).pop();
            if(currentItem != undefined) {
                currentItem.quantity = this.newQuantity;
                currentItem.amount = this.formatPrice(currentItem.quantity * currentItem.price);
            } else {
                this.newItem.quantity = this.newQuantity;
                this.newItem.amount = this.formatPrice(this.newItem.quantity * this.newItem.price);
                this.chosenItems.push(this.newItem);
            }
            this.displayQuantityDialog = false;
            this.newQuantity = 0;
            this.focusOnOkButton();
        },
        focusOnOkButton() {
            const filterInput = document.getElementById("filterInput")
            filterInput.focus();
        },
        addItemsToDoc() {
            if(this.chosenItems.length > 0) {
                this.$emit('newItemList', this.chosenItems);
            }
            this.displayDialog = false;
            this.chosenItems = [];
        },
        formatPrice(value) {
            return value.toFixed(2);
        },
    }
}

</script>

<style scoped>
  .b {
    font-weight: bold;
  }
  .container {
    display: flex;
    flex-direction: column;
  }
</style>

