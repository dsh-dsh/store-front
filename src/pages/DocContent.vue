<template>
  <Toolbar class="top-menu">
    <template #end>
      <Button label="logout" @click="logout()" class="p-button-sm p-button-rounded" />
    </template>
  </Toolbar>
  <div class="conteiner">
  <MainMenu />
  <div class="content">
	<div>
		<Dialog v-model:visible="displayDocument" :style="{width: '80vw'}" :modal="true"  :showHeader="showDialogHeader">
      <div v-if="docRedactor">
        <DocRedactor :docId="docId" :type="type"/>
      </div>
      <div v-else>
        <Document :docId="docId" @open-update-doc="openUpdateDocumentRedactor" @open-copy-doc="openCopyDocumentRedactor" />
      </div>
      <template #footer>
        <Button label="Закрыть" icon="pi pi-times" @click="closeDocument" class="p-button-sm p-button-secondary p-button-text"/>
        <Button v-if="docRedactor" label="Сохранить" icon="pi pi-check" @click="saveDocument" class="p-button-sm p-button-rounded p-button-secondary" autofocus />
      </template>
    </Dialog>
	</div>
    <div class="buttonContainer">
      <DocTabs :filter="filter" />
    </div>
    <div>
      <div class="border">
        <DataTable :value="documents" @row-click="openDocument" class="p-datatable-sm" stripedRows :paginator="true" :rows="10"
          v-model:selection="selectedProduct" selectionMode="single"
          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          :rowsPerPageOptions="[10,20,50]" responsiveLayout="scroll"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords}">
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
      Toolbar
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
        docRedactor: Boolean
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
      this.$store.dispatch('updateDocument', this.document)		
    },
    logout() {
      this.$store.dispatch('logout');
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
	color: green;
  }
  .false-icon {
	color: red;
  }
  .mr-2 {
	margin: 0px 20px 0px 0px;
  }
  .logout {
    font-weight: bold;
    color: #000000;
    background: #e3f2fd;
    border: 3px solid #607d8b;
  }
</style>