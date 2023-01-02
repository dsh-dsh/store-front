<template>
  <div>
    <MainMenu />
    <div class="flex justify-content-between mb-2">
      <DocTabs :filter="filter" />
      <Button icon="pi pi-plus" @click="chooseDocType" class="p-button-rounded p-button-secondary p-button-outlined mr-2" />
    </div>
  </div>
  <div class="border"  style="height: calc(100vh - 9.5rem)">
    <DataTable :value="documents" @row-click="openDocument" class="p-datatable-sm" stripedRows :paginator="true" :rows="20"
      v-model:selection="selectedProduct" selectionMode="single" sortField="date_time" :sortOrder="-1" 
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      :rowsPerPageOptions="[10,20,50]" responsiveLayout="scroll" :rowHover="true"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
      filterDisplay="menu" v-model:filters="filters"
      :scrollable="true" scrollHeight="flex">
      <template #header>
        <div class="flex justify-content-between">
          <div class="ml-2 mt-2"><span v-if="isAdmin">{{documents.reduce((accumulator, value) => accumulator + value.amount, 0)}}</span></div>
          <div class="horizontal">
            <span class="mlr-1">с</span>
            <Calendar id="buttonbar" v-model="firstDate" @date-select="setStartDate" dateFormat="dd.mm.yy" :showButtonBar="true" />
            <span class="mlr-1">до</span>
            <Calendar id="buttonbar" v-model="lastDate" @date-select="setEndDate" dateFormat="dd.mm.yy" :showButtonBar="true" />
          </div>
        </div>
      </template>
      <template #empty>
        <div class="flex justify-content-center">
          <p>Журнал пуст</p>
        </div>
      </template>
      <template #loading>
        <div class="flex justify-content-center">
          <i class="pi pi-spin pi-spinner" style="font-size: 2rem">
        </i></div>
      </template>
      <Column field="is_hold" header="" :showApplyButton="false" dataType="boolean" style="max-width:3rem">
        <template #body="{data}"><i class="pi" :class="iconClass(data)" v-tooltip="getToolTipText(data)"></i></template>
        <template #filter="{filterModel,filterCallback}">
          <div class="mb-3 font-bold">проведен</div>
          <TriStateCheckbox v-model="filterModel.value" @change="filterCallback()"/>
        </template>
      </Column>
      <Column v-if="isAdmin || isAccountant" field="is_payed" header="" :showApplyButton="false" dataType="boolean" style="max-width:3rem">
        <template #body="{data}"><i class="pi" :class="payedIconClass(data)" v-tooltip="getPayedToolTip(data)"></i></template>
        <template #filter="{filterModel,filterCallback}">
          <div class="mb-3 font-bold">оплачен</div>
          <TriStateCheckbox v-model="filterModel.value" @change="filterCallback()"/>
        </template>
      </Column>
      <Column field="date_time" header="Дата" sortable dataType="date" style="max-width:6rem">
        <template #body="{data}">
          <div :class="disabledClass(data)">
            {{new Date(data.date_time).toLocaleDateString('ru-RU', {day: '2-digit', month: '2-digit', year: 'numeric'})}}
          </div>
        </template>
      </Column>
      <Column field="number" header="№" sortable style="max-width:7rem">
        <template #body="{data}"><div :class="disabledClass(data)">{{data.number}}</div></template>
      </Column>
      <Column filterField="doc_type" header="Документ" :showFilterMatchModes="false" :showApplyButton="false" sortable style="max-width:9rem">
        <template #filter="{filterModel, filterCallback}">
          <div class="mb-3 font-bold">тип документа</div>
          <MultiSelect v-model="filterModel.value" @change="filterCallback();onDocTypeFilterChange($event)" :options="docTypeFilters" />
        </template>
        <template #body="{data}"><div :class="disabledClass(data)">{{data.doc_type}}</div></template>
      </Column>
      <Column v-if="!isMobile" field="supplier.name" header="поставщик" :showFilterMatchModes="false" :showApplyButton="false" sortable>
        <template #filter="{filterModel, filterCallback}">
          <div class="mb-3 font-bold">поставщик</div>
          <InputText type="text" v-model="filterModel.value" @input="filterCallback()" class="p-column-filter" v-tooltip.top.focus="toltip"/>
        </template>
        <template #body="{data}"><div :class="disabledClass(data)">{{getName(data.supplier)}}</div></template>
      </Column>
      <Column v-if="!isMobile" field="project.name" header="проект" :showFilterMatchModes="false" :showApplyButton="false" sortable>
        <template #filter="{filterModel, filterCallback}">
          <div class="mb-3 font-bold">проект</div>
          <InputText type="text" v-model="filterModel.value" @input="filterCallback()" class="p-column-filter" v-tooltip.top.focus="toltip"/>
        </template>
        <template #body="{data}"><div :class="disabledClass(data)">{{getName(data.project)}}</div></template>
      </Column>
      <Column field="storage_from.name" header="со склада" :showFilterMatchModes="false" :showApplyButton="false" sortable>
        <template #filter="{filterModel, filterCallback}">
          <div class="mb-3 font-bold">со склада</div>
          <InputText type="text" v-model="filterModel.value" @input="filterCallback()" class="p-column-filter" v-tooltip.top.focus="toltip"/>
        </template>
        <template #body="{data}"><div :class="disabledClass(data)">{{getName(data.storage_from)}}</div></template>
      </Column>
      <Column field="storage_to.name" header="на склад" :showFilterMatchModes="false" :showApplyButton="false" sortable>
        <template #filter="{filterModel, filterCallback}">
          <div class="mb-3 font-bold">на склад</div>
          <InputText type="text" v-model="filterModel.value" @input="filterCallback()" class="p-column-filter" v-tooltip.top.focus="toltip"/>
        </template>
        <template #body="{data}"><div :class="disabledClass(data)">{{getName(data.storage_to)}}</div></template>
      </Column>
      <Column v-if="!isMobile" field="amount" header="Сумма" class="justify-content-end mr-3" headerClass="justify-content-end mr-2" sortable>
        <template #body="{data}"><div :class="disabledClass(data)">{{formatCurrency(data.amount)}}</div></template>
      </Column>
      <Column  filterField="author.name" header="Автор" :showFilterMatchModes="false" :showApplyButton="false"> 
        <template #filter="{filterModel, filterCallback}">
          <div class="mb-3 font-bold">автор</div>
          <InputText type="text" v-model="filterModel.value" @input="filterCallback()" class="p-column-filter" v-tooltip.top.focus="toltip"/>
        </template>
        <template #body="{data}"><div :class="disabledClass(data)">{{getName(data.author)}}</div></template>
      </Column>
      <Column style="max-width:4rem">
        <template #body="{data}"> 
          <Button icon="pi pi-bars" class="p-button-rounded p-button-secondary p-button-text mr-2" @click="toggleModalMenu($event, data)" />
        </template>
      </Column>
      <template #paginatorstart>
          <Button type="button" icon="pi pi-refresh" class="p-button-text" />
      </template>
      <template #paginatorend>
          <Button type="button" icon="pi pi-cloud" class="p-button-text" />
      </template>
    </DataTable> 
  </div>  

  <Dialog v-model:visible="displayDocument" :style="{width: '90%'}" :modal="true"  :showHeader="showDialogHeader">
    <div v-if="docRedactor">
      <DocRedactor :docId="docId"
      @disable-hold-button="disableHoldButton" @disable-save-button="disableSaveButton" 
      @disable-current-time="disableCurrentTime" :type="type" :docType="docType"/>
    </div>
    <div v-else>
      <Document :docId="docId" 
      @copy-from-request-doc="openRequestDocRedactor" @open-base-doc="openBaseDoc"
      @open-update-doc="openUpdateDocumentRedactor" @open-copy-doc="openCopyDocumentRedactor" />
    </div>
    <template #footer>
      <Button label="Закрыть" icon="pi pi-times" @click="closeDocument" class="p-button-secondary p-button-text"/>
      <!-- <Button v-if="docRedactor" label="Записать" icon="pi pi-check" @click="quickSaveDoc" class="p-button-rounded p-button-secondary" :disabled="disabledSaveButton"/> -->
      <Button v-if="docRedactor" label="Сохранить" icon="pi pi-check" @click="openSaveDocDialog" class="p-button-rounded p-button-secondary" autofocus :disabled="disabledSaveButton"/>
      <Button :label="holdLable" icon="pi pi-check" @click="holdDocument" class="p-button-rounded p-button-secondary" :disabled="disabledHoldButton" />
    </template>
  </Dialog>

  <OverlayPanel ref="opDocTypes">
    <div v-for="docType in docTypes" :key="docType">
     <Button class="p-button-secondary p-button-text" @click="addNewDocByType(docType.name)">{{docType.name}}</Button>
    </div>
  </OverlayPanel>

  <Menu ref="menu" :model="menuModel" :popup="true" style="width: 230px;"/>

  <Dialog header="Подтверждение" class="border" v-model:visible="displayConfirmation" :style="{width: '300px'}" :modal="true" :showHeader="false">
      <h3>{{confirmationMessage}}</h3>
    <template #footer>
      <Button v-if="buttonNoEnabled" label="Нет" icon="pi pi-times" @click="closeConfirmation" class="p-button-text" />
      <Button label="OK" icon="pi pi-check" @click="positiveConfirmation" class="p-button-text" autofocus />
    </template>
  </Dialog>

  <Dialog header="Сохранение" class="border" v-model:visible="displaySaveDialog" :style="{width: '350px'}" :modal="true" :showHeader="false">
      <h3>Выберете время сохранения документа</h3>
      <div class="field-radiobutton">
        <RadioButton id="time1" name="choseTime" value="dayStart" v-model="salectedSaveTime" />
        <label for="time1">сохранить в начало дня</label>
      </div>
      <div v-if="type == 'update' && disabledCurrentTime == false" class="field-radiobutton">
        <RadioButton id="time2" name="choseTime" value="currentTime" v-model="salectedSaveTime"  :disabled="disabledCurrentTime"/>
        <label for="time2">сохранить текущее время документа</label>
      </div>
      <div class="field-radiobutton">
        <RadioButton id="time3" name="choseTime" value="dayEnd" v-model="salectedSaveTime" />
        <label for="time3">сохранить в конец дня</label>
      </div>
    <template #footer>
      <Button label="Отмена" icon="pi pi-times" @click="closeSaveDocDialog" class="p-button-text" />
      <Button label="Сохранить" icon="pi pi-check" @click="saveDocument" class="p-button-text" autofocus />
    </template>
  </Dialog>

