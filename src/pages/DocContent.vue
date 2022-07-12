<template>
  <Toolbar class="top-menu">
    <template #end>
      <Button label="logout" @click="logout()" class="p-button-sm p-button-rounded" />
    </template>
  </Toolbar>
  <div class="conteiner">
  <MainMenu />
  <div class="content">
    <div class="flex justify-content-between mb-2">
      <DocTabs :filter="filter" />
      <Button label="Новый документ" @click="chooseDocType" class="p-button-rounded p-button-secondary p-button-outlined" />
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
            <template #body="{data}">
              <i class="pi" :class="{'true-icon pi-check-circle': data.is_hold, 'neutral-icon pi-circle': !data.is_hold, 'false-icon pi-times-circle': data.is_deleted}"
               v-tooltip="getToolTipText(data)"></i>
            </template>
          </Column>
          <Column field="number" header="№" sortable style="max-width:3rem" />
          <Column field="doc_type" header="Документ" sortable />
          <Column field="project.name" header="Проект" sortable />
          <Column field="date_time" header="Время" sortable dataType="date">
            <template #body="{data}">
              {{new Date(data.date_time).toLocaleDateString('ru-RU', {day: '2-digit', month: '2-digit', year: 'numeric'})}}
            </template>
          </Column>
          <Column field="storage_from.name" header="со склада" sortable />
          <Column field="storage_to.name" header="на склад" sortable />
          <Column field="amount" header="Сумма" sortable>
            <template #body="slotProps">
              {{formatCurrency(slotProps.data.amount)}}
            </template>
          </Column>
          <Column field="author.name" header="Автор" style="max-width:9rem" sortable />
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
  </div>

  <Dialog v-model:visible="displayDocument" :style="{width: '80vw'}" :modal="true"  :showHeader="showDialogHeader">
    <div v-if="docRedactor">
      <DocRedactor :docId="docId" :type="type" :docType="docType"/>
    </div>
    <div v-else>
      <Document :docId="docId" @copy-to-request-doc="openRequestDocRedactor" @open-update-doc="openUpdateDocumentRedactor" @open-copy-doc="openCopyDocumentRedactor" />
    </div>
    <template #footer>
      <Button label="Закрыть" icon="pi pi-times" @click="closeDocument" class="p-button-sm p-button-secondary p-button-text"/>
      <Button v-if="docRedactor" label="Сохранить" icon="pi pi-check" @click="saveDocument" class="p-button-sm p-button-rounded p-button-secondary" autofocus />
      <Button :label="holdLable" icon="pi pi-check" @click="holdDocument" class="p-button-sm p-button-rounded p-button-secondary" />
      <!-- <Button label="check Unholden Docs" icon="pi pi-check" @click="checkUnholdenDocs" class="p-button-sm p-button-rounded p-button-secondary" /> -->
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
import Toolbar from 'primevue/toolbar';
import OverlayPanel from 'primevue/overlaypanel';
import Menu from 'primevue/menu';
import Calendar from 'primevue/calendar';
import {DocumentType} from '@/js/Constants';

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
      Toolbar,
      OverlayPanel,
      Menu,
      Calendar
    },
    props: {
        filter: String,
    },
    data() {
      return {
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
        holdLable: '',
        confirmationMessage: '',
        confirmationType: '',
        buttonNoEnabled: true,
        deleteLable: 'Удалить',
        firstDate: null,
        lastDate: null,
        DocumentType: DocumentType,
        menuModel: [
          {label: 'Изменить', icon: 'pi pi-pencil',
            command: () => {
              this.openUpdateDocumentRedactor(this.data);
            }},
          {label: 'Копировать', icon: 'pi pi-copy',
            command: () => {
              this.openCopyDocumentRedactor(this.data);
            }},
          {label: this.deleteLable, icon: 'pi pi-times',
            command: () => {
              this.confirmationType = 'delete';
              this.openConfirmation(this.data)
            }}
        ]
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
      }
    },
    mounted() {
      this.firstDate = this.$store.state.ds.startDate;
      this.lastDate = this.$store.state.ds.endDate;
      this.$store.dispatch('getDocuments', this.filter)
    },
    watch: {
      filter(val) {
        this.$store.dispatch('getDocuments', val)
      },
      success() {
        this.$store.dispatch('getDocuments', this.filter)
      },
      document(val) {
        this.holdLable = val.is_hold? 'Отменить проведение' : (val.doc_type == this.DocumentType.MOVEMENT_DOC? 'Подтвердить получение' : 'Провести');
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
          this.confirmationMessage = 'Есть более ранние не проведенные документы. Провести их?';
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
      }
    },
	methods: {
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
      this.menuModel.pop();
      let deleteLable = '';
      if(data.is_deleted) {
        deleteLable = 'Отменить'
        this.confirmationType = 'unDelete';
      } else {
        deleteLable = 'Удалить'
        this.confirmationType = 'delete';
      }
      let delItem = {label: deleteLable, icon: 'pi pi-times',
            command: () => {
              this.openConfirmation(data)
            }}
      this.menuModel.push(delItem);
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
		saveDocument() {
      if(this.type == 'update') {
        this.$store.dispatch('updateDocument', this.document);
      }	else {
        this.document.id = 0;
        this.$store.dispatch('addDocument', this.document);
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
        console.log(this.document.doc_items)
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
    },
    resetDocuments() {
      this.$store.dispatch('getDocuments', this.filter);
    }
	}
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
  .buttonContainer {
    display: flex;
    margin-bottom: 8px;
  }
  .content {
    display: flex;
    flex-direction: column;
    flex: 0 0 80%;
    margin-left: 30px;
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
  .logout {
    font-weight: bold;
    color: #000000;
    background: #e3f2fd;
    border: 3px solid #607d8b;
  }
</style>