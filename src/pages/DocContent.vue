<template>
  <MainMenu />
  <div class="content">
    <div class="flex justify-content-between mb-2">
      <DocTabs :filter="filter" />
      <Button icon="pi pi-plus" @click="chooseDocType" class="p-button-rounded p-button-secondary p-button-outlined mr-2" />
    </div>
    <div>
      <div class="border">
        <DataTable :value="documents" @row-click="openDocument" class="p-datatable-sm" stripedRows :paginator="true" :rows="10"
          v-model:selection="selectedProduct" selectionMode="single" sortField="date_time" :sortOrder="-1"
          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          :rowsPerPageOptions="[10,20,50]" responsiveLayout="scroll"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords}">
          <template #header>
            <div class="flex justify-content-end">
              <div class="horizontal">
              <span class="mlr-1">с</span>
              <Calendar id="buttonbar" v-model="firstDate" @date-select="setStartDate" dateFormat="dd.mm.yy" :showButtonBar="true" />
              <span class="mlr-1">до</span>
              <Calendar id="buttonbar" v-model="lastDate" @date-select="setEndDate" dateFormat="dd.mm.yy" :showButtonBar="true" />
              <Button icon="pi pi-angle-right" @click="resetDocuments" class="p-button-sm p-button-rounded p-button-secondary p-button-text mlr-1" />
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
          <Column field="is_hold" header="" dataType="boolean">
            <template #body="{data}"><i class="pi" :class="iconClass(data)" v-tooltip="getToolTipText(data)"></i></template>
          </Column>
          <Column field="number" header="№" sortable style="max-width:7rem">
            <template #body="{data}"><div :class="disabledClass(data)">{{data.number}}</div></template>
          </Column>
          <Column field="doc_type" header="Документ" sortable>
            <template #body="{data}"><div :class="disabledClass(data)">{{data.doc_type}}</div></template>
          </Column>
          <Column field="project.name" header="Проект" sortable >
            <template #body="{data}"><div :class="disabledClass(data)">{{data.project.name}}</div></template>
          </Column>
          <Column field="date_time" header="Время" sortable dataType="date">
            <template #body="{data}">
              <div :class="disabledClass(data)">
                {{new Date(data.date_time).toLocaleDateString('ru-RU', {day: '2-digit', month: '2-digit', year: 'numeric'})}}
              </div>
            </template>
          </Column>
          <Column field="storage_from.name" header="со склада" sortable>
            <template #body="{data}"><div :class="disabledClass(data)">{{getName(data.storage_from)}}</div></template>
          </Column>
          <Column field="storage_to.name" header="на склад" sortable>
            <template #body="{data}"><div :class="disabledClass(data)">{{getName(data.storage_to)}}</div></template>
          </Column>
          <Column field="amount" header="Сумма" sortable>
            <template #body="{data}"><div :class="disabledClass(data)">{{formatCurrency(data.amount)}}</div></template>
          </Column>
          <Column field="author.name" header="Автор" style="max-width:9rem" sortable >
            <template #body="{data}"><div :class="disabledClass(data)">{{getName(data.author)}}</div></template>
          </Column>
          <Column style="max-width:3rem">
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
    </div>
  </div>

  <Dialog v-model:visible="displayDocument" :style="{width: '90%'}" :modal="true"  :showHeader="showDialogHeader">
    <div v-if="docRedactor">
      <DocRedactor :docId="docId" @disable-hold-button="disableHoldButton" @disable-save-button="disableSaveButton" :type="type" :docType="docType"/>
    </div>
    <div v-else>
      <Document :docId="docId" @copy-to-request-doc="openRequestDocRedactor" @open-update-doc="openUpdateDocumentRedactor" @open-copy-doc="openCopyDocumentRedactor" />
    </div>
    <template #footer>
      <Button label="Закрыть" icon="pi pi-times" @click="closeDocument" class="p-button-sm p-button-secondary p-button-text"/>
      <Button v-if="docRedactor" label="Сохранить" icon="pi pi-check" @click="openSaveDocDialog" class="p-button-sm p-button-rounded p-button-secondary" autofocus :disabled="disabledSaveButton"/>
      <Button :label="holdLable" icon="pi pi-check" @click="holdDocument" class="p-button-sm p-button-rounded p-button-secondary" :disabled="disabledHoldButton" />
    </template>
  </Dialog>

  <OverlayPanel ref="opDocTypes">
    <div v-for="docType in docTypes" :key="docType">
     <Button class="p-button-secondary p-button-text" @click="addNewDocByType(docType.name)">{{docType.name}}</Button>
    </div>
  </OverlayPanel>

  <Menu ref="menu" :model="menuModel" :popup="true" />

  <Dialog header="Подтверждение" class="border" v-model:visible="displayConfirmation" :style="{width: '300px'}" :modal="true" :showHeader="false">
      <h3>{{confirmationMessage}}</h3>
    <template #footer>
      <Button v-if="buttonNoEnabled" label="Нет" icon="pi pi-times" @click="closeConfirmation" class="p-button-text" />
      <Button label="OK" icon="pi pi-check" @click="positiveConfirmation" class="p-button-text" autofocus />
    </template>
  </Dialog>

  <Dialog header="Сохраение" class="border" v-model:visible="displaySaveDialog" :style="{width: '350px'}" :modal="true" :showHeader="false">
      <h3>Выберете время сохранения документа</h3>
      <div class="field-radiobutton">
        <RadioButton id="time1" name="choseTime" value="dayStart" v-model="salectedSaveTime" />
        <label for="time1">сохранить в начало дня</label>
      </div>
      <div v-if="type == 'update'" class="field-radiobutton">
        <RadioButton id="time2" name="choseTime" value="currentTime" v-model="salectedSaveTime" />
        <label for="time2">сохранить текущее время докумнта</label>
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
import DocTabs from '@/components/DocTabs';
import DocRedactor from '@/components/DocRedactor.vue';
import Document from '@/components/Document.vue';
import MainMenu from '@/components/MainMenu.vue';
import OverlayPanel from 'primevue/overlaypanel';
import Menu from 'primevue/menu';
import Calendar from 'primevue/calendar';
import {DocumentType} from '@/js/Constants';
import RadioButton from 'primevue/radiobutton';

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
      RadioButton
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
        items: [
        {
          label: "Документы",
          icon: "pi pi-fw pi-file",
          to: '/documents/posting'
        },
        {
          label: "Номенклатура",
          icon: "pi pi-fw pi-shopping-bag",
          to: "/items"
        },
        {
          label: "Пользователи",
          icon: "pi pi-fw pi-users",
          to: "/users"
        },
        {
          label: "Настройки",
          icon: "pi pi-fw pi-cog",
          to: "/settings"
        },
      ],
      };
    },
    computed: {
      documents() {
        return this.$store.state.ds.documents
      },
      document() {
        return this.$store.state.ds.document
      },
      success() {
        return this.$store.state.success
      },
      docTypes() {
        return this.$store.state.cs.docTypes
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
      }
    },
    mounted() {
      this.firstDate = this.$store.state.ds.startDate;
      this.lastDate = this.$store.state.ds.endDate;
      this.$store.dispatch('getDocuments', this.filter)
      this.user = JSON.parse(localStorage.getItem('user'));
      if(this.period) {
        this.startPeriod = new Date(this.period.start_date);
      }
      this.salectedSaveTime = 'dayEnd';
    },
    watch: {
      period(val) {
        this.startPeriod = new Date(val.start_date);
      },
      filter(val) {
        this.$store.dispatch('getDocuments', val);
      },
      success() {
        this.$store.dispatch('getDocuments', this.filter);
      },
      document(val) {
        this.holdLable = val.is_hold? 'Отменить проведение' : (val.doc_type == this.DocumentType.MOVEMENT_DOC? 'Подтвердить получение' : 'Провести');
        if(val.date_time < this.startPeriod) {
          this.disabledHoldButton = true;
          this.disabledSaveButton = true;
        } else {
          this.disabledHoldButton = false;
          this.disabledSaveButton = false;
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
          this.confirmationMessage = 'Для проведения заполните все цены в документе';
        } else if(val == 'serialHold') {
          if(this.document.is_hold == true) {
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
      }
    },
	methods: {
    aaa() {
        this.$store.dispatch('getAAA');
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
      if(data.date_time < this.startPeriod) {
        color = "disabled";
      }
      return color + " " + icon;
    },
    disabledClass(data) {
      return data.date_time < this.startPeriod? 'disabled': null;
    },
    disableHoldButton() {
      this.disabledHoldButton = true;
    },
    disableSaveButton(value) {
      this.disabledSaveButton = value;
    },
    setStartDate(date) {
      this.$store.dispatch('setStartDate', date)
    },
    setEndDate(date) {
      this.$store.dispatch('setEndDate', date)
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
    toggleModalMenu(event, data) {
      this.data = data;
      this.menuModel = [];

      let item = {
        label: 'Копировать', icon: 'pi pi-copy',
        command: () => {this.openCopyDocumentRedactor(this.data);}
      };
      this.menuModel.push(item);
      if(this.user.role == 'ADMIN' || data.author.id == this.user.id) {
        if(data.date_time >= this.startPeriod ) {
          let item = {
            label: 'Изменить', icon: 'pi pi-pencil',
            command: () => this.openUpdateDocumentRedactor(this.data)
          };
          this.menuModel.push(item);
          let deleteLable = '';
          if(data.is_deleted) {
            deleteLable = 'Отменить'
            this.confirmationType = 'unDelete';
          } else {
            deleteLable = 'Удалить'
            this.confirmationType = 'delete';
          }
          let delItem = {
            label: deleteLable, icon: 'pi pi-times',
            command: () => this.openConfirmation(data)
          };
          this.menuModel.push(delItem);
          }
      }
      this.$refs.menu.toggle(event);
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
      this.type = 'copyToRequestDoc';
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
		},
    choseSavingTime() {
        this.confirmationType = 'choseTime';
        this.displayConfirmation = true;
      
    },
		saveDocument() {
      this.displaySaveDialog = false;
      if(this.type == 'update') {
        this.$store.dispatch('updateDocument', [this.document, this.salectedSaveTime]);
      }	else {
        this.document.id = 0;
        this.$store.dispatch('addDocument', [this.document, this.salectedSaveTime]);
      }	
      if(this.document.is_hold == false) {
        this.confirmationType = 'hold';
        this.displayConfirmation = true;
      } else {
        this.displayDocument = false;
      }
    },
    serialHoldDocument() {
      this.$store.dispatch('serialHoldDocument', this.document.id);
      this.displayConfirmation = false;
    },
    holdDocument() {
      this.displayConfirmation = false;
      if(this.checkPrices()) {
        this.$store.dispatch('holdDocument', this.document.id);
        this.displayDocument = false;
      } else {
        this.confirmationType = 'price';
        this.displayConfirmation = true;
      }
    },
    checkPrices() {
      if(this.document.doc_type == this.DocumentType.INVENTORY_DOC) {
        for(let docItem of this.document.doc_items) {
          if(docItem.price == 0) {
            return false;
          }
        }
      }
      return true;
    },
    logout() {
      this.$store.dispatch('logout');
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
    },
    resetDocuments() {
      this.$store.dispatch('getDocuments', this.filter);
    }
	}
}

</script>
<style scoped>
  .content {
    display: flex;
    flex-direction: column;
    flex: 0 0 100%;
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