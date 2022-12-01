<template>
<div v-if="salesReport" style="height: calc(100vh - 15rem); max-width: 850px">
    <DataTable :value="salesReport.lines" class="p-datatable-sm" :rowHover="true"
      :scrollable="true" scrollHeight="flex">
      <Column field="name">
        <template #header><div class="text-left">наименование</div></template>
        <template #body="{data}"><div class="text-left">{{ data.name }}</div></template>
      </Column>
      <Column field="unit" style="max-width:5rem" header="единица"></Column>
      <Column field="quantity" style="max-width:9rem" header="количество" 
            class="justify-content-end mr-3" headerClass="justify-content-end mr-2">
        <template #body="{data}">{{ formatWeight(data.quantity) }}</template>
      </Column>
      <Column field="amount" style="max-width:9rem" header="сумма" 
            class="justify-content-end mr-3" headerClass="justify-content-end mr-2">
        <template #body="{data}">{{ formatPrice(data.amount) }}</template>
      </Column>
    </DataTable>
</div>
</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
export default {
  name: 'SalesReport',
  components: {
      DataTable,
      Column, 
    },
    data() {
        return {
            report: null,
        };
    },
    computed: {
        salesReport() {
            return this.$store.state.rs.salesReport;
        }
    }, 
    watch: {
    },
    methods: {
      formatWeight(value) {
        return Number(value).toFixed(3);
      },
      formatPrice(value) {
        return Number(value).toFixed(2);
      },
    },
}
</script>

<style scoped>
</style>