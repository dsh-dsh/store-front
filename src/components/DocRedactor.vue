<template> 
    <br><br>
    <div v-if="doc.author && doc.project">

      <div class="formgrid grid">

        <div class="field col-12 md:col-12">
          <p class="mb-2"><b>Документ  {{ doc.doc_type }}</b> (автор {{ doc.author.name }})</p>
        </div>

        <div class="field col-12 md:col-5 flex justify-content-between numberdatecard">
          <div class="mt-3 mb-3">
            <label for="number" class="label">Номер</label><br>
            <InputText id="number" @change="disableHoldButton" type="text" class="p-inputtext smallinput" v-model="doc.number" />
          </div>
          <div class="mt-3 mb-3">
            <label for="time" class="label">Дата</label><br>
            <Calendar id="time" @change="disableHoldButton" @date-select="disableHoldButton" v-model="dateInput" dateFormat="dd.mm.yy" :showIcon="true" />
          </div>
        </div>
        <div class="field col-12 md:col-7 center right">
          <div v-if="doc.doc_type === DocumentType.INVENTORY_DOC" class="mr-5">
            <Button label="Заполнить" class="p-button-rounded p-button-secondary mr-1" @click="onFillRestClick" :disabled="disabledFillItemRest"/>
            <Button label="Создать подчиненные документы" class="p-button-rounded p-button-secondary" @click="onCreateDockClick" :disabled="disabledFillItemRest"/>
          </div>
        </div>

        <div class="field col-12 md:col-4">
          <label for="project" class="label">Проект</label><br>
            <div class="p-inputgroup">
              <InputText id="project" type="text" class="p-inputtext-sm" v-model="doc.project.name" />
              <Button icon="pi pi-check" class="p-button-warning" @click="onProjectClick" />
            </div>
        </div>
        <div class="field col-12 md:col-8"></div>

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
        
        <div v-if="orderDoc" class="field col-12 md:col-4">
          <!-- <div v-if="doc.individual"> -->
            <label for="individual" class="label">Физ лицо</label><br>
            <div class="p-inputgroup">
              <InputText id="individual" type="text" class="p-inputtext-sm" v-model="doc.individual.name" />
              <Button icon="pi pi-check" class="p-button-warning" @click="onIndividualClick"/>
            </div>
          <!-- </div> -->
        </div>
        <div v-if="orderDoc" class="field col-12 md:col-4">
          <!-- <div v-if="doc.payment_type"> -->
            <label for="payment_type" class="label">Физ лицо</label><br>
            <div class="p-inputgroup">
              <InputText id="payment_type" type="text" class="p-inputtext-sm" v-model="doc.payment_type" />
              <Button icon="pi pi-check" class="p-button-warning" @click="onPaymentTypeClick"/>
            </div>
          <!-- </div> -->
        </div>
        <div v-if="orderDoc" class="field col-12 md:col-4"></div>

        <div v-if="orderDoc" class="field col-12 md:col-4">
          <label for="amount" class="label">сумма</label><br>
          <InputText id="amount" @change="disableHoldButton" type="text" class="p-inputtext-sm mr-1" v-model="doc.amount" />
        </div>
        <div v-if="orderDoc" class="field col-12 md:col-8">
          <label for="tax" class="label">сумма</label><br>
          <InputText id="tax" @change="disableHoldButton" type="text" class="p-inputtext-sm mr-1" v-model="doc.tax" />
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
          <InputText id="waiter" @change="disableHoldButton" type="text" class="p-inputtext-sm mr-1" v-model="doc.check_info.waiter" />
        </div>
        <div class="field col-12 md:col-3">
          <label for="check_number" class="label">номер чека</label><br>
          <InputText id="check_number" @change="disableHoldButton" type="text" class="p-inputtext-sm mr-1" v-model="doc.check_info.check_number" />
        </div>
        <div class="field col-12 md:col-3">
          <label for="cash_register_number" class="label">номер кассы</label><br>
          <InputText id="cash_register_number" @change="disableHoldButton" type="text" class="p-inputtext-sm mr-1" v-model="doc.check_info.cash_register_number" />
        </div>
        <div class="field col-12 md:col-3">
          <label for="amount_received" class="label">получено</label><br>
          <InputText id="amount_received" @change="disableHoldButton" type="text" class="p-inputtext-sm mr-1" v-model="doc.check_info.amount_received" />
        </div>
        <div class="field col-12 md:col-3">
          <label for="table_number" class="label">стол</label><br>
          <InputText id="table_number" @change="disableHoldButton" type="text" class="p-inputtext-sm mr-1" v-model="doc.check_info.table_number" />
        </div>
        <div class="field col-12 md:col-3">
          <label for="guest_number" class="label">гость</label><br>
          <InputText id="guest_number" @change="disableHoldButton" type="text" class="p-inputtext-sm mr-1" v-model="doc.check_info.guest_number" />
        </div>
        <div class="field col-12 md:col-3">
          <label for="kkm_check_time" class="label">время</label><br>
          <Calendar id="kkm_check_time" @change="disableHoldButton" v-model="checkDateInput" :showTime="true" :showSeconds="true" dateFormat="dd.mm.yy" disabled/>
        </div>
        <div class="field col-12 md:col-3">
        </div>
        <div class="field col-12 md:col-2">
          <label for="isReturn" class="label">возврат</label>
          <InputSwitch id="isReturn" @change="disableHoldButton" v-model="doc.check_info.is_return" /> 
        </div>
        <div class="field col-12 md:col-2">
          <label for="isKKMChecked" class="label">пробит</label>
          <InputSwitch id="isKKMChecked" @change="disableHoldButton" v-model="doc.check_info.is_KKM_checked" /> 
        </div>
        <div class="field col-12 md:col-2">
          <label for="is_Paid" class="label">оплачен</label>
          <InputSwitch id="is_Paid" @change="disableHoldButton" v-model="doc.check_info.is_payed" /> 
        </div>
        <div class="field col-12 md:col-2">
          <label for="isPayedByCard" class="label">эквайринг</label>
          <InputSwitch id="isPayedByCard" @change="disableHoldButton" v-model="doc.check_info.is_payed_by_card" /> 
        </div>
        <div class="field col-12 md:col-2">
          <label for="isDelivery" class="label">доставка</label>
          <InputSwitch id="isDelivery" @change="disableHoldButton" v-model="doc.check_info.is_delivery" /> 
        </div>
      </div>
    </div>
    <div v-if="doc.doc_items">
      <Button icon="pi pi-plus" @click="onAddItemClick" class="p-button-text p-button-rounded" />
      <DataTable :value="doc.doc_items" :rowClass="rowClass" editMode="cell" @cell-edit-init="onCellEditInit"
          @cell-edit-complete="onCellEditComplete" class="p-datatable-sm editable-cells-table" responsiveLayout="scroll">
        <Column field="item_name" header="Наименование" key="item_name">
          <template #editor="{ data, field }">
            <InputText @change="disableHoldButton" v-model="data[field]" autofocus/>
            <Button icon="pi pi-check" class="p-button-warning" @click="onItemClick"/>
          </template>
        </Column>
        <Column field="quantity" header="Количество" key="quantity">
          <template #editor="{ data, field }">
            <InputText @change="disableHoldButton" v-model="data[field]" autofocus />
          </template>
        </Column>
        <Column v-if="isInventory" field="quantity_fact" header="Фактически" key="quantity_fact">
          <template #editor="{ data, field }">
            <InputText @change="disableHoldButton" v-model="data[field]" autofocus />
          </template>
        </Column>
        <Column field="price" header="Цена" key="price">
          <template #editor="{ data, field }">
            <InputText @change="disableHoldButton" v-model="data[field]" autofocus />
          </template>
        </Column>
        <Column field="amount" header="Сумма" key="amount">
          <template #editor="{ data, field }">
            <InputText @change="disableHoldButton" v-model="data[field]" autofocus />
          </template>
        </Column>
        <Column v-if="isCheck" field="discount" header="Скидка" key="discount">
          <template #editor="{ data, field }">
            <InputText @change="disableHoldButton" v-model="data[field]" autofocus />
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

  <OverlayPanel ref="opPaymentTypes">
    <DataTable :value="paymentTypes" v-model:selection="selectedPaymentType" selectionMode="single" 
        @rowSelect="onPaymentTypeSelect" responsiveLayout="scroll" >
        <Column field="value" header="Name" sortable />
    </DataTable>
  </OverlayPanel>
  <OverlayPanel ref="opProjects">
    <DataTable :value="projects" v-model:selection="selectedProject" selectionMode="single" 
        :paginator="true" :rows="5" @rowSelect="onProjectSelect" responsiveLayout="scroll" >
        <Column field="name" header="Name" sortable />
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

  <!-- <OverlayPanel ref="opItems"> -->
  <Dialog header="Подбор номенклатуры" class="border dialog" v-model:visible="displayItems" :modal="true" :showHeader="false"> 
    <br>
    <DataTable :value="items" class="p-datatable-sm" v-model:selection="selectedItem" selectionMode="single" 
                v-model:filters="filters" filterDisplay="menu" :globalFilterFields="['name']"
                @rowSelect="onItemSelect" :scrollable="true" scrollHeight="500px" width="900px" :loading="loading">
        <template #header>
          <div class="flex justify-content-start">
              <InputText class="p-inputtext-sm mr-2" v-model="filters['global'].value" placeholder="поиск" autofocus />
              <Button icon="pi pi-times" class="p-button-rounded p-button-text p-button-plain p-button-sm" @click="clearFilter"/>
          </div>
        </template>
        <template #loading>
          <div class="flex justify-content-center">
            <i class="pi pi-spin pi-spinner" style="font-size: 2rem">
          </i></div>
        </template>
        <Column field="name" header="Name" sortable />
        <Column v-for="storage of storages" :header="storage.name" :key="storage.id">
          <template #body="{data}">
            <div :class="boldClass(doc, storage)"> {{getItemRestOnStorage(data, storage)}} </div>
            <!-- <span> {{getItemRestOnStorage(data, storage)}} </span> -->
          </template>
        </Column>
        <Column field="price" header="Последняя цена" sortable />
    </DataTable>
    <br>
    <template #footer>
      <Button label="закрыть" icon="pi pi-times" @click="closeDialog" class="p-button-text p-button-sm" />
    </template>
  </Dialog>
  <!-- </OverlayPanel> -->
