<template> 
    <div v-if="doc.author && doc.project">
      <div class="formgrid grid">
        <div class="field col-12 md:col-4">
          <label for="number" class="label">Номер</label><br>
          <InputText id="number" type="text" class="p-inputtext-sm input" v-model="doc.number" />
        </div>
        <div class="field col-12 md:col-4">
          <label for="time" class="label">Дата</label><br>
          <Calendar id="time" v-model="doc.time" :showTime="true" :showSeconds="true" dateFormat="dd.mm.yy" />
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
          <Dropdown id="project" class="input" v-model="selectedProject" :options="projects" optionLabel="name" placeholder="Проект" @change="onProjectChange" />
        </div>
        <div class="field col-12 md:col-4">
          <div v-if="doc.storage_from">
            <label for="storageFrom" class="label">со склада</label><br>
            <div class="p-inputgroup">
              <InputText id="storageFrom" type="text" class="p-inputtext-sm" v-model="doc.storage_from.name" />
              <Button icon="pi pi-check" class="p-button-warning" @click="onStorageFromClick"/>
            </div>
          </div>
          <!-- <Dropdown id="storageFrom" v-model="selectedStorageFrom" :options="storages" optionLabel="name" placeholder="со склада" @change="onStorageFromChange" /> -->
        </div>
        <div class="field col-12 md:col-4">
          <div v-if="doc.storage_to">
          <label for="storageTo" class="label">на склад</label><br>
            <div class="p-inputgroup">
              <InputText id="storageTo" type="text" class="p-inputtext-sm" v-model="doc.storage_to.name" />
              <Button icon="pi pi-check" class="p-button-warning" @click="onStorageToClick"/>
            </div>
          </div>
          <!-- <Dropdown id="storageTo" v-model="selectedStorageTo" :options="storages" optionLabel="name" placeholder="на склад" @change="onStorageToChange" /> -->
        </div>
        <div class="field col-12 md:col-3">
          <label for="isHold" class="label">проведен</label>
          <InputSwitch id="isHold" v-model="doc.is_hold" /> 
        </div>
        <div class="field col-12 md:col-3">
          <label for="isPaid" class="label">оплачен</label>
          <InputSwitch id="isPaid" v-model="doc.is_payed" /> 
        </div>
        <div class="field col-12 md:col-3">
          <div v-if="doc.amount">
            <label for="amount" class="label">сумма</label><br>
            <InputText id="amount" type="text" class="p-inputtext-sm mr-1" v-model="doc.amount" />
          </div>
        </div>
        <div class="field col-12 md:col-4">
          <div v-if="doc.recipient">
            <label for="recipient" class="label">Получатель</label><br>
            <div class="p-inputgroup">
              <InputText id="recipient" type="text" class="p-inputtext-sm" v-model="doc.recipient.name" />
              <Button icon="pi pi-check" class="p-button-warning" @click="onRecipientClick"/>
            </div>
          </div>
        </div>
        <div class="field col-12 md:col-4">
          <div v-if="doc.supplier">
            <label for="supplier" class="label">Отправитель</label><br>
            <div class="p-inputgroup">
              <InputText id="supplier" type="text" class="p-inputtext-sm" v-model="doc.supplier.name" />
              <Button icon="pi pi-check" class="p-button-warning" @click="onSupplierClick"/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="doc.check_info">
        <label for="waiter" class="label">официант</label>
        <InputText id="waiter" type="text" class="p-inputtext-sm mr-1" v-model="doc.check_info.waiter" />
        <label for="check_number" class="label">номер чека</label>
        <InputText id="check_number" type="text" class="p-inputtext-sm mr-1" v-model="doc.check_info.check_number" />
        <label for="cash_register_number" class="label">номер кассы</label>
        <InputText id="cash_register_number" type="text" class="p-inputtext-sm mr-1" v-model="doc.check_info.cash_register_number" />
        <label for="amount_received" class="label">получено</label>
        <InputText id="amount_received" type="text" class="p-inputtext-sm mr-1" v-model="doc.check_info.amount_received" />
        <label for="table_number" class="label">стол</label>
        <InputText id="table_number" type="text" class="p-inputtext-sm mr-1" v-model="doc.check_info.table_number" />
        <label for="guest_number" class="label">гость</label>
        <InputText id="guest_number" type="text" class="p-inputtext-sm mr-1" v-model="doc.check_info.guest_number" />
        <Calendar id="kkm_check_time" v-model="doc.check_info.date_time" :showTime="true" :showSeconds="true" dateFormat="yy.mm.dd" />
        <label for="isReturn" class="label">возврат</label>
        <InputSwitch id="isReturn" v-model="doc.check_info.is_return" /> 
        <label for="isKKMChecked" class="label">пробит</label>
        <InputSwitch id="isKKMChecked" v-model="doc.check_info.is_KKM_checked" /> 
        <label for="is_Paid" class="label">оплачен</label>
        <InputSwitch id="is_Paid" v-model="doc.check_info.is_payed" /> 
        <label for="isPayedByCard" class="label">эквайринг</label>
        <InputSwitch id="isPayedByCard" v-model="doc.check_info.is_payed_by_card" /> 
        <label for="isDelivery" class="label">доставка</label>
        <InputSwitch id="isDelivery" v-model="doc.check_info.is_delivery" /> 
    </div>
    <div v-if="doc.doc_items">
      <DataTable :value="doc.doc_items" editMode="cell" @cell-edit-init="onCellEditInit" @cell-edit-complete="onCellEditComplete" class="p-datatable-sm editable-cells-table" responsiveLayout="scroll">
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
        <Column field="price" header="Цена" key="price">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" autofocus />
          </template>
        </Column>
        <Column field="discount" header="Скидка" key="discount">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" autofocus />
          </template>
        </Column>
        <ColumnGroup type="footer">
          <Row>
              <Column footer="сумма:" :colspan="3" footerStyle="text-align:right" />
              <Column :footer="totalAmount" />
          </Row>
        </ColumnGroup>
      </DataTable> 
    </div>  
  <OverlayPanel ref="opUsers">
    <DataTable :value="users" v-model:selection="selectedUsers" selectionMode="single" :paginator="true" :rows="5" @rowSelect="onUserSelect" responsiveLayout="scroll" >
        <Column field="name" header="Name" sortable style="width: 60%"/>
        <Column field="email" header="email" sortable style="width: 40%"></Column>
    </DataTable>
  </OverlayPanel>
  <OverlayPanel ref="opCompanies">
    <DataTable :value="companies" v-model:selection="selectedCompany" selectionMode="single" :paginator="true" :rows="5" @rowSelect="onCompanySelect" responsiveLayout="scroll" >
        <Column field="name" header="Name" sortable style="width: 60%"/>
        <Column field="inn" header="email" sortable style="width: 40%"></Column>
    </DataTable>
  </OverlayPanel>
  <OverlayPanel ref="opStorage">
    <DataTable :value="storages" v-model:selection="selectedStorage" selectionMode="single" :paginator="true" :rows="5" @rowSelect="onStorageSelect" responsiveLayout="scroll" >
        <Column field="name" header="Name" sortable />
        <!-- <Column field="inn" header="email" sortable style="width: 40%"></Column> -->
    </DataTable>
  </OverlayPanel>
  <OverlayPanel ref="opItems">
    <DataTable :value="items" v-model:selection="selectedItem" selectionMode="single" :paginator="true" :rows="5" @rowSelect="onItemSelect" responsiveLayout="scroll" >
        <Column field="name" header="Name" sortable />
        <!-- <Column field="inn" header="email" sortable style="width: 40%"></Column> -->
    </DataTable>
  </OverlayPanel>
