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
      <ColumnGroup type="footer">
        <Row>
          <Column footer="сумма:" colspan="3" footerStyle="text-align:right" />
          <Column :footer="totalAmount" footerStyle="text-align:right" />
        </Row>
      </ColumnGroup>
    </DataTable>
  </div>
</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';     //optional for column grouping
import Row from 'primevue/row'; 
export default {
  name: 'SalesReport',
  components: {
      DataTable,
      Column, 
      ColumnGroup,
      Row
    },
    data() {
      return {
        report: null,
        totalAmount: 0.00
      };
    },
    computed: {
      salesReport() {
        return this.$store.state.rs.salesReport;
      }
    }, 
    watch: {
      salesReport(report) {
        console.log(report)
        this.totalAmount = this.formatCurrency(report.lines.reduce((accumulator, value) => accumulator + value.amount, 0));
      }
    },
    mounted() {
      if(this.salesReport) {
        this.totalAmount = this.formatCurrency(this.salesReport.lines.reduce((accumulator, value) => accumulator + value.amount, 0));
      }
    },
    methods: {
      formatCurrency(value) {
        return value.toLocaleString('re-RU', {style: 'currency', currency: 'RUB'});
      },
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