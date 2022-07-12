<template> 
    <br><br>
    <div v-if="doc.author && doc.project">

      <div class="formgrid grid">

        <div class="field col-12 md:col-12">
          <h4 class="mb-2">Документ  {{ doc.doc_type }}</h4>
        </div>

        <div class="field col-12 md:col-5 flex justify-content-between numberdatecard">
          <div class="mt-3 mb-3">
            <label for="number" class="label">Номер</label><br>
            <InputText id="number" type="text" class="p-inputtext smallinput" v-model="doc.number" />
          </div>
          <div class="mt-3 mb-3">
            <label for="time" class="label">Дата</label><br>
            <Calendar id="time" v-model="dateInput" dateFormat="dd.mm.yy" :showIcon="true" />
          </div>
        </div>
        <div class="field col-12 md:col-7 center right">
          <div v-if="doc.doc_type === DocumentType.INVENTORY_DOC" class="mr-5">
            <Button label="Заполнить" class="p-button-rounded p-button-secondary mr-1" @click="onFillRestClick" :disabled="disabledFillItemRest"/>
            <Button label="Создать подчиненные документы" class="p-button-rounded p-button-secondary" @click="onCreateDockClick" :disabled="disabledFillItemRest"/>
          </div>
        </div>

        <div class="field col-12 md:col-4">
          <label for="author" class="label">Автор</label><br>
          <div class="p-inputgroup"> 
            <InputText id="author" type="text" class="p-inputtext-sm" v-model="doc.author.name" />
            <Button icon="pi pi-check" class="p-button-warning" @click="onAuthorClick"/>
          </div>
        </div>
        <div class="field col-12 md:col-4">
          <label for="project" class="label">Проект</label><br>
            <div class="p-inputgroup">
              <InputText id="project" type="text" class="p-inputtext-sm" v-model="doc.project.name" />
              <Button icon="pi pi-check" class="p-button-warning" @click="onProjectClick" />
            </div>
          <!-- <Dropdown id="project" class="input" v-model="selectedProject" :options="projects" optionLabel="name" placeholder="Проект" @change="onProjectChange" /> -->
        </div>
        <div class="field col-12 md:col-4"></div>

        <div v-if="!orderDoc" class="field col-12 md:col-4">
          <div v-if="doc.storage_from">
            <label for="storageFrom" class="label">со склада</label><br>
            <div class="p-inputgroup">
              <InputText id="storageFrom" type="text" class="p-inputtext-sm" v-model="doc.storage_from.name" :disabled="disabledStorageFrom" />
              <Button icon="pi pi-check" class="p-button-warning" @click="onStorageFromClick" :disabled="disabledStorageFrom" />
            </div>
          </div>
        </div>
        <div v-if="!orderDoc" class="field col-12 md:col-4">
          <div v-if="doc.storage_to">
          <label for="storageTo" class="label">на склад</label><br>
            <div class="p-inputgroup">
              <InputText id="storageTo" type="text" class="p-inputtext-sm" v-model="doc.storage_to.name" :disabled="disabledStorageTo" />
              <Button icon="pi pi-check" class="p-button-warning" @click="onStorageToClick" :disabled="disabledStorageTo"/>
            </div>
          </div>
        </div>
        <div v-if="!orderDoc" class="field col-12 md:col-4"></div>

        <div v-if="doc.doc_type == DocumentType.POSTING_DOC" class="field col-12 md:col-4">
          <div v-if="doc.supplier">
            <label for="supplier" class="label">Поставщик</label><br>
            <div class="p-inputgroup">
              <InputText id="supplier" type="text" class="p-inputtext-sm" v-model="doc.supplier.name" :disabled="disabledSupplier" />
              <Button icon="pi pi-check" class="p-button-warning" @click="onSupplierClick"/>
            </div>
          </div>
        </div>
        <div v-if="doc.doc_type == DocumentType.POSTING_DOC" class="field col-12 md:col-4">
          <div v-if="doc.recipient">
            <label for="recipient" class="label">Получатель</label><br>
            <div class="p-inputgroup">
              <InputText id="recipient" type="text" class="p-inputtext-sm" v-model="doc.recipient.name" />
              <Button icon="pi pi-check" class="p-button-warning" @click="onRecipientClick"/>
            </div>
          </div>
        </div>
        <div v-if="doc.doc_type == DocumentType.POSTING_DOC" class="field col-12 md:col-4"></div>
        
        <div v-if="orderDoc" class="field col-12 md:col-12">
          <div v-if="doc.individual">
            <label for="individual" class="label">Физ лицо</label><br>
            <div class="p-inputgroup">
              <InputText id="individual" type="text" class="p-inputtext-sm" v-model="doc.individual.name" />
              <Button icon="pi pi-check" class="p-button-warning" @click="onIndividualClick"/>
            </div>
          </div>
        </div>

        <div v-if="orderDoc" class="field col-12 md:col-12">
          <label for="amount" class="label">сумма</label><br>
          <InputText id="amount" type="text" class="p-inputtext-sm mr-1" v-model="doc.amount" />
        </div>
      </div>
    </div>

    <div v-if="doc.check_info">
      <Divider align="left">
        <div class="inline-flex align-items-center">
          <i class="pi pi-user mr-2"></i>
          информация из чека ККМ
        </div>
      </Divider>
      <div class="formgrid grid">
        <div class="field col-12 md:col-3">
          <label for="waiter" class="label">официант</label><br>
          <InputText id="waiter" type="text" class="p-inputtext-sm mr-1" v-model="doc.check_info.waiter" />
        </div>
        <div class="field col-12 md:col-3">
          <label for="check_number" class="label">номер чека</label><br>
          <InputText id="check_number" type="text" class="p-inputtext-sm mr-1" v-model="doc.check_info.check_number" />
        </div>
        <div class="field col-12 md:col-3">
          <label for="cash_register_number" class="label">номер кассы</label><br>
          <InputText id="cash_register_number" type="text" class="p-inputtext-sm mr-1" v-model="doc.check_info.cash_register_number" />
        </div>
        <div class="field col-12 md:col-3">
          <label for="amount_received" class="label">получено</label><br>
          <InputText id="amount_received" type="text" class="p-inputtext-sm mr-1" v-model="doc.check_info.amount_received" />
        </div>
        <div class="field col-12 md:col-3">
          <label for="table_number" class="label">стол</label><br>
          <InputText id="table_number" type="text" class="p-inputtext-sm mr-1" v-model="doc.check_info.table_number" />
        </div>
        <div class="field col-12 md:col-3">
          <label for="guest_number" class="label">гость</label><br>
          <InputText id="guest_number" type="text" class="p-inputtext-sm mr-1" v-model="doc.check_info.guest_number" />
        </div>
        <div class="field col-12 md:col-3">
          <label for="kkm_check_time" class="label">время</label><br>
          <Calendar id="kkm_check_time" v-model="checkDateInput" :showTime="true" :showSeconds="true" dateFormat="dd.mm.yy" disabled/>
        </div>
        <div class="field col-12 md:col-3">
        </div>
        <div class="field col-12 md:col-2">
          <label for="isReturn" class="label">возврат</label>
          <InputSwitch id="isReturn" v-model="doc.check_info.is_return" /> 
        </div>
        <div class="field col-12 md:col-2">
          <label for="isKKMChecked" class="label">пробит</label>
          <InputSwitch id="isKKMChecked" v-model="doc.check_info.is_KKM_checked" /> 
        </div>
        <div class="field col-12 md:col-2">
          <label for="is_Paid" class="label">оплачен</label>
          <InputSwitch id="is_Paid" v-model="doc.check_info.is_payed" /> 
        </div>
        <div class="field col-12 md:col-2">
          <label for="isPayedByCard" class="label">эквайринг</label>
          <InputSwitch id="isPayedByCard" v-model="doc.check_info.is_payed_by_card" /> 
        </div>
        <div class="field col-12 md:col-2">
          <label for="isDelivery" class="label">доставка</label>
          <InputSwitch id="isDelivery" v-model="doc.check_info.is_delivery" /> 
        </div>
      </div>
    </div>
    <div v-if="doc.doc_items">
      <Button icon="pi pi-plus" @click="onAddItemClick" class="p-button-text p-button-rounded" />
      <DataTable :value="doc.doc_items" editMode="cell" @cell-edit-init="onCellEditInit"
          @cell-edit-complete="onCellEditComplete" class="p-datatable-sm editable-cells-table" responsiveLayout="scroll">
        <Column field="item_name" header="Наименование" key="item_name">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" autofocus/>
            <Button icon="pi pi-check" class="p-button-warning" @click="onItemClick"/>
          </template>
        </Column>
        <Column field="quantity" header="Количество" key="quantity">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" autofocus />
          </template>
        </Column>
        <Column v-if="isInventory" field="quantity_fact" header="Фактически" key="quantity_fact">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" autofocus />
          </template>
        </Column>
        <Column field="price" header="Цена" key="price">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" autofocus />
          </template>
        </Column>
        <Column field="amount" header="Сумма" key="amount">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" autofocus />
          </template>
        </Column>
        <Column v-if="isCheck" field="discount" header="Скидка" key="discount">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" autofocus />
          </template>
        </Column>
        <Column style="width:1rem">
          <template #body="{data}">
            <Button icon="pi pi-minus" class="p-button-rounded p-button-secondary p-button-text mr-2" @click="deleteRow(data)" />
          </template>
        </Column>
        <ColumnGroup type="footer">
          <Row>
              <Column footer="сумма:" :colspan="colSpan" footerStyle="text-align:right" />
              <Column :footer="totalAmount" :colspan="2" />
          </Row>
        </ColumnGroup>
      </DataTable> 
    </div>  
  <OverlayPanel ref="opProjects">
    <DataTable :value="projects" v-model:selection="selectedProject" selectionMode="single" 
        :paginator="true" :rows="5" @rowSelect="onProjectSelect" responsiveLayout="scroll" >
        <Column field="name" header="Name" sortable style="width: 60%"/>
    </DataTable>
  </OverlayPanel>
  <OverlayPanel ref="opUsers">
    <DataTable :value="users" v-model:selection="selectedUsers" selectionMode="single" 
        :paginator="true" :rows="5" @rowSelect="onUserSelect" responsiveLayout="scroll" >
        <Column field="name" header="Name" sortable style="width: 60%"/>
        <Column field="email" header="email" sortable style="width: 40%"></Column>
    </DataTable>
  </OverlayPanel>
  <OverlayPanel ref="opCompanies">
    <DataTable :value="companies" v-model:selection="selectedCompany" selectionMode="single" 
        :paginator="true" :rows="5" @rowSelect="onCompanySelect" responsiveLayout="scroll" >
        <Column field="name" header="Name" sortable style="width: 60%"/>
        <Column field="inn" header="email" sortable style="width: 40%"></Column>
    </DataTable>
  </OverlayPanel>
  <OverlayPanel ref="opStorage">
    <DataTable :value="storages" v-model:selection="selectedStorage" selectionMode="single" 
        :paginator="true" :rows="5" @rowSelect="onStorageSelect" responsiveLayout="scroll" >
        <Column field="name" header="Name" sortable />
    </DataTable>
  </OverlayPanel>
  <OverlayPanel ref="opItems">
    <DataTable :value="items" v-model:selection="selectedItem" selectionMode="single" 
        :paginator="true" :rows="5" @rowSelect="onItemSelect" responsiveLayout="scroll" >
        <template #loading>
          <div class="flex justify-content-center">
            <i class="pi pi-spin pi-spinner" style="font-size: 2rem">
          </i></div>
        </template>
        <Column field="name" header="Name" sortable />
        <Column v-for="storage of storages" :header="storage.name" :key="storage.id">
          <template #body="{data}">
            <span> {{getItemRestOnStorage(data, storage)}} </span>
          </template>
        </Column>
        <Column field="price" header="Цена" sortable />
    </DataTable>
  </OverlayPanel>
