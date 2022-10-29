<template>
    <!-- <MainMenu /> -->
    <div style="height: 100%">
    <DataTable :value="products" editMode="cell" 
            @cell-edit-complete="onCellEditComplete" class="editable-cells-table"
            filterDisplay="row" v-model:filters="filters"  
            :scrollable="true" scrollHeight="900px">
        <Column field="code" header="code" key="code" style="width:25%" sortable>
            <!-- <template #filter="{filterModel,filterCallback}">
                <InputText type="text" v-model="filterModel.value" @input="filterCallback()" class="p-column-filter" v-tooltip.top.focus="toltip"/>
            </template> -->
            <template #editor="{ data, field }">
                <InputText v-model="data[field]" autofocus />
            </template>
        </Column>
        <Column field="name" header="name" key="name" style="width:25%" sortable filter>
            <template #filter="{filterModel, filterCallback}">
                <InputText type="text" v-model="filterModel.value" @input="filterCallback()" class="p-column-filter" v-tooltip.top.focus="toltip"/>
            <!-- <MultiSelect v-model="filterModel.value" :options="names" optionLabel="name" @change="filterCallback()" placeholder="Any" class="p-column-filter">
                <template #option="slotProps">
                    <div class="p-multiselect-representative-option">
                        <img :alt="slotProps.option.name" width="15" style="vertical-align: middle" />
                        <span class="image-text">{{slotProps.option.name}}</span>
                    </div>
                </template>
            </MultiSelect> -->
            </template>
            <!-- <template #editor="{ data, field }">
                <InputText v-model="data[field]" autofocus />
            </template> -->
        </Column>
        <Column field="quantity" header="quantity" key="quantity" style="width:25%" sortable filter>
            <template #filter="{filterModel,filterCallback}">
                <InputText type="text" v-model="filterModel.value" @input="filterCallback()" class="p-column-filter" v-tooltip.top.focus="toltip"/>
            </template>
            <template #editor="{ data, field }">
                <InputText v-model="data[field]" autofocus />
            </template>
        </Column>
        <Column field="price" header="price" key="price" style="width:25%" sortable filter>
            <template #filter="{filterModel,filterCallback}">
                <InputText type="text" v-model="filterModel.value" @input="filterCallback()" class="p-column-filter" v-tooltip.top.focus="toltip"/>
            </template>
            <template #editor="{ data, field }">
                <InputText v-model="data[field]" autofocus />
            </template>
        </Column>
    </DataTable>
    </div>
</template>

<script>
// import MainMenu from '@/components/MainMenu.vue'
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
// import MultiSelect from 'primevue/multiselect';
import {FilterMatchMode} from 'primevue/api';
export default {
    name: 'App',
    components: {
        // MainMenu,
        InputText,
        DataTable,
        Column,
        // MultiSelect
    },
    data() {
        return {
            toltip: 'Начните набирать текст для поиска',
            products: null,
            columns: [],
            names: null,
            filters: {
                'code': {value: null, matchMode: FilterMatchMode.STARTS_WITH},
                'name': {value: null, matchMode: FilterMatchMode.STARTS_WITH},
                'quantity': {value: null, matchMode: FilterMatchMode.STARTS_WITH},
                'price': {value: null, matchMode: FilterMatchMode.STARTS_WITH}
            }
        }
    },
    computed: {
        token() {
            return this.$store.state.token;
        }
    },
    watch: {
    },
    created() {
        this.columns = [
            {field: 'code', header: 'Code'},
            {field: 'name', header: 'Name'},
            {field: 'quantity', header: 'Quantity'},
            {field: 'price', header: 'Price'}
        ];
        this.products = [
            {code: 1, name: 'bbb', quantity: 1, price: 10},
            {code: 5, name: 'ccc', quantity: 2, price: 20},
            {code: 6, name: 'ccc', quantity: 3, price: 30},
            {code: 7, name: 'bbb', quantity: 4, price: 40},
            {code: 8, name: 'eee', quantity: 5, price: 50},
            {code: 1, name: 'bbb', quantity: 1, price: 10},
            {code: 5, name: 'ccc', quantity: 2, price: 20},
            {code: 6, name: 'ccc', quantity: 3, price: 30},
            {code: 7, name: 'bbb', quantity: 4, price: 40},
            {code: 8, name: 'eee', quantity: 5, price: 50},
            {code: 1, name: 'bbb', quantity: 1, price: 10},
            {code: 5, name: 'ccc', quantity: 2, price: 20},
            {code: 6, name: 'ccc', quantity: 3, price: 30},
            {code: 7, name: 'bbb', quantity: 4, price: 40},
            {code: 8, name: 'eee', quantity: 5, price: 50},
            {code: 1, name: 'bbb', quantity: 1, price: 10},
            {code: 5, name: 'ccc', quantity: 2, price: 20},
            {code: 6, name: 'ccc', quantity: 3, price: 30},
            {code: 7, name: 'bbb', quantity: 4, price: 40},
            {code: 8, name: 'eee', quantity: 5, price: 50},
        ];
        this.names = [
            {name: 'bbb'}, {name:'ccc'}, {name: 'eee'}];
    },
    mounted() {
    },
    methods: {
        onCellEditComplete(event) {
            let { data, newValue, field } = event;

            switch (field) {
                case 'quantity':
                case 'price':
                    if (this.isPositiveInteger(newValue))
                        data[field] = newValue;
                    else
                        event.preventDefault();
                break;

                default:
                    if (newValue.trim().length > 0)
                        data[field] = newValue;
                    else
                        event.preventDefault();
                break;
            }
        },
    }
}
</script>

<style>
</style>
