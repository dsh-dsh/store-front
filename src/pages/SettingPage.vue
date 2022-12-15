<template>
  <MainMenu />
  <Accordion  v-model:activeIndex="activeIndex"  @tab-open="setProperties">

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

    <AccordionTab header="Настройки интерфеса">
      <div class="formgrid grid leftAlignment">
        <div class="col-12 md:col-4">
          <span>размер шрифта {{fontSize/20}}</span>
        </div>
        <div class="col-12 md:col-4">
          <Slider class="mt-3" v-model="fontSize" :step="20" @change="setExampleFontSize"/>
        </div>
        <div class="col-12 md:col-4"></div>

        <!-- <div class="col-12 md:col-12"><br></div>

        <div class="col-12 md:col-4">
          <span>удвлять значение из полей при начале редактирования</span>
        </div>
        <div class="col-12 md:col-4">
          <InputSwitch v-model="inputNullValue" @click="setInputNullValue" />
        </div>
        <div class="col-12 md:col-4"></div> -->
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
          <span>Проводить чеки </span>
        </div>
        <div class="col-12 md:col-6">
          <InputSwitch v-model="checkHoldingEnable" @click="setCheckHoldingEnable" />
        </div>
        
        <div class="col-12 md:col-12">
          <p></p>
        </div>
        <div class="col-12 md:col-6">
          <span>При проведении документов из 1С добавлять недостающие позиции </span>
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

    <AccordionTab v-if="isAdmin" header="Настройки каталогов">
      <div class="formgrid grid leftAlignment">
        <div class="col-12 md:col-3">
          <span>Наша компания </span>
        </div>
        <div class="col-12 md:col-5">
          <div class="p-inputgroup">
            <InputText type="text" class="p-inputtext-sm  input" v-model="companyName" />
            <Button icon="pi pi-check" class="p-button-sm p-button-warning" @click="onSupplierClick"/>
          </div>
        </div>
        <div class="col-12 md:col-4"></div>

        <div class="col-12 md:col-12"><br></div>
        
        <div class="col-12 md:col-3">
          <span>Каталог ингредиентов </span>
        </div>
        <div class="col-12 md:col-5">
          <div class="p-inputgroup">
            <InputText type="text" class="p-inputtext-sm  input" v-model="ingredientDirName" />
            <Button icon="pi pi-check" class="p-button-sm p-button-warning" @click="onItemDirClick"/>
          </div>
        </div>
        <div class="col-12 md:col-4"></div>

        <div class="col-12 md:col-12"><br></div>
        
        <div class="col-12 md:col-3">
          <span>Не списывать при расчете </span>
        </div>
        <div class="col-12 md:col-9">
          <div class="p-inputgroup">
            <AutoComplete :multiple="true" v-model="selectedStringItems" :suggestions="filteredItems" 
                @complete="searchItem($event)" @item-select="setDisabledItem" @item-unselect="setDisabledItem" optionLabel="Номенклатура" />
          </div>
        </div>

        <div class="col-12 md:col-12"><br></div>
        
        <div class="col-12 md:col-3">
          <span>Блокирующие авторы документы </span>
        </div>
        <div class="col-12 md:col-9">
          <div class="p-inputgroup">
            <AutoComplete :multiple="true" v-model="selectedUserNames" :suggestions="filteredUsers" 
                @complete="searchUsers($event)" @item-select="setBlockingUsers" @item-unselect="setBlockingUsers" optionLabel="Номенклатура" />
          </div>
        </div>

      </div>
    </AccordionTab>

    <AccordionTab v-if="isAdmin" header="Настройки интерфеса (админ)">
      <div class="formgrid grid leftAlignment">
        <div class="col-12 md:col-4">
          <span>Запрашивать проведение при сохранении документа </span>
        </div>
        <div class="col-12 md:col-4">
          <InputSwitch v-model="holdingDialog" @click="setHoldingDialogProperty" />
        </div>
        <div class="col-12 md:col-4"></div>
        <div class="col-12 md:col-4">
          <span>Устанавливать блокировку по последний проведенный чек </span>
        </div>
        <div class="col-12 md:col-4">
          <InputSwitch v-model="enableDocBlock" @click="setEnableDocBlockProperty" />
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
import MainMenu from '@/components/menus/MainMenu.vue'
import Button from 'primevue/button';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import OverlayPanel from 'primevue/overlaypanel';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import InputSwitch from 'primevue/inputswitch';
import {Property} from '@/js/Constants';
import Slider from 'primevue/slider';
import AutoComplete from 'primevue/autocomplete';

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
    InputSwitch,
    Slider,
    AutoComplete
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
      holdingDialog: Boolean,
      checkHoldingEnable: Boolean,
      enableDocBlock: Boolean,
      ingredientDirId: 0,
      ingredientDirName: "",
      periodString: '',
      disabledHoldChecksButton: true,
      selectedCompany: null,
      companyName: "",
      companyId: 0,
      selectedItemDir: null,
      fontSize: 0,
      currentFontSize: 0,
      selectedStringItems: [],
      filteredItems: null,
      selectedUserNames: [],
      filteredUsers: null
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
    systemSettingMap() {
      return this.$store.state.ss.systemSettingMap;
    },
    unholdenCheckDate() {
      return this.$store.state.ds.unholdenCheckDate;
    },
    itemDirList() {
      return this.$store.state.cs.itemDirList;
    },
    disabledItems() {
      return this.$store.state.ss.disabledItems;
    },
    blockingUsers() {
      return this.$store.state.ss.blockingUsers;
    },
    allItems() {
      return this.$store.state.cs.allItems;
    },
    users() {
      return this.$store.state.cs.allUsers;
    },
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
    },
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.$store.dispatch('getPeriod');
    this.$store.dispatch('checkUnholden1CDocuments');
    this.$store.dispatch('getDisabledItem');
    this.$store.dispatch('getBlockingUsers');
    this.$store.dispatch('getAllItems');
    this.$store.dispatch('getAllUsers');
  },
  methods: {
    searchUsers(event) {
      if (!event.query.trim().length) {
        this.filteredUsers = [...this.users];
      }
      else {
        this.filteredUsers = this.users.filter((item) => {
          return item.name.toLowerCase().includes(event.query.toLowerCase());
        }).map(user => user.name);
      } 
    },
    setBlockingUsers() {
      if(!this.selectedUserNames.length) return;
      let userIds = this.selectedUserNames.map(userName => this.users.find(user => user.name == userName).id);
      this.$store.dispatch('setBlockingUsers', userIds);
    },
    searchItem(event) {
      if (!event.query.trim().length) {
        this.filteredItems = [...this.allItems];
      }
      else {
        this.filteredItems = this.allItems.filter((item) => {
          return item.name.toLowerCase().includes(event.query.toLowerCase());
        }).map(item => item.name);
      }
    },
    setDisabledItem() {
      if(!this.selectedStringItems.length) return;
      let itemIds = this.selectedStringItems.map(itemName => this.allItems.find(item => item.name == itemName).id);
      this.$store.dispatch('setDisabledItems', itemIds);
    },
    setExampleFontSize(event) {
      if(event != this.currentFontSize) {
        let root= document.documentElement;
        root.style.setProperty('--app-font-size', 1 + (event / 200) + 'rem');
        if(this.currentFontSize != 0) {
          this.setProperty(this.user, Property.FONT_SIZE, event);
        }
        this.currentFontSize = event;
        this.fontSize = event;
      }
    },
    closePeriod() {
      this.$store.dispatch('closePeriod');
    },
    setProperties() {
      if(this.activeIndex == 0) {
        if(this.defaultProperties.length > 0) {
          let project = this.defaultProperties.find(prop => prop.type == Property.PROJECT);
          if(project) this.defaultProject = this.getProjectById(project.property);
          let storageTo = this.defaultProperties.find(prop => prop.type == Property.STORAGE_TO);
          if(storageTo) this.defaultStorageTo = this.getStorageById(storageTo.property);
          let storageFrom = this.defaultProperties.find(prop => prop.type == Property.STORAGE_FROM);
          if(storageFrom) this.defaultStorageFrom = this.getStorageById(storageFrom.property);
        }
      } else if(this.activeIndex == 1) {
        let fontSizeProperty = this.defaultProperties.find(prop => prop.type == Property.FONT_SIZE);
        if(fontSizeProperty) {
          this.currentFontSize = 0;
          this.setExampleFontSize(fontSizeProperty.property);
        }
      } else if(this.activeIndex == 3) {
        this.averagePriceForPeriodClose = this.systemSettingMap.get(Property.PERIOD_AVERAGE_PRICE) == 1; //averagePriceForPeriodCloseSetting;
      } else if(this.activeIndex == 4) {
        this.checkHoldingEnable = this.systemSettingMap.get(Property.CHECK_HOLDING_ENABLE) == 1; //checkHoldingEnableSetting;
        this.addShortageForHold = this.systemSettingMap.get(Property.ADD_REST_FOR_HOLD_1C_DOCS) == 1; //addShortageForHoldSetting;
        this.averagePriceForDocs = this.systemSettingMap.get(Property.DOCS_AVERAGE_PRICE) == 1; //averagePriceForDocsSetting;
        this.disabledHoldChecksButton = this.unholdenCheckDate == "";
      } else if(this.activeIndex == 5) {
        this.companyId = this.systemSettingMap.get(Property.OUR_COMPANY_ID); //ourCompanyIdSetting;
        this.companyName = this.companies.find(c => c.id == this.companyId).name;
        this.ingredientDirId = this.systemSettingMap.get(Property.INGREDIENT_DIR_ID); //ingredientDirIdSetting;
        this.ingredientDirName  = this.itemDirList.find(i => i.id == this.ingredientDirId).name;
        this.selectedStringItems = this.disabledItems.map(id => this.allItems.find(item => item.id == id)).map(item => item.name);
        this.selectedUserNames = this.blockingUsers.map(id => this.users.find(user => user.id == id)).map(user => user.name);
      } else if(this.activeIndex == 6) {
        this.holdingDialog = this.systemSettingMap.get(Property.HOLDING_DIALOG_ENABLE) == 1; //holdingDialogSetting;
        this.enableDocBlock = this.systemSettingMap.get(Property.DOC_BLOCK_ENABLE) == 1; //enableDocBlockSetting;
      }
    },
    // logout() {
    //   this.$store.dispatch('logout');
    // },
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
    setProperty(user, type, value) {
      this.$store.dispatch('setProperty', [user, type, value]);
    },
    deleteDocs() {
      this.$store.dispatch('deleteDocs');
    },
    hold1CDocs() {
      this.$store.dispatch('hold1CDocuments');
    },
    setAddShortageForHold() {
      this.$store.dispatch('setSystemSetting', 
          [Property.ADD_REST_FOR_HOLD_1C_DOCS, this.addShortageForHold ? 0 : 1]);
    },
    setAveragePriceForPeriodClose() {
      this.$store.dispatch('setSystemSetting', 
          [Property.PERIOD_AVERAGE_PRICE, this.averagePriceForPeriodClose ? 0 : 1]);
    },
    setAveragePriceForDocs() {
      this.$store.dispatch('setSystemSetting', 
          [Property.DOCS_AVERAGE_PRICE, this.averagePriceForDocs ? 0 : 1]);
    },
    setHoldingDialogProperty() {
      this.$store.dispatch('setSystemSetting', 
          [Property.HOLDING_DIALOG_ENABLE, this.holdingDialog ? 0 : 1]);
    },
    setCheckHoldingEnable() {
      this.$store.dispatch('setSystemSetting', 
          [Property.CHECK_HOLDING_ENABLE, this.checkHoldingEnable ? 0 : 1]);
    },
    setEnableDocBlockProperty() {
      this.$store.dispatch('setSystemSetting', 
          [Property.DOC_BLOCK_ENABLE, this.enableDocBlock ? 0 : 1]);
    },
    onSupplierClick(event) {
      this.$refs.opCompanies.toggle(event);
    },
    onCompanySelect(event) {
      this.companyName = event.data.name;
      this.companyId = event.data.id; 
      this.$store.dispatch('setSystemSetting', 
          [Property.OUR_COMPANY_ID, this.companyId]);
      this.$refs.opCompanies.hide();
    },
    onItemDirClick(event) {
      this.$refs.opItemDirs.toggle(event);
    },
    onItemDirSelect(event) {
      this.ingredientDirName = event.data.name;
      this.ingredientDirId = event.data.id;
      this.$store.dispatch('setSystemSetting', 
          [Property.INGREDIENT_DIR_ID, this.ingredientDirId]);
      this.$refs.opItemDirs.hide();
    }
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
  /* .conteiner {
    display: flex;
  }
  .content {
    display: flex;
    flex-direction: column;
    flex: 0 0 100%;
  } */
  .input {
    width: 200 px;
  }
  /* .ml-5 {
    margin-left: 50px;
  } */
  .mt-3 {
    margin-top: 30px;
  }
  .label {
    margin: 0px 0px 5px 0px;
    display: inline-block;
  }
  .leftAlignment {
    text-align: left;
  }
</style>