</template>

<script>
import Calendar from 'primevue/calendar';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputSwitch from 'primevue/inputswitch';
import ColumnGroup from 'primevue/columngroup';     //optional for column grouping
import Row from 'primevue/row'; 
import Button from 'primevue/button';
import OverlayPanel from 'primevue/overlaypanel';
import Divider from 'primevue/divider';
import {FilterMatchMode} from 'primevue/api';
import {Property, DocumentType} from '@/js/Constants';
export default {
    name: 'DocContent',
    components: {
        Calendar,
        InputText,
        DataTable,
        Column,
        InputSwitch,
        ColumnGroup,
        Row,
        Button,
        OverlayPanel,
        Divider
    },
    props: {
        docId: Number,
        type: String,
        docType: String
    },
    data() {
        return {
            selectedProject: null,
            selectedStorageFrom: null,
            disabledStorageFrom: false,
            selectedStorageTo: null,
            disabledStorageTo: false,
            is_hold: true,
            selectedRow: null,
            selectedUsers: null,
            selectedRecipient: null,
            disabledRecipient: false,
            selectedSupplier: null,
            disabledSupplier: false,
            userType: null,
            companyType: null,
            selectedCompany: null,
            storageType: null,
            selectedStorage: null,
            selectedItem: null,
            dateInput: '',
            checkDateInput: '',
            currentField: null,
            currentData: null,
            itemSelectType: String,
            filters: {
                'name': {value: null, matchMode: FilterMatchMode.CONTAINS}
            },
            disabledFillItemRest: true,
            orderDoc: false,
            isInventory: false,
            isCheck: false,
            colSpan: 3,            
            DocumentType: DocumentType,
        };
    },
    computed: {
        doc() {
          let doc = this.$store.state.ds.document;
          if(this.type === "copyToRequestDoc") {
            doc.id = 0;
            doc.doc_type = DocumentType.MOVEMENT_DOC;
            doc.time = new Date();
          }
          return doc;
        },
        user() {
          return this.$store.state.user;
        },
        projects() {
          return this.$store.state.cs.projects
        },
        storages() {
          return this.$store.state.cs.storages
        },
        users() {
          return this.$store.state.cs.users;
        },
        companies() {
          return this.$store.state.cs.companies;
        },
        items() {
          return this.$store.state.cs.items;
        },
        totalAmount() {
          let total = 0;
          for(let item of this.doc.doc_items) {
              total += item.amount - item.discount;
          }
          return this.formatCurrency(total);
        },
        itemRest() {
          return this.$store.state.ds.itemRest;
        },
        defaultProperties() {
          return this.$store.state.ss.defaultProperties;
        }
    },
    mounted() {
      this.$store.dispatch('getDocument', [this.docId, this.docType]);
    },
    watch: {
      doc(value) {
        if(value.doc_type == DocumentType.WITHDRAW_ORDER_DOC 
                    || value.doc_type == DocumentType.CREDIT_ORDER_DOC) {
          this.orderDoc = true;
        }
        if(value.doc_type == DocumentType.POSTING_DOC 
                    || value.doc_type == DocumentType.RECEIPT_DOC) {
          this.disabledStorageFrom = true;
        }
        if(value.doc_type == DocumentType.WRITE_OFF_DOC 
                    || value.doc_type == DocumentType.CHECK_DOC 
                    || value.doc_type == DocumentType.INVENTORY_DOC) {
          this.disabledStorageTo = true;
        }
        if(value.id == 0) {
          let user = JSON.parse(localStorage.getItem('user'));
          let author = this.users.filter(u => u.id == user.id).pop();
          value.author = author;
          let projectId = this.defaultProperties.filter(prop => prop.type == Property.PROJECT).pop().property;
          value.project = this.getProjectById(projectId);
          if(!this.disabledStorageTo) {
            let storageToId = this.defaultProperties.filter(prop => prop.type == Property.STORAGE_TO).pop().property;
            value.storage_to = this.getStorageById(storageToId);
          }
          if(!this.disabledStorageFrom) {
            let storageFromId = this.defaultProperties.filter(prop => prop.type == Property.STORAGE_FROM).pop().property;
            value.storage_from = this.getStorageById(storageFromId);
          }
        }
        if(value.storage_from) {
          this.selectedStorageFrom = value.storage_from.id
        }
        if(value.storage_to) {
          this.selectedStorageTo = value.storage_to.id
        }
        if(value.doc_type == DocumentType.CHECK_DOC) {
          this.isCheck = true;
          this.colSpan++;
        }
        if(value.doc_type == DocumentType.INVENTORY_DOC) {
          this.isInventory = true;
          this.colSpan++;
        }
        this.selectedProject = value.project
        this.dateInput = value.date_time;
        if(value.check_info) {
          this.checkDateInput = value.check_info.date_time;
        }
        this.enableFillItemRestButton();
      },
      itemRest(value) {
        this.doc.doc_items = value;
      },
      dateInput(value) {
        this.doc.date_time = value;
      }
    },
    methods: {
      getProjectById(id) {
        return this.projects.filter(project => project.id == id).pop();
      },
      getStorageById(id) {
        return this.storages.filter(storage => storage.id == id).pop();
      },
      getItemRestOnStorage(item, storage) {
        for(let rest of item.rest_list) {
          if(rest.storage.id == storage.id) {
            return rest.quantity;
          }
        }
      },
      deleteRow(value) {
        this.doc.doc_items = this.doc.doc_items.filter( currentValue => currentValue != value );
      },
      enableFillItemRestButton() {
        if((this.doc.author.id != 0) && (this.doc.storage_from.id != 0)) {
          this.disabledFillItemRest = false;
        }
      },
      onFillRestClick() {
        this.$store.dispatch('getRestOnDateAndStorage', [this.doc.id, this.dateInput, this.doc.storage_from.id]);
      },
      onCreateDockClick() {
        this.$store.dispatch('createRelativeDocks', this.doc);
      },
      onCellEditComplete(event) {
        let { data, newValue, field } = event;
        if(field != 'item_name') {
          data[field] = newValue;
        }
        if(field === 'quantity' || field === 'price' || field === 'discount') {
          data['amount'] = data['price'] * data['quantity'];
        } else if(field === 'amount') {
          data['price'] = data['amount'] / data['quantity'];
        }
      },
      formatCurrency(value) {
        return value.toLocaleString('re-RU', {style: 'currency', currency: 'RUB'});
      },
      onAuthorClick(event) {
        this.userType = 'author';
        this.$refs.opUsers.toggle(event);
      },
      onUserSelect(event) {
        if(this.userType == 'individual') {
          this.doc.individual = event.data;
        } else {
          this.doc.author = event.data;
        }
        this.enableFillItemRestButton();
        this.$refs.opUsers.hide();
      },
      onProjectClick(event) {
        this.$refs.opProjects.toggle(event);
      },
      onProjectSelect(event) {
        this.doc.project = event.data;
        this.$refs.opProjects.hide();
      },
      onRecipientClick(event) {
        this.companyType = 'recipient';
        this.$refs.opCompanies.toggle(event);
      },
      onIndividualClick(event) {
        this.userType = 'individual';
        this.$refs.opUsers.toggle(event);
      },
      onSupplierClick(event) {
        this.companyType = 'supplier';
        this.$refs.opCompanies.toggle(event);
      },
      onCompanySelect(event) {
        if(this.companyType == 'recipient') {
          this.doc.recipient = event.data;
        } else {
          this.doc.supplier = event.data;
        }
        this.$refs.opCompanies.hide();
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
          this.doc.storage_from = event.data;
          this.enableFillItemRestButton();
        } else {
          this.doc.storage_to = event.data;
        }
        this.$refs.opStorage.hide();
      },
      onItemClick(event) {
        this.itemSelectType = 'update';
        this.$refs.opItems.toggle(event);
      },
      onAddItemClick(event) {
        this.itemSelectType = 'add';
        this.$refs.opItems.toggle(event);
      },
      onCellEditInit(event) {
        let { data, field } = event;
        if(field == "item_name") {
          this.currentField = field;
          this.currentData = data;
        }
      },
      onItemSelect(event) {
        if(this.itemSelectType == 'update') {
          this.updateItem(event.data.id, event.data.name, event.data.price);
        } else {
          this.addItem(event.data.id, event.data.name, event.data.price);
        }
        this.$refs.opItems.hide();
      },
      updateItem(item_id, item_name, item_price){
        this.currentData['item_id'] = item_id;
        this.currentData['item_name'] = item_name;
        this.currentData['price'] = item_price;
      },
      addItem(item_id, item_name, item_price) {
          this.doc.doc_items.push(new Item(this.doc.id, item_id, item_name, 0.0, item_price, 0.0, 0.0,));
      }
      
    }
}

