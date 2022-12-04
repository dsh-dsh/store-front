<template>
  <div v-if="paymentsReport" class="payment-report" style="height: calc(100vh - 15rem); max-width: 850px">
    <br>
    <DataTable :value="paymentsReport" rowGroupMode="subheader" groupRowsBy="supplier"
          sortMode="single" sortField="supplier" :sortOrder="1" responsiveLayout="scroll"
          :expandableRowGroups="true" v-model:expandedRowGroups="expandedRowGroups"
          class="p-datatable-sm" :rowHover="true" 
          :scrollable="true" scrollHeight="flex">
      <Column header="" style="max-width:7rem" />
      <Column header="наименование">
        <template #body="{data}">
          {{getName(data)}}
        </template>
      </Column>
      <Column field="supplier" header="Поставщик" />
      <Column field="amount" style="max-width:7rem" header="сумма" 
            class="justify-content-end mr-3" headerClass="justify-content-end mr-2">
        <template #body="{data}">{{ formatPrice(data.amount) }}</template>
      </Column>
      <Column header="" style="max-width:4rem">
        <template #body="{data}"> 
          <Button :icon="buttonIcon(data.is_payed)" class="p-button-rounded p-button-secondary p-button-outlined mr-2" @click="paymentDoc(data)" />
        </template>
      </Column>

      <template #groupheader="{data}">
        <div style="width: 100%" class="flex justify-content-between">
          <div class="flex align-items-center">{{data.supplier}}</div>
          <div class="flex align-items-center">
            <Button :icon="buttonIcon(isDocsPayed(data.supplier))" class="p-button-rounded p-button-secondary mr-2" @click="addSupplierPayments(data.supplier)" />
          </div>
        </div>
      </template>

      <template #groupfooter="slotProps">
        <td colspan="3" class="justify-content-end b mr-sum">сумма:</td>
        <td class="justify-content-end mr-amount amount b">{{getSupplierAmount(slotProps.data.supplier)}}</td>
      </template>

      <ColumnGroup type="footer">
        <Row>
          <Column footer="общая сумма:" colspan="3" footerStyle="text-align:right" />
          <Column :footer="formatPrice(totalAmount)" footerStyle="text-align:right" />
          <Column footerStyle="width:5rem" />
        </Row>
      </ColumnGroup>

    </DataTable>
  </div>
</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import ColumnGroup from 'primevue/columngroup';     //optional for column grouping
import Row from 'primevue/row'; 
export default {
  name: 'PaymentsReport',
  components: {
      DataTable,
      Column,
      Button,
      ColumnGroup,
      Row
    },
    data() {
      return {
        totalAmount: 0.0,
        expandedRowGroups: null
      };
    },
    computed: {
      paymentsReport() {
        return this.$store.state.rs.paymentsReport;
      }
    }, 
    watch: {
      paymentsReport(report) {
        this.totalAmount = 0.0;
        for(let doc of report) {
          this.totalAmount += doc.amount;
        }
      }
    },
    mounted() {
      if(this.paymentsReport) {
        this.totalAmount = 0.0;
        for(let doc of this.paymentsReport) {
          this.totalAmount += doc.amount;
        }
      }
    },
    methods: {
      getSupplierAmount(suplierName) {
        let amount = 0;
        if(this.paymentsReport) {
          for(let line of this.paymentsReport) {
            if(line.supplier == suplierName) {
              amount += line.amount;
            }
          } 
        }
        return this.formatPrice(amount);
      },
      getName(data) {
        let name = data.doc_type;
        if(data.supplierDocNumber) {
          name += " № " + data.supplierDocNumber;
        } 
        name += " от " + this.formatDate(data.date_time);
        return name;
      },
      formatDate(date) {
        return new Date(date).toLocaleDateString('ru-RU', {day: '2-digit', month: '2-digit', year: 'numeric'})
      },
      formatPrice(value) {
        return Number(value).toFixed(2);
      },
      formatCurrency(value) {
        return value.toLocaleString('re-RU', {style: 'currency', currency: 'RUB'});
      },
      addPayment(value) {
        console.log(value)
      },
      addSupplierPayments(supplierName) {
        if(this.isDocsPayed(supplierName)) return;
        this.$store.dispatch('addSupplierPaymentsDoc', supplierName);
        for(let line of this.paymentsReport) {
          if(line.supplier == supplierName) {
            line.is_payed = true;
          }
        } 
      },
      paymentDoc(data) {
        if(data.is_payed) return;
        this.$store.dispatch('addPaymentDoc', data.id);
        data.is_payed = true;
      },
      buttonIcon(is_payed) {
        return is_payed == false ? "pi pi-check" : "pi pi-times"
      },
      isDocsPayed(supplierName) {
        for(let line of this.paymentsReport) {
          if(line.supplier == supplierName) {
            if(line.is_payed) return true;
          }
        } 
        return false;
      }
    },
}
</script>

<style scoped>
.amount {
  max-width:7rem;
}
.b {
  font-weight: 500;
}
.payment-report {
  width: 750px;
  margin-bottom: 10px;
}
.mr-amount {
  margin-right: 5rem;
}
.mr-sum {
  margin-right: 54px;
}
</style>