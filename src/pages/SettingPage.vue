<template>
  <MainMenu />
  <Accordion  v-model:activeIndex="activeIndex"  @tab-open="setDefaultProperties">

    <AccordionTab header="Реквизиты документов по умолчанию">
      <div v-if="defaultProject" class="formgrid grid">  
          <div class="col-12 md:col-4">
            <label for="project" class="label">Проект</label><br>
            <div class="p-inputgroup">
              <InputText id="project" type="text" class="p-inputtext-sm" v-model="defaultProject.name" />
              <Button icon="pi pi-check" class="p-button-warning" @click="onProjectClick" />
            </div>
          </div>

          <div class="col-12 md:col-4">
            <label for="storageFrom" class="label">со склада</label><br>
            <div class="p-inputgroup">
              <InputText id="storageFrom" type="text" class="p-inputtext-sm" v-model="defaultStorageFrom.name" />
              <Button icon="pi pi-check" class="p-button-warning" @click="onStorageFromClick" />
            </div>
          </div>
          
          <div class="col-12 md:col-4">
            <label for="storageTo" class="label">на склад</label><br>
            <div class="p-inputgroup">
              <InputText id="storageTo" type="text" class="p-inputtext-sm" v-model="defaultStorageTo.name" />
              <Button icon="pi pi-check" class="p-button-warning" @click="onStorageToClick" />
            </div>
          </div>
      </div>
    </AccordionTab>

    <AccordionTab v-if="isAdmin" header="Безвозвратное удаление документов">
      <Button label="Удалить помеченные на удаление документы" @click="deleteDocs" class="p-button-sm p-button-text" />
    </AccordionTab>

    <AccordionTab v-if="isAdmin" header="Закрытие периода">
      <div class="formgrid grid leftAlignment">
        <div class="col-12 md:col-6">
          <span>{{ periodString }}</span> 
        </div>
        <div class="col-12 md:col-6">
          <Button label="Да" @click="closePeriod" class="p-button-secondary p-button-rounded p-button-sm" />
        </div>
        
        <div class="col-12 md:col-12">
          <p></p>
        </div>

        <div class="col-12 md:col-6">
          <span>При закрытии периода переносить остатки по средней цене</span>
        </div>
        <div class="col-12 md:col-6">
          <InputSwitch v-model="averagePriceForPeriodClose" @click="setAveragePriceForPeriodClose" />
        </div>
      </div>
    </AccordionTab>

    <AccordionTab v-if="isAdmin" header="Настройки проведения документов">
      <div class="formgrid grid leftAlignment">
        <div class="col-12 md:col-6">
          <span>При проведении документов из 1С не добавлять недостающие позиции (списывать только из наличия) </span>
        </div>
        <div class="col-12 md:col-6">
          <InputSwitch v-model="addShortageForHold" @click="setAddShortageForHold" />
        </div>
        
        <div class="col-12 md:col-12">
          <p></p>
        </div>

        <div class="col-12 md:col-6">
          <span>При проведении документов списания и перемещения персчитывать стоимость позиций в соответствии со списываемыми партиями</span>
        </div>
        <div class="col-12 md:col-6">
          <InputSwitch v-model="averagePriceForDocs" @click="setAveragePriceForDocs" />
        </div>
        
        <div class="col-12 md:col-12">
          <p></p>
        </div>

        <div class="col-12 md:col-6">
          <span>Ручное проведение документов из 1С. Есть не проведенные чеки от:  {{ unholdenCheckDate }} </span>
        </div>
        <div class="col-12 md:col-6">
          <Button label="Провести документы" @click="hold1CDocs" class="p-button-secondary p-button-rounded p-button-sm" :disabled="disabledHoldChecksButton"/>
        </div>
      </div>
    </AccordionTab>

    <AccordionTab v-if="isAdmin" header="Настройки каталогов"><div class="formgrid grid leftAlignment">
        <div class="col-12 md:col-4">
          <span>Наша компания </span>
        </div>
        <div class="col-12 md:col-4">
          <div class="p-inputgroup">
            <InputText type="text" class="p-inputtext-sm  input" v-model="companyName" />
            <Button icon="pi pi-check" class="p-button-sm p-button-warning" @click="onSupplierClick"/>
          </div>
        </div>
        <div class="col-12 md:col-4"></div>

        <div class="col-12 md:col-12"><br></div>
        
        <div class="col-12 md:col-4">
          <span>Каталог ингредиентов </span>
        </div>
        <div class="col-12 md:col-4">
          <div class="p-inputgroup">
            <InputText type="text" class="p-inputtext-sm  input" v-model="ingredientDirName" />
            <Button icon="pi pi-check" class="p-button-sm p-button-warning" @click="onItemDirClick"/>
          </div>
        </div>
        <div class="col-12 md:col-4"></div>
      </div>
    </AccordionTab>

  </Accordion>
    
  <OverlayPanel ref="opProjects">
    <DataTable :value="projects" v-model:selection="selectedProject" selectionMode="single" 
        :paginator="true" :rows="5" @rowSelect="onProjectSelect" responsiveLayout="scroll" >
        <Column field="name" header="Name" sortable style="width: 60%"/>
    </DataTable>
  </OverlayPanel>
  <OverlayPanel ref="opStorage">
    <DataTable :value="storages" v-model:selection="selectedStorage" selectionMode="single" 
        :paginator="true" :rows="5" @rowSelect="onStorageSelect" responsiveLayout="scroll" >
        <Column field="name" header="Name" sortable />
    </DataTable>
  </OverlayPanel>
  <OverlayPanel ref="opCompanies">
    <DataTable :value="companies" v-model:selection="selectedCompany" selectionMode="single" 
        :paginator="true" :rows="7" @rowSelect="onCompanySelect" responsiveLayout="scroll" >
        <Column field="name" header="Name" sortable style="width: 60%"/>
        <Column field="inn" header="email" sortable style="width: 40%"></Column>
    </DataTable>
  </OverlayPanel>
  <OverlayPanel ref="opItemDirs">
    <DataTable :value="itemDirList" v-model:selection="selectedItemDir" selectionMode="single" 
        :paginator="true" :rows="7" @rowSelect="onItemDirSelect" responsiveLayout="scroll" >
        <Column field="name" header="Name" sortable/>
    </DataTable>
  </OverlayPanel>
