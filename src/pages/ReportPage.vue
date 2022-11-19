<template>
  <MainMenu />

  <h3>{{ title }}</h3>

    <div class="inline-flex">
      <div v-if="type == 'period'" class="flex-1 mr-3">
        <div class="p-inputgroup">
          <InputText id="project" type="text" class="p-inputtext" v-model="project.name" placeholder="проект" />
          <Button icon="pi pi-check" class="p-button-warning" @click="onProjectClick" />
        </div>
      </div>
      <div v-if="type == 'itemMoves'" class="flex-1 mr-3">
        <div class="p-inputgroup">
          <InputText id="storage" type="text" class="p-inputtext" v-model="storage.name" placeholder="склад" />
          <Button icon="pi pi-check" class="p-button-warning" @click="onStorageClick" />
        </div>
      </div>
      <div class="flex-1 mr-3">
        <Calendar id="start" v-model="dateStart" dateFormat="dd.mm.yy" :showIcon="true" />
      </div>
      <div class="flex-1 mr-3">
        <Calendar id="end" v-model="dateEnd" dateFormat="dd.mm.yy" :showIcon="true" />
      </div>
      <div class="flex-1 mr-3">
        <Button label="создать отчет" class="p-button-warning" @click="getReport" />
      </div>
    </div>
    <div v-if="type == 'itemMoves'" class="inline-flex mt-3" style="width: 600px">
      <div class="flex-1 mr-3">
        <div class="field-checkbox">
          <Checkbox inputId="includeNull" v-model="includeNull" :binary="true" />
          <label for="includeNull">Включать нулевые движения</label>
        </div>
      </div>
      <div class="flex-1 mr-3">
        <div class="field-checkbox">
          <Checkbox inputId="onlyHolden" v-model="onlyHolden" :binary="true" />
          <label for="onlyHolden">Только проведенные документы</label>
        </div>
      </div>
    </div>

  <PeriodReport v-if="type == 'period'" />
  <ItemMovesReport v-if="type == 'itemMoves'" />

  <OverlayPanel ref="opProjects">
    <DataTable :value="projects" v-model:selection="selectedProject" selectionMode="single" 
        :paginator="true" :rows="5" @rowSelect="onProjectSelect" responsiveLayout="scroll" >
        <Column field="name" header="Наименование проекта" sortable />
    </DataTable>
  </OverlayPanel>
  <OverlayPanel ref="opStorages">
    <DataTable :value="storages" v-model:selection="selectedStorage" selectionMode="single" 
        :paginator="true" :rows="5" @rowSelect="onStorageSelect" responsiveLayout="scroll" >
        <Column field="name" header="Наименование склада" sortable />
    </DataTable>
  </OverlayPanel>
</template>

<script>
import MainMenu from '@/components/menus/MainMenu.vue';
import OverlayPanel from 'primevue/overlaypanel';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import PeriodReport from '@/components/reports/PeriodReport.vue';
import ItemMovesReport from '@/components/reports/ItemMovesReport.vue';
import Checkbox from 'primevue/checkbox';
import {Property} from '@/js/Constants';
export default {
  name: 'ReportPage',
  components: {
    MainMenu,
    OverlayPanel,
    DataTable,
    Column,
    InputText,
    Button,
    Calendar,
    PeriodReport,
    ItemMovesReport,
    Checkbox
  },
  props: {
      type: String,
  },
  data() {
    return {
      selectedProject: null,
      selectedStorage: null,
      project: {name: ''},
      storage: {name: ''},
      dateStart: new Date(),
      dateEnd: new Date(),
      title: '',
      includeNull: false,
      onlyHolden: true
    }
  },
  computed: {
    projects() {
      return this.$store.state.cs.projects;
    },
    storages() {
      return this.$store.state.cs.storages
    },
    defaultProperties() {
      return this.$store.state.ss.defaultProperties;
    },
  },
  watch: {
    type(value) {
      this.setTitle(value);
    }
  },
  mounted() {
    this.setTitle(this.type);
    let storageId = this.defaultProperties.find(prop => prop.type == Property.STORAGE_FROM).property;
    this.storage = this.getStorageById(storageId);
    let projectId = this.defaultProperties.find(prop => prop.type == Property.PROJECT).property;
    this.project = this.getProjectById(projectId);
  },
  methods: {
    onProjectSelect(event) {
      this.project = this.selectedProject = event.data;
      this.$refs.opProjects.hide();
    },
    onStorageSelect(event) {
      this.storage = this.selectedStorage = event.data;
      this.$refs.opStorages.hide();
    },
    onProjectClick(event) {
      this.$refs.opProjects.toggle(event);
    },
    onStorageClick(event) {
      this.$refs.opStorages.toggle(event);
    },
    getReport() {
      if(this.type == 'period' && this.project.name != '') {
        this.$store.dispatch('getPeriodReport', [this.project.id, this.dateStart.getTime(), this.dateEnd.getTime()]);
      } else if(this.type == 'itemMoves' && this.storage.name != '') {
        this.$store.dispatch('getItemMovesReport', [this.storage.id, this.dateStart.getTime(), this.dateEnd.getTime(), this.includeNull, this.onlyHolden]);
      }
    },
    setTitle(value) {
      if(value == 'period') {
        this.title = 'Отчет за период';
      } else if(value == 'itemMoves') {
        this.title = 'Движение товара по складу';
      } else {
        this.title = '';
      }
    },
    getStorageById(id) {
      return this.storages.find(storage => storage.id == id);
    },
    getProjectById(id) {
      return this.projects.find(project => project.id == id);
    },
  }
}
</script>

<style scoped>
</style>
