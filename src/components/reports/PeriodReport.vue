<template>
<div v-if="periodReport" class="period-report">
    <br>
    <h3>Отчет по кафе {{periodReport.department}} за период с {{periodReport.dateStart}} по {{periodReport.dateEnd}}</h3>
    <div class="title">Выручка</div>
    <div class="flex mb-1" v-for="receipt in periodReport.receipts" :key="receipt.name">
      <div class="flex-none flex mr-2">{{ receipt.name }}</div>
      <div class="flex-grow-1 flex white-space-nowrap overflow-hidden">
         . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 
         . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . </div>
      <div class="flex-none flex ml-2">{{ formatPrice(receipt.value) }}</div>
    </div>
    <div class="bottom-line"></div>
    <div class="flex">
      <div class="flex-none flex">ИТОГО:</div>
      <div class="flex-grow-1 flex overflow-hidden"></div>
      <div class="flex-none flex">{{ formatPrice(receiptsAmount) }}</div>
    </div>
    <br>
    <div class="title">Зарплаты</div>
    <div class="flex mb-1" v-for="salary in periodReport.salary" :key="salary.name">
      <div class="flex-none flex mr-2">{{ salary.name }}</div>
      <div class="flex-grow-1 flex white-space-nowrap overflow-hidden">
         . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 
         . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . </div>
      <div class="flex-none flex ml-2">{{ formatPrice(salary.value) }}</div>
    </div>
    <div class="bottom-line"></div>
    <div class="flex">
      <div class="flex-none flex">ИТОГО:</div>
      <div class="flex-grow-1 flex  overflow-hidden"></div>
      <div class="flex-none flex">{{ formatPrice(salaryAmount) }}</div>
    </div>
    <br>
    <div class="title">Расходы</div>
    <div class="flex mb-1" v-for="spend in periodReport.spends" :key="spend.name">
      <div class="flex-none flex mr-2">{{ spend.name }}</div>
      <div class="flex-grow-1 flex white-space-nowrap overflow-hidden">
         . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 
         . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . </div>
      <div class="flex-none flex ml-2">{{ formatPrice(spend.value) }}</div>
    </div>
    <div class="bottom-line"></div>
    <div class="flex">
      <div class="flex-none flex">ИТОГО:</div>
      <div class="flex-grow-1 flex  overflow-hidden"></div>
      <div class="flex-none flex">{{ formatPrice(spendsAmount) }}</div>
    </div>
    <br>
    <div class="flex">
      <div class="flex-none flex">ИТОГО ОСТАТОК НАЛИЧНЫХ:</div>
      <div class="flex-grow-1 flex  overflow-hidden"></div>
      <div class="flex-none flex">{{ formatPrice(periodReport.receipts[0].value - (salaryAmount  + spendsAmount)) }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PeriodReport',
  components: {
    },
    data() {
        return {
            receiptsAmount: 0,
            salaryAmount: 0,
            spendsAmount: 0,
        };
    },
    computed: {
        periodReport() {
            return this.$store.state.rs.periodReport;
        }
    }, 
    watch: {
        periodReport(report) {
            this.receiptsAmount = this.getAmount(report.receipts);
            this.salaryAmount = this.getAmount(report.salary);
            this.spendsAmount = this.getAmount(report.spends);
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
        formatPrice(value) {
            return Number(value).toFixed(2);
        }
    },
}
</script>

<style scoped>
.period-report {
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
</style>