</template>

<script>
import MainMenu from '@/components/MainMenu.vue'
import Button from 'primevue/button';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import OverlayPanel from 'primevue/overlaypanel';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import InputSwitch from 'primevue/inputswitch';
import {Property} from '@/js/Constants';

export default {
  name: 'Settings',
  components: {
    MainMenu,
    Accordion,
    AccordionTab,
    Button,
    InputText,
    DataTable,
    Column,
    OverlayPanel,
    InputSwitch
  },
  data() {
    return {
      user: null,
      defaultProject: {"name": ""},
      defaultStorageTo: {"name": ""},
      defaultStorageFrom: {"name": ""},
      selectedStorage: null,
      selectedProject: null,
      storageType: "",
      activeIndex: -1,
      isAdmin: false,
      addShortageForHold: Boolean,
      averagePriceForPeriodClose: Boolean,
      averagePriceForDocs: Boolean,
      periodString: '',
      disabledHoldChecksButton: true,
      selectedCompany: null,
      companyName: "",
      companyId: 0,
      ingredientDirId: 0,
      ingredientDirName: "",
      selectedItemDir: null
    };
  },
  computed: {
    period() {
      return this.$store.state.ss.period;
    },
    defaultProperties() {
      return this.$store.state.ss.defaultProperties;
    },
    projects() {
      return this.$store.state.cs.projects
    },
    storages() {
      return this.$store.state.cs.storages
    },
    companies() {
      return this.$store.state.cs.companies;
    },
    addShortageForHoldSetting() {
      return this.$store.state.ss.addShortageForHold;
    },
    averagePriceForPeriodCloseSetting() {
      return this.$store.state.ss.аveragePriceForPeriodCloseProperty;
    },
    averagePriceForDocsSetting() {
      return this.$store.state.ss.аveragePriceForDocsProperty;
    },
    ourCompanyIdSetting() {
      return this.$store.state.ss.ourCompanyIdProperty;
    },
    ingredientDirIdSetting() {
      return this.$store.state.ss.ingredientDirIdProperty;
    },
    unholdenCheckDate() {
      return this.$store.state.ds.unholdenCheckDate;
    },
    itemDirList() {
      return this.$store.state.cs.itemDirList;
    }
  },
  watch: {
    user(val) {
      if(val.role == 'ADMIN') {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
    },
    period(val) {
      this.periodString = 'Закрыть период? (текущий период: ' 
            +  formatDate(new Date(val.start_date)) + ' - ' + formatDate(new Date(val.end_date)) + ')';
    }
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.$store.dispatch('getDefaultProperties');
    this.$store.dispatch('getAddShortageForHold');
    this.$store.dispatch('getAveragePriceForPeriodCloseProperty');
    this.$store.dispatch('getAveragePriceForDocsProperty');
    this.$store.dispatch('getPeriod');
    this.$store.dispatch('checkUnholden1CDocuments');
    this.$store.dispatch('getOurCompanyProperty');
    this.$store.dispatch('getIngredientDirIdProperty');
  },
  methods: {
    closePeriod() {
      this.$store.dispatch('closePeriod');
    },
    setDefaultProperties() {
      if(this.activeIndex == 0) {
        if(this.defaultProperties.length > 0) {
          let project = this.defaultProperties.filter(prop => prop.type == Property.PROJECT).pop();
          if(project) this.defaultProject = this.getProjectById(project.property);

          let storageTo = this.defaultProperties.filter(prop => prop.type == Property.STORAGE_TO).pop();
          if(storageTo) this.defaultStorageTo = this.getStorageById(storageTo.property);

          let storageFrom = this.defaultProperties.filter(prop => prop.type == Property.STORAGE_FROM).pop();
          if(storageFrom) this.defaultStorageFrom = this.getStorageById(storageFrom.property);
        }
      } else if(this.activeIndex == 2) {
        this.averagePriceForPeriodClose = this.averagePriceForPeriodCloseSetting;
      } else if(this.activeIndex == 3) {
        this.addShortageForHold = this.addShortageForHoldSetting;
        this.averagePriceForDocs = this.averagePriceForDocsSetting;
        this.disabledHoldChecksButton = this.unholdenCheckDate == "";
      } else if(this.activeIndex == 4) {
        this.companyId = this.ourCompanyIdSetting;
        this.companyName = this.companies.filter(c => c.id == this.ourCompanyIdSetting).pop().name;
        this.ingredientDirId = this.ingredientDirIdSetting;
        this.ingredientDirName  = this.itemDirList.filter(i => i.id == this.ingredientDirIdSetting).pop().name;
      }
    },
    logout() {
      this.$store.dispatch('logout');
    },
    getProjectById(id) {
      return this.projects.filter(project => project.id == id).pop();
    },
    getStorageById(id) {
      return this.storages.filter(storage => storage.id == id).pop();
    },
    onProjectClick(event) {
      this.$refs.opProjects.toggle(event);
    },
    onProjectSelect(event) {
      this.defaultProject = event.data;
      this.$refs.opProjects.hide();
      this.setProperty(this.user, Property.PROJECT, event.data.id);
    },
    onStorageFromClick(event) {
      this.storageType = 'storageFrom';
      this.$refs.opStorage.toggle(event);
    },
    onStorageToClick(event) {
      this.storageType = 'storageTo';
      this.$refs.opStorage.toggle(event);
    },
    onStorageSelect(event) {
      if(this.storageType == 'storageFrom') {
        this.defaultStorageFrom = event.data;
        this.setProperty(this.user, Property.STORAGE_FROM, event.data.id);
      } else {
        this.defaultStorageTo = event.data;
        this.setProperty(this.user, Property.STORAGE_TO, event.data.id);
      }
      this.$refs.opStorage.hide();
    },
    setAddShortageForHold() {
      this.$store.dispatch('setAddShortageForHoldProperty', this.addShortageForHold ? 1 : 0);
    },
    setProperty(user, type, value) {
      this.$store.dispatch('setProperty', [user, type, value]);
    },
    deleteDocs() {
      this.$store.dispatch('deleteDocs');
    },
    hold1CDocs() {
      this.$store.dispatch('hold1CDocuments');
    },
    setAveragePriceForPeriodClose() {
      this.$store.dispatch('setAveragePriceForPeriodCloseProperty', this.averagePriceForPeriodClose ? 0 : 1);
    },
    setAveragePriceForDocs() {
      this.$store.dispatch('setAveragePriceForDocsProperty', this.averagePriceForDocs ? 0 : 1);
    },
    onSupplierClick(event) {
      this.$refs.opCompanies.toggle(event);
    },
    onCompanySelect(event) {
      this.companyName = event.data.name;
      this.companyId = event.data.id; 
      this.$store.dispatch('setOurCompanyProperty', this.companyId);
      this.$refs.opCompanies.hide();
    },
    onItemDirClick(event) {
      this.$refs.opItemDirs.toggle(event);
    },
    onItemDirSelect(event) {
      this.ingredientDirName = event.data.name;
      this.ingredientDirId = event.data.id;
      this.$store.dispatch('setIngredientDirIdProperty', this.ingredientDirId);
      this.$refs.opItemDirs.hide();
    },
  },
}

function formatDate(date, withTime) {
    let params = {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'};
    if(withTime) {
        params.hour = 'numeric';
        params.minute = 'numeric';
        params.second = 'numeric';
    }
    return date.toLocaleString("ru-Ru", params);
}

</script>

<style scoped>
  .conteiner {
    display: flex;
  }
  .content {
    display: flex;
    flex-direction: column;
    flex: 0 0 100%;
  }
  .input {
    width: 200 px;
  }
  .ml-5 {
    margin: 0px 0px 0px 50px;
  }
  .label {
    margin: 0px 0px 5px 0px;
    display: inline-block;
  }
  .leftAlignment {
    text-align: left;
  }
</style>