</template>

<script>
import Calendar from 'primevue/calendar';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputSwitch from 'primevue/inputswitch';
import ColumnGroup from 'primevue/columngroup'; 
import Row from 'primevue/row'; 
import Button from 'primevue/button';
import OverlayPanel from 'primevue/overlaypanel';
import Divider from 'primevue/divider';
import {FilterMatchMode, FilterOperator} from 'primevue/api';
import {Property, DocumentType, PaymentType} from '@/js/Constants';
import Dialog from 'primevue/dialog';

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
        Divider,
        Dialog
    },
    props: {
        docId: Number,
        type: String,
        docType: String
    },
    emits: {
        disableHoldButton: null,
        disableSaveButton: null
    },
    data() {
      return {
        filters: null,
        loading: false,
        user: null,
        selectedPaymentType: null,
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
        disabledFillItemRest: true,
        orderDoc: false,
        isInventory: false,
        isCheck: false,
        colSpan: 3,            
        DocumentType: DocumentType,
        paymentTypes:[],
        displayItems: false
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
          if(this.type === "copy") {
            doc.date_time = new Date();
            this.disableSaveButton();
          }
          return doc;
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
          return this.$store.state.is.items;
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
        },
        period() {
          return this.$store.state.ss.period;        }
    },
    created() {
        this.initFilters();
    },
    mounted() {
      this.$store.dispatch('getDocument', [this.docId, this.docType]);
      this.user = JSON.parse(localStorage.getItem('user'));
      this.setPaymentTypes();
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
          let author = this.users.filter(u => u.id == this.user.id).pop();
          value.author = author;
          if(this.defaultProperties.length > 0) {
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
        }
        if(value.payment_type) {
          this.selectedPaymentType = value.payment_type
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
      },
      items() {
        this.loading = false;
      }
    },
    methods: {
      clearFilter() {
        this.initFilters();
      },
      initFilters() {
        this.filters = {
          'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
          'name': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]}
        }
      },
      closeDialog() {
        this.displayItems = false;
        this.clearFilter();
      },
      setPaymentTypes() {
        this.paymentTypes = [];
        for(var i in PaymentType) {
            this.paymentTypes.push({'value': PaymentType[i] });
        }
      },
      rowClass(data) {
        return data.is_composite === true ? 'row-composite': null;
      },
      boldClass(doc, storage) {  
        let currentStorage;
        if(doc.doc_type == DocumentType.WRITE_OFF_DOC 
            || doc.doc_type == DocumentType.MOVEMENT_DOC 
            || doc.doc_type == DocumentType.CHECK_DOC) {
          currentStorage = doc.storage_from;
        } else {
          currentStorage = doc.storage_to;
        }
        if(currentStorage.id == storage.id) {
          return 'b';
        }
      },
      disableHoldButton() {
        this.$emit('disableHoldButton');
      },
      disableSaveButton() {
        this.$emit('disableSaveButton');
      },
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
        this.$emit('disableHoldButton');
      },
      onPaymentTypeClick(event) {
        this.$refs.opPaymentTypes.toggle(event);
      },
      onPaymentTypeSelect(event) {
        this.doc.payment_type = event.data.value;
        this.$refs.opPaymentTypes.hide();
        this.$emit('disableHoldButton');
      },
      enableFillItemRestButton() {
        if((this.doc.author.id != 0) && (this.doc.storage_from.id != 0)) {
          this.disabledFillItemRest = false;
        }
      },
      onFillRestClick() {
        this.$store.dispatch('getRestOnDateAndStorage', [this.doc.id, this.dateInput, this.doc.storage_from.id]);
        this.$emit('disableHoldButton');
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
        this.$emit('disableHoldButton');
      },
      onProjectClick(event) {
        this.$refs.opProjects.toggle(event);
      },
      onProjectSelect(event) {
        this.doc.project = event.data;
        this.$refs.opProjects.hide();
        this.$emit('disableHoldButton');
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
        this.$emit('disableHoldButton');
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
        this.$emit('disableHoldButton');
      },
      onItemClick(event) {
        this.$store.dispatch('getItemsWithRest', this.doc.date_time);
        this.itemSelectType = 'update';
        this.$refs.opItems.toggle(event);
      },
      onAddItemClick() { //event) {
        this.$store.dispatch('getItemsWithRest', this.doc.date_time);
        this.itemSelectType = 'add';
        // this.$refs.opItems.toggle(event);
        this.displayItems = true;
      },
      onCellEditInit(event) {
        let { data, field } = event;
        if(field == "item_name") {
          this.currentField = field;
          this.currentData = data;
        }
      },
      onItemSelect(event) {
        this.displayItems = false;
        if(this.itemSelectType == 'update') {
          this.updateItem(event.data.id, event.data.name, event.data.price, event.data.is_composite);
        } else {
          this.addItem(event.data.id, event.data.name, event.data.price, event.data.is_composite);
        }
        // this.$refs.opItems.hide();
        this.$emit('disableHoldButton');
      },
      updateItem(item_id, item_name, item_price, is_composite){
        this.currentData['item_id'] = item_id;
        this.currentData['item_name'] = item_name;
        this.currentData['price'] = item_price;
        this.currentData['is_composite'] = is_composite;
        if(this.doc.doc_type == DocumentType.POSTING_DOC || this.doc.doc_type == DocumentType.RECEIPT_DOC) {
          if(is_composite == true) {
            this.$emit('disableSaveButton', true);
          } 
          else {
            if(!checkComposite(this.doc.doc_items)) {
              this.$emit('disableSaveButton', false);
            }
          }
        }
      },
      addItem(item_id, item_name, item_price, is_composite) {
        if(is_composite == true 
            && (this.doc.doc_type == DocumentType.POSTING_DOC || this.doc.doc_type == DocumentType.RECEIPT_DOC)) {
          this.$emit('disableSaveButton', true);
        }
        if(this.doc.doc_items.filter(item => item.item_id === item_id).length == 0) {
          this.doc.doc_items.push(new Item(this.doc.id, item_id, item_name, 0.0, item_price, 0.0, 0.0, is_composite));
        }
      }
    }
}

function checkComposite(docItems) {
  let itemArr = docItems.filter(item => item.is_composite == true);
  return itemArr.length > 0;
}

class Item {
    document_id = 0;
    item_id = 0;
    item_name = "";
    quantity = 0.0;
    price = 0.0;
    discount = 0.0;
    quantity_fact = 0.0;
    is_composite = false;
    constructor(document_id, item_id, item_name, quantity, price, discount, quantity_fact, is_composite) {
        this.document_id = document_id;
        this.item_id = item_id;
        this.item_name = item_name;
        this.quantity = quantity;
        this.price = price;
        this.discount = discount;
        this.quantity_fact = quantity_fact;
        this.is_composite = is_composite;
    }
}

</script>

<style scoped>
  ::v-deep(.row-composite) {
      background-color: rgba(255, 0, 0, 0.15) !important;
  }
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
  .dialog {
    width: 900px; 
    height: 600px; 
    background-color: white;
  }
</style>