<template>
  <MainMenu />
  <div  class="grid" style="max-width: 765px">
    <div class="col-4">
      <div class="p-inputgroup">
        <InputText id="project" type="text" class="p-inputtext" v-model="project.name" placeholder="проект" />
        <Button icon="pi pi-check" class="p-button-warning" @click="onProjectClick" />
      </div>
    </div>
    <div class="col-4">
      <Calendar id="start" v-model="dateStart" dateFormat="dd.mm.yy" :showIcon="true" />
    </div>
    <div class="col-4">
      <Calendar id="end" v-model="dateEnd" dateFormat="dd.mm.yy" :showIcon="true" />
    </div>
    <div class="col-12">
      <Button label="создать отчет" class="p-button-warning" @click="getPeriodReport" />
    </div>
  </div>

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
  
  <OverlayPanel ref="opProjects">
    <DataTable :value="projects" v-model:selection="selectedProject" selectionMode="single" 
        :paginator="true" :rows="5" @rowSelect="onProjectSelect" responsiveLayout="scroll" >
        <Column field="name" header="Проект" sortable />
    </DataTable>
  </OverlayPanel>
</template>

<script>
import MainMenu from '@/components/MainMenu.vue';
import OverlayPanel from 'primevue/overlaypanel';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
export default {
  name: 'ReportPage',
  components: {
    MainMenu,
    OverlayPanel,
    DataTable,
    Column,
    InputText,
    Button,
    Calendar
  },
  data() {
    return {
        selectedProject: null,
        project: {name: ''},
        dateStart: new Date(),
        dateEnd: new Date(),
        receiptsAmount: 0,
        salaryAmount: 0,
        spendsAmount: 0,
    }
  },
  computed: {
    projects() {
      return this.$store.state.cs.projects;
    },
    periodReport() {
      return this.$store.state.rs.periodReport;
    }
  },
  watch: {
    periodReport(report) {
        this.receiptsAmount = this.getAmount(report.receipts);
        this.salaryAmount = this.getAmount(report.salary);
        this.spendsAmount = this.getAmount(report.spends);
    }
  },
  mounted() {
  },
  methods: {
    onProjectSelect(event) {
      this.project = this.selectedProject = event.data;
      this.$refs.opProjects.hide();
    },
    onProjectClick(event) {
      this.$refs.opProjects.toggle(event);
    },
    getPeriodReport() {
      if(this.project.name != '') {
        this.$store.dispatch('getPeriodReport', [this.project.id, this.dateStart.getTime(), this.dateEnd.getTime()]);
      }
    },
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
  }
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
