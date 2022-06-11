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
          v-model:selection="selectedProduct" selectionMode="single"
          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          :rowsPerPageOptions="[10,20,50]" responsiveLayout="scroll"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords}">
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
              <i class="pi" :class="{'true-icon pi-check-circle': data.is_hold, 'false-icon pi-circle': !data.is_hold}"></i>
            </template>
          </Column>
          <Column field="number" header="Номер" :sortable="true" />
          <Column field="type" header="Документ" :sortable="true" />
          <Column field="project.name" header="Проект" :sortable="true" />
          <Column field="time" header="Время" :sortable="true" />
          <Column field="storageFrom.name" header="Склад" :sortable="true" />
          <Column field="amount" header="Сумма" />
          <Column field="author.name" header="Автор" />
          <Column :exportable="false" style="min-width:8rem">
            <template #body="{data}">
                <Button icon="pi pi-pencil" class="p-button-rounded p-button-secondary p-button-outlined mr-2" @click="openUpdateDocumentRedactor(data)" />
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
      <Document :docId="docId" @open-update-doc="openUpdateDocumentRedactor" @open-copy-doc="openCopyDocumentRedactor" />
    </div>
    <template #footer>
      <Button label="Закрыть" icon="pi pi-times" @click="closeDocument" class="p-button-sm p-button-secondary p-button-text"/>
      <Button v-if="docRedactor" label="Сохранить" icon="pi pi-check" @click="saveDocument" class="p-button-sm p-button-rounded p-button-secondary" autofocus />
    </template>
  </Dialog>
  <OverlayPanel ref="opDocTypes">
    <div v-for="docType in docTypes" :key="docType">
     <Button class="p-button-secondary p-button-text" @click="addNewDocByType(docType.name)">{{docType.name}}</Button>
    </div>
  </OverlayPanel>
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
      OverlayPanel
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
        docType: null 
      };
    },
    computed: {
      documents() {
        return this.$store.state.documents
      },
      document() {
        return this.$store.state.document
      },
      success() {
        return this.$store.state.success
      },
      docTypes() {
        return this.$store.state.docTypes
      }

    },
    mounted() {
      this.$store.dispatch('getDocuments', this.filter)
    },
    watch: {
      filter(val) {
        this.$store.dispatch('getDocuments', val)
      },
      success() {
        this.$store.dispatch('getDocuments', this.filter)
      }
    },
	methods: {
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
			this.displayDocument = false;
      this.document.time = formatDate(this.document.time);
      if(this.document.check_info) {
        this.document.check_info.date_time = formatDate(this.document.check_info.date_time);
      }
      if(this.type == 'update') {
        this.$store.dispatch('updateDocument', this.document);
      }	else {
        this.document.id = 0;
        this.$store.dispatch('addDocument', this.document);
      }	
    },
    logout() {
      this.$store.dispatch('logout');
    },
    chooseDocType(event) {
        this.$refs.opDocTypes.toggle(event);
    },
    addNewDocByType(type) {
      console.log(type)
      this.openNewDocument(type)
      this.$refs.opDocTypes.hide();
    }
	}
}

function setLidingNull(val) {
  if(val < 10) {
    return "0" + val;
  } else {
    return val;
  }
}

function formatDate(date) {
  if(typeof(date) === "object") { 
  let strDate = setLidingNull(date.getDate()) + "." + setLidingNull(date.getMonth()+1) + "." + date.getFullYear() + " " 
      + setLidingNull(date.getHours()) + ":" + setLidingNull(date.getMinutes()) + ":" + setLidingNull(date.getSeconds());
    return strDate;
  }
  return date;
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
    color: green;
  }
  .false-icon {
    color: red;
  }
  .mr-2 {
    margin: 0px 20px 0px 0px;
  }
  .mb-2 {
    margin-bottom: 20px;
  }
  .logout {
    font-weight: bold;
    color: #000000;
    background: #e3f2fd;
    border: 3px solid #607d8b;
  }
</style>