</template>

<script>
import Calendar from 'primevue/calendar';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputSwitch from 'primevue/inputswitch';
import ColumnGroup from 'primevue/columngroup';     //optional for column grouping
import Row from 'primevue/row'; 
import Button from 'primevue/button';
import OverlayPanel from 'primevue/overlaypanel';
export default {
    name: 'DocContent',
    components: {
        Calendar,
        InputText,
        Dropdown,
        DataTable,
        Column,
        InputSwitch,
        ColumnGroup,
        Row,
        Button,
        OverlayPanel
    },
    props: {
        docId: Number
    },
    data() {
        return {
            time: "2022.05.23 14:00:15",
            time24: "05/20/2022",
            foo: 'bar',
            selectedProject: null,
            selectedStorageFrom: null,
            selectedStorageTo: null,
            is_hold: true,
            selectedRow: null,
            selectedUsers: null,
            selectedRecipient: null,
            selectedSupplier: null,

            companyType: null,
            selectedCompany: null,

            storageType: null,
            selectedStorage: null,

            selectedItem: null,
            currentField: null,
            currentData: null
        };
    },
    computed: {
        doc() {
          return this.$store.state.document
        },
        projects() {
          return this.$store.state.projects
        },
        storages() {
          return this.$store.state.storages
        },
        users() {
          return this.$store.state.users;
        },
        companies() {
          return this.$store.state.companies;
        },
        items() {
          return this.$store.state.items;
        },
        totalAmount() {
          let total = 0;
          for(let item of this.doc.doc_items) {
              total += (item.price * item.quantity) - item.discount;
          }
          return this.formatCurrency(total);
        }
    },
    mounted() {
      this.$store.dispatch('getDocument', this.docId);
    },
    unmounted() {
      console.log("doc", this.doc);
    },
    watch: {
      doc(value) {
        if(value.storage_from) {
          this.selectedStorageFrom = value.storage_from.id
        }
        if(value.storage_to) {
          this.selectedStorageTo = value.storage_to.id
        }
        this.selectedProject = value.project.id
        console.log(this.selectedProject)
      },
    },
    methods: {
      onProjectChange(event) {
        console.log(event.value)
        // this.doc.project = event.value;
      },
      onStorageFromChange(event) {
        this.doc.storage_from = event.value;
      },
      onStorageToChange(event) {
        this.doc.storage_to = event.value;
      },
      onCellEditComplete(event) {
        let { data, newValue, field } = event;
        data[field] = newValue;
      },
      formatCurrency(value) {
        return value.toLocaleString('re-RU', {style: 'currency', currency: 'RUB'});
      },
      onAuthorClick(event) {
        this.$refs.opUsers.toggle(event);
      },
      onUserSelect(event) {
        this.doc.author = event.data;
        this.$refs.opUsers.hide();
      },
      onRecipientClick(event) {
        this.companyType = 'recipient';
        this.$refs.opCompanies.toggle(event);
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
        } else {
          this.doc.storage_to = event.data;
        }
        this.$refs.opStorage.hide();
      },
      onItemClick(event) {
        this.$refs.opItems.toggle(event);
      },
      onCellEditInit(event) {
        let { data, field } = event;
        if(field == "item_name") {
          console.log("item_name")
          this.currentField = field;
          this.currentData = data;
        }
      },
      onItemSelect(event) {
        console.log(event.data)
        this.currentData['item_name'] = event.data.name;
        this.currentData['item_id'] = event.data.id;
        this.$refs.opItems.hide();
      }
    }
}

// function getObject(object, id) {
//   for(let i = 0; i < object.length; i++) {
//     if(object[i].id == id) {
//       console.log(object[i]);
//       return object[i];
//     }
//   }
// }

</script>

<style scoped>
  .aaa {
    display: flex;
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
  .label {
    margin: 0px 0px 10px 0px;
    display: inline-block;
  }
  .input {
    width: 200 px;
  }
</style>