class Item {
    document_id = 0;
    item_id = 0;
    item_name = "";
    quantity = 0.0;
    price = 0.0;
    discount = 0.0;
    quantity_fact = 0.0;
    constructor(document_id, item_id, item_name, quantity, price, discount, quantity_fact) {
        this.document_id = document_id;
        this.item_id = item_id;
        this.item_name = item_name;
        this.quantity = quantity;
        this.price = price;
        this.discount = discount;
        this.quantity_fact = quantity_fact;
    }
}

</script>

<style scoped>
  .buttonContainer {
    display: flex;
    margin: 8px;
  }
  .column {
    display: flex;
    flex-direction: column;
  }
  .row {
    display: flex;
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
  .b {
    font-weight: bold;
  }
  .mr-1 {
    margin: 0px 10px 0px 0px;
  }
  .mr-5 {
    margin: 0px 50px 0px 0px;
  }
  .mb-2 {
    margin-bottom: 5px;
  }
  .mb-3 {
    margin-bottom: 10px;
  }
  .mt-3 {
    margin-top: 10px;
  }
  .label {
    margin: 0px 0px 5px 0px;
    display: inline-block;
  }
  .input {
    width: 200 px;
  }
  .field {
    margin: 0px 0px 10px 0px;
  }
  .smallinput {
    width: 100px;
  }
  .numberdatecard {
    padding: 20px 20px 20px 20px;
    background-color: rgb(147, 175, 177);
    border-radius: 5px;
  }
  h4 {
    color: rgb(96, 125, 139);
  }
  .center {
    display: flex;
    align-items: center;
  }
  .right {
    justify-content: end;
  }
  .ml-1 {
      margin-left: 10 px;
  }
</style>