<template>
  <Toolbar class="top-menu">
    <template #end>
      <Button label="logout" @click="logout()" class="p-button-sm p-button-rounded" />
    </template>
  </Toolbar>
  <div class="conteiner">
  <MainMenu />
  <div class="content">
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
      <AccordionTab header="Безвозвратное удаление документов">
        <Button label="Удалить помеченные на удаление документы" @click="deleteDocs" class="p-button-sm p-button-text" />
      </AccordionTab>
      <AccordionTab header="Header IV" :disabled="true">
        <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      </AccordionTab>
      <AccordionTab v-if="isAdmin" header="Настройки проведения документов">
        <div v-if="defaultProject" class="formgrid grid">
          <div class="col-12 md:col-10">
          <span>При проведении документов из 1С не добавлять недостающие позиции, списывать только из наличия </span>
          </div>
          <div class="col-12 md:col-2">
          <InputSwitch v-model="addShortageForHold" @click="setAddShortageForHold" />
          </div>
        </div>
      </AccordionTab>
    </Accordion>
  </div>
  </div>
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
</template>

<script>
import MainMenu from '@/components/MainMenu.vue'
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import OverlayPanel from 'primevue/overlaypanel';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import {Property} from '@/js/Constants';
import InputSwitch from 'primevue/inputswitch';

export default {
  name: 'Settings',
  components: {
    MainMenu,
    Toolbar,
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
      addShortageForHold: Boolean
    };
  },
  computed: {
    defaultProperties() {
      return this.$store.state.ss.defaultProperties;
    },
    projects() {
      return this.$store.state.cs.projects
    },
    storages() {
      return this.$store.state.cs.storages
    },
    addShortageForHoldSetting() {
      return this.$store.state.ss.addShortageForHold;
    }
  },
  watch: {
    user(val) {
      if(val.role == 'ADMIN') {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
    }
  },
  mounted() {
    this.$store.dispatch('getDefaultProperties');
    this.$store.dispatch('getAddShortageForHold');
    this.user = JSON.parse(localStorage.getItem('user'));
  },
  methods: {
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
      } else if(this.activeIndex == 3) {
        this.addShortageForHold = this.addShortageForHoldSetting;
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
      console.log(this.addShortageForHold)
      this.$store.dispatch('setAddShortageForHoldProperty', this.addShortageForHold ? 0 : 1);
    },
    setProperty(user, type, value) {
      this.$store.dispatch('setProperty', [user, type, value]);
    },
    deleteDocs() {
      this.$store.dispatch('deleteDocs');
    }
  },
}
</script>

<style scoped>
  .top-menu {
    background-color: rgb(55, 59, 65);
    margin-bottom: 15px;
  }
  .conteiner {
    display: flex;
  }
  .content {
    display: flex;
    flex-direction: column;
    flex: 0 0 80%;
    margin-left: 30px;
  }
  .ml-5 {
    margin: 0px 0px 0px 50px;
  }
  .label {
    margin: 0px 0px 5px 0px;
    display: inline-block;
  }
  .horizontal {
    justify-content: center;
  }
</style>