</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import DocTabs from '@/components/menus/DocTabs';
import DocRedactor from '@/components/DocRedactor.vue';
import Document from '@/components/Document.vue';
import MainMenu from '@/components/menus/MainMenu.vue';
import OverlayPanel from 'primevue/overlaypanel';
import Menu from 'primevue/menu';
import Calendar from 'primevue/calendar';
import {DocumentType, Property} from '@/js/Constants';
import RadioButton from 'primevue/radiobutton';
import {FilterMatchMode} from 'primevue/api';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import TriStateCheckbox from 'primevue/tristatecheckbox';

export default {
    name: 'DocContent',
    components: {
      DataTable,
      Column,
      Button,
      Dialog,
      DocTabs,
      DocRedactor,
      Document,
      MainMenu,
      OverlayPanel,
      Menu,
      Calendar,
      RadioButton,
      InputText,
      MultiSelect,
      TriStateCheckbox
    },
    props: {
        filter: String,
    },
    data() {
      return {
        user: null,
        displayDocument: false,
        docId: 0,
        type: String,
        header: String,
        selectedProduct: null,
        showDialogHeader: false,
        docRedactor: Boolean,
        docType: null,
        data: null,
        displayConfirmation: false,
        displaySaveDialog: false,
        holdLable: '',
        confirmationMessage: '',
        confirmationType: '',
        buttonNoEnabled: true,
        deleteLable: 'Удалить',
        firstDate: null,
        lastDate: null,
        DocumentType: DocumentType,
        disabledHoldButton: false,
        disabledSaveButton: false,
        startPeriod: null,
        menuModel: [],
        salectedSaveTime: 'dayEnd',
        disabledCurrentTime: false,
        closeDocAfterSave: true,
        quickSave : false,
        isMobile: Boolean,
        isAdmin: false,
        isAccountant: false,
        isMoveDoc: false,
        holdDoc: false,
        toltip: 'Начните набирать текст для поиска',
        filters: {
          'is_hold': {value: null, matchMode: FilterMatchMode.EQUALS},
          'is_payed': {value: null, matchMode: FilterMatchMode.EQUALS},
          'doc_type': {value: null, matchMode: FilterMatchMode.IN},
          'supplier.name': {value: null, matchMode: FilterMatchMode.CONTAINS},
          'storage_from.name': {value: null, matchMode: FilterMatchMode.CONTAINS},
          'storage_to.name': {value: null, matchMode: FilterMatchMode.CONTAINS},
          'author.name': {value: null, matchMode: FilterMatchMode.STARTS_WITH}
        }, 
        tableScrollHeight: '600px'
      };
    },
    computed: {
      documents() {
        return this.$store.state.ds.documents
      },
      currentDocument() {
        return this.$store.state.ds.document
      },
      success() {
        return this.$store.state.success
      },
      docTypes() {
        return this.$store.state.cs.docTypes
      },
      docTypeFilters() {
        return this.$store.state.cs.docTypeFilters
      },
      choosenDocFilters() {
        return this.$store.state.ss.choosenDocFilters
      },
      docFilterTypes() {
        return this.$store.state.ss.docFilterTypes
      },
      startDate() {
        return this.$store.state.ds.startDate;
      },
      endDate() {
        return this.$store.state.ds.endDate;
      },
      exsistNotHoldenDocs() {
        return this.$store.state.ds.exsistNotHoldenDocs;
      },
      period() {
        return this.$store.state.ss.period;
      },
      blockTime() {
        return this.$store.state.ss.blockTime;
      },
      systemSettingMap() {
        return this.$store.state.ss.systemSettingMap;
      },
      newDocId() {
        return this.$store.state.ds.newDocId;
      },
      hasRalative() {
        return this.$store.state.ds.hasRalative;
      }
    },
    mounted() {
      this.firstDate = this.$store.state.ds.startDate;
      this.lastDate = this.$store.state.ds.endDate;
      this.$store.dispatch('getDocuments', this.filter)
      this.user = JSON.parse(localStorage.getItem('user'));
      if(this.user.role == 'ADMIN') {
        this.isAdmin = true;
      }
      if(this.user.role == 'ACCOUNTANT') {
        this.isAccountant = true;
      }
      if(this.period) {
        this.startPeriod = new Date(this.period.start_date);
      }
      this.salectedSaveTime = 'dayEnd';
      this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    watch: {
      documents() {
        this.$store.dispatch('getBlockTime')
      },
      choosenDocFilters(val) {
        this.filters.doc_type.value = (this.filter == '' && val.length > 0) ? val : null;
      },
      period(val) {
        this.startPeriod = new Date(val.start_date);
      },
      filter(val) {
        this.$store.dispatch('getDocuments', val);
        // this.$store.dispatch('getBlockTime')
        this.filters.doc_type.value = (this.filter == '' && this.choosenDocFilters.length > 0) ? this.choosenDocFilters : null;

      },
      success() {
        this.$store.dispatch('getDocuments', this.filter);
      },
      currentDocument(val) {
        this.holdLable = val.is_hold? 'Отменить проведение' : (val.doc_type == this.DocumentType.MOVEMENT_DOC? 'Подтвердить получение' : 'Провести');
        this.isMoveDoc = val.doc_type == this.DocumentType.MOVEMENT_DOC? false : true;
        // if(val.date_time < this.startPeriod || val.date_time <= this.blockTime) {
        if(this.blockDocs(val)) {
          this.disabledHoldButton = true;
          this.disabledSaveButton = true;
        } else {
          this.disabledHoldButton = false;
          this.disabledSaveButton = false;
        }
        if(this.holdDoc == true) {
          this.holdDocument();
          this.holdDoc = false;
        }
        if(val.doc_type == DocumentType.INVENTORY_DOC) {
          this.$store.dispatch('checkRelativeDocuments', val.id);
        }
      },
      confirmationType(val) {
        this.buttonNoEnabled = true;
        if(val == 'hold') {
          this.confirmationMessage = 'Провести документ?';
        } else if(val == 'save') {
          this.confirmationMessage = 'save';
        } else if(val == 'delete') {
          this.confirmationMessage = 'Удалить документ?';
        } else if(val == 'unDelete') {
          this.confirmationMessage = 'Отменить удаление документа?';
        } else if(val == 'price') {
          this.buttonNoEnabled = false;
          this.confirmationMessage = 'Для проведения заполните все цены не составных позиций';
        } else if(val == 'serialHold') {
          if(this.currentDocument.is_hold == true) {
            this.confirmationMessage = 'После этого документа есть другие проведенные документы. Отменить их проведение?';
          } else {
            this.confirmationMessage = 'Есть более ранние не проведенные документы. Провести их?';
          }
        } else if(val == 'choseTime') {
          this.confirmationMessage = 'Выберете время сохранения документа'
        } 
      },
      startDate(val) {
        this.firstDate = val;
      },
      endDate(val) {
        this.lastDate = val;
      },
      exsistNotHoldenDocs() {
        this.confirmationType = 'serialHold';
        this.displayConfirmation = true;
      },
      type(val) {
        if(val == 'update') {
          this.salectedSaveTime = 'currentTime';
        } else {
          this.salectedSaveTime = 'dayEnd';
        }
      }, 
      newDocId(val) {
        this.currentDocument.id = val;
      },
      hasRalative(value) {
        console.log(value)
        this.disabledHoldButton = !value;
      }
    },
	methods: {
    blockDocs(value) {
      return (value.date_time < this.startPeriod 
                || (value.date_time <= this.blockTime && this.systemSettingMap.get(Property.DOC_BLOCK_ENABLE) == 1));
    },
    onDocTypeFilterChange(event) {
      let choosenTypes = event.value;
      let settings = this.docFilterTypes
          .filter(setting => choosenTypes.includes(setting.name))
          .map(setting => {
            let value = {'type': setting.type, 'property': 1};
            return value;
          })
      this.$store.dispatch('setDocTypeFilterProperties', [this.user, settings]);
    },
    getName(value) {
      if(value) {
        return value.name;
      }
    },
    iconClass(data) {
      let icon;
      let color;
      if(data.is_hold) {
        icon = "pi-check-circle";
        color = "true-icon";
      } else if(!data.is_hold) {
        icon = "pi-circle";
        color = "neutral-icon";
      }
      if(data.is_deleted) {
        icon = "pi-times-circle";
        color = "false-icon";
      }
      return color + " " + icon;
    },
    payedIconClass(data) {
      if(data.is_payed) {
        return "true-icon pi-check";
      }
    },
    disabledClass(data) {
      return this.blockDocs(data) ? 'disabled': null;
    },
    disableHoldButton() {
      this.disabledHoldButton = true;
    },
    disableSaveButton(value) {
      this.disabledSaveButton = value;
    },
    disableCurrentTime(){
      this.disabledCurrentTime = true;
      this.salectedSaveTime = 'dayEnd';
    },
    setStartDate(date) {
      this.$store.dispatch('setStartDate', date)
      if(this.firstDate <= this.lastDate) {
        this.$store.dispatch('getDocuments', this.filter);
      }
    },
    setEndDate(date) {
      this.$store.dispatch('setEndDate', date)
      if(this.firstDate <= this.lastDate) {
        this.$store.dispatch('getDocuments', this.filter);
      }
    },
    getToolTipText(doc) {
      if(doc.is_hold) {
        return 'проведен';
      } else if(doc.is_deleted) {
        return 'удален';
      } else {
        return 'не проведен';
      }
    },
    getPayedToolTip(doc) {
      if(doc.is_payed) return "оплачен";
    },
    toggleModalMenu(event, data) {
      this.data = data;
      this.menuModel = [];
      if(data.doc_type != DocumentType.PERIOD_REST_MOVE_DOC) {
        this.menuModel.push({
          label: 'Копировать', icon: 'pi pi-copy',
          command: () => {this.openCopyDocumentRedactor(this.data);}
        });
      }
      if(this.user.role == 'ADMIN' || data.author.id == this.user.id) {
        if(!this.blockDocs(data) ) {
          this.menuModel.push({
            label: this.data.is_hold? "Отменить проведение" : "Провести", 
            icon: 'pi pi-check-circle',
            command: () => {this.holdDocumentFromModalMenu(this.data);}
          });
        }
      }
      if(this.user.role == 'ADMIN' || data.author.id == this.user.id) {
        if(!this.blockDocs(data)) {
          this.menuModel.push({
            label: 'Изменить', icon: 'pi pi-pencil',
            command: () => this.openUpdateDocumentRedactor(this.data)
          });
          let deleteLable = '';
          if(data.is_deleted) {
            deleteLable = 'Отменить'
            this.confirmationType = 'unDelete';
          } else {
            deleteLable = 'Удалить'
            this.confirmationType = 'delete';
          }
          this.menuModel.push({
            label: deleteLable, icon: 'pi pi-times',
            command: () => this.openConfirmation(data)
          });
        }
      }
      if((this.user.role == 'ADMIN' || this.user.role == 'ACCOUNTANT')
            && data.doc_type == DocumentType.POSTING_DOC) {
        let payItem;
        if(data.is_payed == false) {
          payItem = {
            label: 'Оплатить', icon: 'pi pi-check',
            command: () => this.addPaymentDoc(this.data)
          };
        } else {
          payItem = {
            label: 'Удалить оплату', icon: 'pi pi-check',
            command: () => this.deletePaymentDoc(this.data)
          };
        }
        this.menuModel.push(payItem);
      }
      if(this.menuModel.length > 0) {
        this.$refs.menu.toggle(event);
      }
    },
    addPaymentDoc(value) {
      this.$store.dispatch('addPaymentDoc', value.id);
    },
    deletePaymentDoc(value) {
      this.$store.dispatch('deletePaymentDoc', value.id);
    },
    formatCurrency(value) {
      return value.toLocaleString('re-RU', {style: 'currency', currency: 'RUB'});
    },
    deleteDocument() {
      this.$store.dispatch('deleteDocument', this.data);
      this.closeConfirmation();
    },
		openDocument(value) {
      this.docRedactor = false;
			this.docId = value.data.id;
			this.displayDocument = true;
		},
    openBaseDoc(value) {
      console.log("openBaseDoc", value);
      // this.docRedactor = false;
			// this.docId = value;
			// this.displayDocument = true;
    },
    openNewDocument(value) {
      this.docRedactor = true;
			this.docType = value;
			this.docId = 0;
      this.type = 'add';
			this.displayDocument = true;
    },
    openRequestDocRedactor(value) {
      this.docRedactor = true;
			this.docType = this.DocumentType.REQUEST_DOC;
			this.docId = value.id;
      this.type = 'copyFromRequestDoc';
			this.displayDocument = true;
    },
		openUpdateDocumentRedactor(value) {
      this.docRedactor = true;
			this.docId = value.id;
      this.type = 'update';
			this.displayDocument = true;
		},
		openCopyDocumentRedactor(value) {
      this.docRedactor = true;
			this.docId = value.id;
      this.type = 'copy';
			this.displayDocument = true;
		},
		closeDocument() {
			this.displayDocument = false;
      this.$store.dispatch('setCurrentDocumentNull');
		},
    choseSavingTime() {
        this.confirmationType = 'choseTime';
        this.displayConfirmation = true;
      
    },
		saveDocument() {
      this.displaySaveDialog = false;
      if(this.type == 'update') {
        this.$store.dispatch('updateDocument', [this.currentDocument, this.salectedSaveTime]);
      }	else {
        this.$store.dispatch('addDocument', [this.currentDocument, this.salectedSaveTime, this.quickSave]);
        this.quickSave = false;
      }	
      if(this.currentDocument.is_hold == false && this.systemSettingMap.get(Property.HOLDING_DIALOG_ENABLE) == 1) {
        this.confirmationType = 'hold';
        this.displayConfirmation = true;
      } else {
        this.displayDocument = !this.closeDocAfterSave;
        this.closeDocAfterSave = true;
      }
    },
    quickSaveDoc() {
      if(this.type == 'add') {
        this.closeDocAfterSave = false;
        this.quickSave = true;
        this.displaySaveDialog = true;
      } else {
        this.$store.dispatch('updateDocument', [this.currentDocument, 'currentTime']);
      }
    },
    serialHoldDocument() {
      this.$store.dispatch('serialHoldDocument', this.currentDocument.id);
      this.displayConfirmation = false;
    },
    holdDocument() {
      this.displayConfirmation = false;
      if(!this.checkQuantity()) {
        return;
      }
      if(this.checkPrices()) {
        this.$store.dispatch('holdDocument', [this.currentDocument.id, this.currentDocument.is_hold]);
        this.displayDocument = false;
      } else {
        this.confirmationType = 'price';
        this.displayConfirmation = true;
      }
    },
    holdDocumentFromModalMenu(data) {
      this.holdDoc = true;
      this.$store.dispatch('getDocument', [data.id, null, false]);
    },
    checkQuantity() {
      if(this.currentDocument.doc_type == DocumentType.POSTING_DOC 
          || this.currentDocument.doc_type == DocumentType.RECEIPT_DOC 
          || this.currentDocument.doc_type == DocumentType.MOVEMENT_DOC
          || this.currentDocument.doc_type == DocumentType.WRITE_OFF_DOC) {
        let nullItems = this.currentDocument.doc_items
              .filter(item => item.quantity == 0)
              .map(item => item.item_name)
              .join(", ");
        if(nullItems.length > 0) {
          const subject = "Документ " + this.currentDocument.doc_type + " нельзя проводить с нулевыми количествами"
          this.$toast.add({severity:'warn', summary: subject, detail: nullItems, life: 5000});
          return false;
        }
      }
      return true;
    },
    checkPrices() {
      if(this.currentDocument.doc_type == this.DocumentType.INVENTORY_DOC) {
        for(let docItem of this.currentDocument.doc_items) {
          if(!docItem.children && docItem.price == 0) {
            return false;
          }
        }
      }
      return true;
    },
    chooseDocType(event) {
        this.$refs.opDocTypes.toggle(event);
    },
    addNewDocByType(type) {
      this.openNewDocument(type)
      this.$refs.opDocTypes.hide();
    },
    openConfirmation(value) {
      this.data = value;
      this.displayConfirmation = true;
    },
    closeConfirmation() {
      this.displayConfirmation = false;
			this.displayDocument = false;
      this.confirmationType = '';
    },
    positiveConfirmation() {
      if(this.confirmationType == 'delete' || this.confirmationType == 'unDelete') {
        this.deleteDocument();
      } else if(this.confirmationType == 'hold') {
        this.holdDocument();
      } else if(this.confirmationType == 'serialHold') {
        this.serialHoldDocument();
      } else {
        this.displayConfirmation = false;
      }
      this.confirmationType = '';
    },
    openSaveDocDialog() {
      this.displaySaveDialog = true;
    },
    closeSaveDocDialog() {
      this.displaySaveDialog = false;
      this.quickSave = false;
    },
    resetDocuments() {
      this.$store.dispatch('getDocuments', this.filter);
    }
	}
}

</script>
<style scoped>
  .p-dialog {
    max-width: 90%; 
    height: 90%; 
    background-color: rgb(255, 255, 255);
  }
  .scroll-table {
    height: 85%;
    height: calc(100% - 150px);
  }
  .fixed-header {
    background-color: white;
    z-index: 100;
    position: fixed;
    top: 0;
    width: 100%;
  }
  .content {
    display: flex;
    flex-direction: column;
    flex: 0 0 100%;
  }
  .mt-200 {
    margin-top: 130px;
  }
  .border {
    border: 1px solid #dee2e6;
    border-radius: 3px;
  }
  .true-icon {
    color: rgb(15, 163, 15);
  }
  .neutral-icon {
    color: rgb(73, 73, 73);
  }
  .false-icon {
    color: rgb(224, 17, 17);
  }
  .mr-2 {
    margin: 0px 20px 0px 0px;
  }
  .mb-2 {
    margin-bottom: 20px;
  }
  .mlr-1 {
    margin: 0px 10px 0px 10px;
  }
  .horizontal {
    justify-content: center;
  }
  .disabled {
    color:#b1b1b1 !important;
  }
</style>