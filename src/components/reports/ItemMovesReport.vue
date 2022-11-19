<template>
  <div v-if="report" class="border" style="height: calc(100vh - 12rem)">
    <DataTable :value="report" class="p-datatable-sm" :rowHover="true"
      @row-click="expandRow" v-model:expandedRows="expandedRows" 
      :scrollable="true" scrollHeight="flex">
      <Column :expander="true" style="max-width: 3rem" />
      <Column field="name">
        <template #header><div class="text-left">наименование</div></template>
        <template #body="{data}"><div class="text-left">{{ data.name }}</div></template>
      </Column>
      <Column field="startRest" style="max-width:9rem" header="ост. на начало" 
            class="justify-content-end mr-3" headerClass="justify-content-end mr-2">
        <template #body="{data}">{{ formatWeight(data.startRest) }}</template>
      </Column>
      <Column field="receipt" style="max-width:9rem" header="приход" 
            class="justify-content-end mr-3" headerClass="justify-content-end mr-2">
        <template #body="{data}">{{ formatWeight(data.receipt) }}</template>
      </Column>
      <Column field="expense" style="max-width:9rem" header="расход" 
            class="justify-content-end mr-3" headerClass="justify-content-end mr-2">
        <template #body="{data}">{{ formatWeight(data.expense) }}</template>
      </Column>
      <Column field="endRest" style="max-width:9rem" header="ост. на конец" 
            class="justify-content-end mr-3" headerClass="justify-content-end mr-2">
        <template #body="{data}">{{ formatWeight(data.endRest) }}</template>
      </Column>
      <template #expansion="{data}">
        <div v-if="data.docs.length > 0" style="width: 100%">
          <DataTable :value="data.docs" class="p-datatable-sm" @row-click="openDocument" responsiveLayout="scroll">
            <Column field="date" header="дата" style="max-width: 5rem"/>
            <Column field="name" header="документ" />
            <Column field="supplier" header="отправитель" />
            <Column field="storageTo" header="получатель" style="max-width: 9rem" />
            <Column field="quantity" header="количество" style="max-width: 9rem"
                class="justify-content-end mr-2" headerClass="justify-content-end mr-2">
              <template #body="{data}">{{ formatWeight(data.quantity) }}</template>
            </Column>
          </DataTable>
        </div>
      </template>
    </DataTable>
  </div>

  <Dialog v-model:visible="displayDocument" :style="{width: '90%'}" :modal="true"  :showHeader="false">
    <Document :docId="docId" />
    <template #footer>
      <Button label="Закрыть" icon="pi pi-times" @click="closeDocument" class="p-button-secondary p-button-text"/>
    </template>
  </Dialog>

</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import Document from '@/components/Document.vue';
import Button from 'primevue/button';
export default {
  name: 'ItemMovesReport',
  components: {
      DataTable,
      Column, 
      Dialog,
      Document,
      Button
    },
    data() {
        return {
            receiptsAmount: 0,
            salaryAmount: 0,
            spendsAmount: 0,
            expandedRows: [],
            expandedRows1: [],
            report: null,
            displayDocument: false,
            docId: 0
        };
    },
    computed: {
        itemMovesReport() {
            return this.$store.state.rs.itemMovesReport;
        }
    }, 
    watch: {
        itemMovesReport(report) {
          this.report = report.items;
        },
    },
    methods: {
      getAmount(listWithValues) {
          let amount = 0;
          for(let element of listWithValues) {
              amount += element.value;
          }
          return amount;
      },
      formatWeight(value) {
          return Number(value).toFixed(3);
      },
      openDocument(value) {
        this.docId = value.data.id;
        this.displayDocument = true;
      },
      closeDocument() {
        this.displayDocument = false;
        this.$store.dispatch('setCurrentDocumentNull');
      },
      expandRow(value) {
        if(this.expandedRows.find(v => v == value.data)) {
          this.expandedRows = this.expandedRows.filter(v => v != value.data);
          return;
        } else {
          this.expandedRows.push(value.data);
        }
      },
    },
}
</script>

<style scoped>
.content-width {
  width: 100%;
}
.mediun-column {
  max-width: 6rem;
}
.report {
  width: 750px;
  margin-bottom: 7px;
}
.title {
  font-weight: bold;
  font-style: italic;
  margin-bottom: 7px;
}
.bottom-line {
  margin-top: 7px;
  margin-bottom: 7px;
  padding-bottom: 3px;
  border-bottom: 1px solid #a5a5a5;
}
.border {
  border: 1px solid #dee2e6;
  border-radius: 3px;
}
</style>