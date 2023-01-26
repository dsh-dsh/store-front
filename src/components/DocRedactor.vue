<template> 
  <br><br>
  <div v-if="doc.author && doc.project">
    <div class="formgrid grid">
      <div class="field col-12 md:col-12">
        <p class="mb-2"><b>Документ  {{ doc.doc_type }}</b> (автор {{ doc.author.name }})</p>
      </div>
      <div class="field col-12 md:col-7 flex justify-content-between numberdatecard">
        <div class="mt-3 mb-3">
          <label for="number" class="label">номер</label><br>
          <InputText id="number" @change="disableHoldButton" type="text" class="p-inputtext medium-inpyt" v-model="doc.number" />
        </div>
        <div class="mt-3 mb-3">
          <label for="time" class="label">дата</label><br>
          <Calendar id="time" @change="disableHoldButton($event, 'date')" @date-select="disableHoldButton($event, 'date')" v-model="dateInput" dateFormat="dd.mm.yy" :showIcon="true" />
        </div>
      </div>
      <div class="field col-12 md:col-5 center right">
        <div v-if="doc.doc_type === DocumentType.INVENTORY_DOC" class="mr-5">
          <Button label="Заполнить" class="p-button-rounded p-button-secondary mr-1" @click="onFillRestClick" :disabled="disabledFillItemRest"/>
          <Button icon="pi pi-plus" label="подчиненные" class="p-button-rounded p-button-secondary" @click="onCreateDocksClick" :disabled="hasRalative"/>
        </div>
      </div>
      <div class="field col-12 md:col-4">
        <label for="project" class="label">проект</label><br>
        <div class="p-inputgroup">
          <InputText id="project" type="text" class="p-inputtext" v-model="doc.project.name" />
          <Button icon="pi pi-check" class="p-button-warning" @click="onProjectClick" />
        </div>
      </div>
      <div class="field col-12 md:col-4">
        <label for="supplier_doc_number" class="label">номер входящего документа</label><br>
        <InputText id="supplier_doc_number" @change="onDocInfoChange" type="text" class="p-inputtext flex-inpyt" v-model="supplierDocNumber" />
      </div>
      <div class="field col-12 md:col-4"></div>

      <div v-if="!orderDoc" class="field col-12 md:col-8">
        <div class="formgrid grid">
          
          <div v-if="!orderDoc" class="field col-12 md:col-6">
            <div v-if="doc.storage_from">
              <label for="storageFrom" class="label">со склада</label><br>
              <div class="p-inputgroup">
                <InputText id="storageFrom" type="text" class="p-inputtext" v-model="doc.storage_from.name" :disabled="disabledStorageFrom" />
                <Button icon="pi pi-check" class="p-button-warning" @click="onStorageFromClick" :disabled="disabledStorageFrom" />
              </div>
            </div>
          </div>
          <div v-if="!orderDoc" class="field col-12 md:col-6">
            <div v-if="doc.storage_to">
            <label for="storageTo" class="label">на склад</label><br>
              <div class="p-inputgroup">
                <InputText id="storageTo" type="text" class="p-inputtext" v-model="doc.storage_to.name" :disabled="disabledStorageTo" />
                <Button icon="pi pi-check" class="p-button-warning" @click="onStorageToClick" :disabled="disabledStorageTo"/>
              </div>
            </div>
          </div>
          <!-- <div v-if="!orderDoc" class="field col-12 md:col-4"></div> -->

          <div v-if="doc.doc_type == DocumentType.POSTING_DOC" class="field col-12 md:col-6">
            <div v-if="doc.supplier">
              <label for="supplier" class="label">поставщик</label><br>
              <div class="p-inputgroup">
                <AutoComplete v-model="selectedSupplierName" :suggestions="filteredSuppliers" 
                    @complete="searchSupplier($event)" @item-select="setSupplierToDoc" @item-unselect="setSupplierToDoc" optionLabel="Номенклатура" />
                <!-- <InputText id="supplier" type="text" class="p-inputtext" v-model="doc.supplier.name" :disabled="disabledSupplier" />
                <Button icon="pi pi-check" class="p-button-warning" @click="onSupplierClick"/> -->
              </div>
            </div>
          </div>
          <div v-if="doc.doc_type == DocumentType.POSTING_DOC" class="field col-12 md:col-6">
            <div v-if="doc.recipient">
              <label for="recipient" class="label">получатель</label><br>
              <div class="p-inputgroup">
                <AutoComplete v-model="selectedRecipientName" :suggestions="filteredRecipients" 
                    @complete="searchRecipient($event)" @item-select="setRecipientToDoc" @item-unselect="setRecipientToDoc" optionLabel="Номенклатура" />
                <!-- <InputText id="recipient" type="text" class="p-inputtext" v-model="doc.recipient.name" />
                <Button icon="pi pi-check" class="p-button-warning" @click="onRecipientClick"/> -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div v-if="!orderDoc" class="field col-12 md:col-4">
        <label for="comment" class="label">комментарий</label><br>
        <Textarea id="comment" v-model="comment" @change="onDocInfoChange" rows="5" cols="30" style="height: 120px"/>
      </div> -->
      
      <div v-if="orderDoc" class="field col-12 md:col-4">
          <label for="individual" class="label">физ лицо</label><br>
          <div class="p-inputgroup">
            <InputText id="individual" type="text" class="p-inputtext" v-model="doc.individual.name" />
            <Button icon="pi pi-check" class="p-button-warning" @click="onIndividualClick"/>
          </div>
      </div>
      <div v-if="orderDoc" class="field col-12 md:col-4">
          <label for="payment_type" class="label">назначение платежа</label><br>
          <div class="p-inputgroup">
            <InputText id="payment_type" type="text" class="p-inputtext" v-model="doc.payment_type" />
            <Button icon="pi pi-check" class="p-button-warning" @click="onPaymentTypeClick"/>
          </div>
      </div>
      <div v-if="orderDoc" class="field col-12 md:col-4"></div>
      <div v-if="orderDoc" class="field col-12 md:col-4">
        <label for="amount" class="label">сумма</label><br>
        <InputText id="amount" @change="disableHoldButton" type="text" class="p-inputtext mr-1" v-model="doc.amount" />
      </div>
      <div v-if="orderDoc" class="field col-12 md:col-8">
        <label for="tax" class="label">сумма</label><br>
        <InputText id="tax" @change="disableHoldButton" type="text" class="p-inputtext mr-1" v-model="doc.tax" />
      </div>
      <div v-if="orderDoc" class="field col-12 md:col-8">
        <label for="comment" class="label">комментарий</label><br>
        <Textarea id="comment" v-model="comment" @change="onDocInfoChange" rows="5" cols="40" />
      </div>
    </div>
  </div>

  <div v-if="doc.check_info">
    <Divider align="left">
      <div class="inline-flex align-items-center">
        <i class="pi pi-paperclip mr-2"></i>
        информация из чека ККМ
      </div>
    </Divider>
    <div class="formgrid grid">
      <div class="field col-12 md:col-3">
        <label for="waiter" class="label">официант</label><br>
        <InputText id="waiter" @change="disableHoldButton" type="text" class="p-inputtext mr-1" v-model="doc.check_info.waiter" />
      </div>
      <div class="field col-12 md:col-3">
        <label for="check_number" class="label">номер чека</label><br>
        <InputText id="check_number" @change="disableHoldButton" type="text" class="p-inputtext mr-1" v-model="doc.check_info.check_number" />
      </div>
      <div class="field col-12 md:col-3">
        <label for="cash_register_number" class="label">номер кассы</label><br>
        <InputText id="cash_register_number" @change="disableHoldButton" type="text" class="p-inputtext mr-1" v-model="doc.check_info.cash_register_number" />
      </div>
      <div class="field col-12 md:col-3">
        <label for="amount_received" class="label">получено</label><br>
        <InputText id="amount_received" @change="disableHoldButton" type="text" class="p-inputtext mr-1" v-model="doc.check_info.amount_received" />
      </div>
      <div class="field col-12 md:col-3">
        <label for="table_number" class="label">стол</label><br>
        <InputText id="table_number" @change="disableHoldButton" type="text" class="p-inputtext mr-1" v-model="doc.check_info.table_number" />
      </div>
      <div class="field col-12 md:col-3">
        <label for="guest_number" class="label">гость</label><br>
        <InputText id="guest_number" @change="disableHoldButton" type="text" class="p-inputtext mr-1" v-model="doc.check_info.guest_number" />
      </div>
      <div class="field col-12 md:col-3">
        <label for="kkm_check_time" class="label">время</label><br>
        <Calendar id="kkm_check_time" @change="disableHoldButton" v-model="checkDateInput" :showTime="true" :showSeconds="true" dateFormat="dd.mm.yy" disabled/>
      </div>
      <div class="field col-12 md:col-3">
          <label for="check_payment_type" class="label">тип оплаты</label><br>
          <div class="p-inputgroup" style="{width: 150px}">
            <InputText id="check_payment_type" type="text" class="p-inputtext" v-model="doc.check_info.check_payment_type" />
            <Button icon="pi pi-check" class="p-button-warning" @click="onCheckPaymentTypeClick"/>
          </div>
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

  <Button  v-if="doc.doc_items" icon="pi pi-plus" @click="onAddItemClick(false)" class="p-button-text p-button-rounded" />
  <Button  v-if="doc.doc_items && isInventory" label="ПФ" @click="onAddItemClick(true)" class="p-button-text p-button-rounded" />
  
  <div v-if="doc.doc_items">
    <DataTable :value="doc.doc_items" :rowClass="rowClass" editMode="cell" 
        class="p-datatable-sm editable-cells-table" 
        @cell-edit-init="onCellEditInit" @cell-edit-complete="onCellEditComplete"
        v-model:expandedRows="expandedRows"
        :rowHover="true" responsiveLayout="scroll"> 
      <Column v-if="isInventory" :expander="true" style="max-width: 3rem" />
      <Column header="#" style="width:2rem">
        <template #body="{index}">{{index + 1}}</template>
      </Column>
      <Column v-if="isInventory" field="item_name" header="Наименование" key="item_name" filter style="min-width:12rem" />
      <Column v-if="!isInventory" field="item_name" header="Наименование" key="item_name" filter style="min-width:12rem">
        <template #editor="{ data, field }">
          <InputText @change="disableHoldButton" v-model="data[field]" autofocus/>
          <Button icon="pi pi-check" class="p-button-warning" @click="onItemClick(data)"/>
        </template>
      </Column>
      <Column field="unit" header=" " style="width:3rem"/>
      <Column v-if="!isMovement" field="quantity" key="quantity" style="width:8rem">
        <template #header><div class="text-right mr-2" style="width: 100%">Кол-во</div></template>
        <template #body="{data}"><div class="text-right pr-2" style="width: 100%">{{ formatQuantity(data.quantity) }}</div></template>
        <template #editor="{ data, field }">
          <InputNumber @change="disableHoldButton" v-model="data[field]" inputmode="none" :minFractionDigits="3" :maxFractionDigits="3" :useGrouping="false" />
        </template>
      </Column>
      <Column v-if="isInventory" field="quantity_fact" key="quantity_fact" style="width:9rem">
        <template #header><div class="text-right mr-2" style="width: 100%">Кол-во факт</div></template>
        <template #body="{data}"><div class="text-right pr-2" style="width: 100%">{{ formatQuantity(data.quantity_fact) }}</div></template>
        <template #editor="{ data, field }">
          <InputNumber @change="disableHoldButton($event, 'quantity_fact')" 
              @focus="onFocusAmountFact" v-model="data[field]" inputmode="none" :minFractionDigits="3" :maxFractionDigits="3" :useGrouping="false" />
        </template>
      </Column>
      <Column v-if="isMovement" field="quantity_fact" key="quantity_fact" style="width:8rem">
        <template #header><div class="text-right mr-2" style="width: 100%">Заявка</div></template>
        <template #body="{data}"><div class="text-right pr-2" style="width: 100%">{{ data.quantity_fact }}</div></template>
      </Column>
      <Column v-if="isMovement" field="quantity" key="quantity" style="width:8rem">
        <template #header><div class="text-right mr-2" style="width: 100%">Кол-во</div></template>
        <template #body="{data}"><div class="text-right pr-2" style="width: 100%">{{ formatQuantity(data.quantity) }}</div></template>
        <template #editor="{ data, field }">
          <InputNumber @change="disableHoldButton" v-model="data[field]" inputmode="none" :minFractionDigits="3" :maxFractionDigits="3" :useGrouping="false" />
        </template>
      </Column>
      <Column field="price" key="price" style="width:8rem">
        <template #header><div class="text-right mr-2" style="width: 100%">Цена</div></template>
        <template #body="{data}"><div class="text-right pr-2" style="width: 100%">{{ formatPrice(data.price) }}</div></template>
        <template #editor="{ data, field }">
          <InputNumber @change="disableHoldButton" v-model="data[field]" inputmode="none" :minFractionDigits="2" :maxFractionDigits="2" :useGrouping="false" />
        </template>
      </Column>
      <Column field="amount" key="amount" style="width:8rem">
        <template #header><div class="text-right mr-2" style="width: 100%">Сумма</div></template>
        <template #body="{data}"><div class="text-right pr-2" style="width: 100%">{{ formatPrice(data.amount) }}</div></template>
        <template #editor="{ data, field }">
          <InputNumber @change="disableHoldButton" v-model="data[field]" inputmode="none" :minFractionDigits="2" :maxFractionDigits="2" :useGrouping="false" />
        </template>
      </Column>
      <Column v-if="isInventory" field="amount_fact" key="amount_fact" style="width:9rem">
        <template #header><div class="text-right mr-2" style="width: 100%">Сумма факт</div></template>
        <template #body="{data}"><div class="text-right pr-2" style="width: 100%">{{ formatPrice(data.amount_fact) }}</div></template>
      </Column>
      <Column v-if="isCheck" field="discount" key="discount" style="width:8rem">
        <template #header><div class="text-right mr-2" style="width: 100%">Скидка</div></template>
        <template #body="{data}"><div class="text-right pr-2" style="width: 100%">{{ formatPrice(data.discount) }}</div></template>
        <template #editor="{ data, field }">
          <InputNumber @change="disableHoldButton" v-model="data[field]" inputmode="none" :minFractionDigits="2" :maxFractionDigits="2" :useGrouping="false" />
        </template>
      </Column>
      <Column style="width:2rem">
        <template #body="{data}">
          <Button icon="pi pi-minus" class="p-button-rounded p-button-secondary p-button-text" @click="deleteRow(data)" />
        </template>
      </Column>
      <Column style="width:2rem">
        <template #body="{index, data}">
          <div class="up-down-buttons">
            <i class="pi pi-angle-up arrow-button" @click="rowUp(index, data)" />
            <i class="pi pi-angle-down arrow-button" @click="rowDown(index, data)" />
          </div>
        </template>
      </Column>
      <ColumnGroup type="footer">
        <Row>
          <Column footer="сумма:" :colspan="colSpan" footerStyle="text-align:right" />
          <Column :footer="totalAmount" :colspan="colSpan2" />
          <Column v-if="isInventory" :footer="totalAmountFact" :colspan="3" />
        </Row>
      </ColumnGroup>
      <template #expansion="{data}">
        <div v-if="data.children" style="width: 100%">
          <DataTable :value="data.children" class="p-datatable-sm" responsiveLayout="scroll">
            <Column field="item_name" header="ингредиент" />
            <Column field="quantity_fact" header="количество" style="max-width: 9rem"
                class="justify-content-end mr-2" headerClass="justify-content-end mr-2">
              <template #body="{data}">{{ formatQuantity(data.quantity_fact) }}</template>
            </Column>
            <Column field="price" header="цена" style="max-width: 9rem"
                class="justify-content-end mr-2" headerClass="justify-content-end mr-2">
              <template #body="{data}">{{ formatPrice(data.price) }}</template>
            </Column>
            <Column field="amount_fact" header="сумма" style="max-width: 9rem"
                class="justify-content-end mr-2" headerClass="justify-content-end mr-2">
              <template #body="{data}">{{ formatPrice(data.amount_fact) }}</template>
            </Column>
          </DataTable>
        </div>
      </template>
    </DataTable> 
  </div>  

  <OverlayPanel ref="opCheckPaymentTypes">
    <DataTable :value="checkPaymentTypes" v-model:selection="selectedCheckPaymentType" selectionMode="single" 
        @rowSelect="onCheckPaymentTypeSelect" responsiveLayout="scroll" >
        <Column field="value" header="Name" sortable />
    </DataTable>
  </OverlayPanel>

  <OverlayPanel ref="opPaymentTypes">
    <DataTable :value="paymentTypes" v-model:selection="selectedPaymentType" selectionMode="single" 
        @rowSelect="onPaymentTypeSelect" responsiveLayout="scroll" >
        <Column field="value" header="Name" sortable />
    </DataTable>
  </OverlayPanel>
  <OverlayPanel ref="opProjects">
    <DataTable :value="projects" v-model:selection="selectedProject" selectionMode="single" 
        :paginator="true" :rows="5" @rowSelect="onProjectSelect" responsiveLayout="scroll" >
        <Column field="name" header="Проект" sortable />
    </DataTable>
  </OverlayPanel>
  <OverlayPanel ref="opUsers">
    <DataTable :value="users" v-model:selection="selectedUsers" selectionMode="single" 
        :paginator="true" :rows="5" @rowSelect="onUserSelect" responsiveLayout="scroll" >
        <Column field="name" header="ФИО" sortable style="width: 60%"/>
        <Column field="email" header="имаил" sortable style="width: 40%"></Column>
    </DataTable>
  </OverlayPanel>
  <OverlayPanel ref="opCompanies">
    <DataTable :value="companies" v-model:selection="selectedCompany" selectionMode="single" 
        sortField="name" :sortOrder="1"
        :paginator="true" :rows="10" @rowSelect="onCompanySelect" responsiveLayout="scroll" >
        <Column field="name" header="Наименование" sortable style="width:20rem"/>
        <Column field="inn" header="ИНН" sortable style="width: 40%"></Column>
    </DataTable>
  </OverlayPanel>
  <OverlayPanel ref="opStorage">
    <DataTable :value="storages" v-model:selection="selectedStorage" selectionMode="single" 
        :paginator="true" :rows="5" @rowSelect="onStorageSelect" responsiveLayout="scroll" >
        <Column field="name" header="Наименование" sortable />
    </DataTable>
  </OverlayPanel>

  <ItemChoose :displayItems="displayItems" :currentStorage="doc.storage_to"  :dateTime="doc.date_time" :factQuantity = "isInventory"
        :multiplySelect="multiplySelectItems" :complexItems="complexItems" @new-item-list="addItemsToDoc"/>

  <div id="numPad" class="num-pad" @click="outsideCloseNumPad($event)">
    <div class="modal-content border shadow"  @keyup="onKeyUp">
      <div class="formgrid grid" style="margin: 10px;">
          <div class="field col-12 md:col-12">
            <InputText id="inputDigit" v-model="digitValue" style="width: 100%;" readonly autofocus />
          </div>
          <div class="field col-12 md:col-3">
            <Button label="1" class="p-button-lg p-button-outlined p-button-secondary" @click="addDigit(1)" />
          </div>
          <div class="field col-12 md:col-3">
            <Button label="2" class="p-button-lg p-button-outlined p-button-secondary" @click="addDigit(2)" />
          </div>
          <div class="field col-12 md:col-3">
            <Button label="3" class="p-button-lg p-button-outlined p-button-secondary" @click="addDigit(3)" />
          </div>
          <div class="field col-12 md:col-3">
            <Button icon="pi pi-angle-left" class="p-button-lg p-button-outlined p-button-secondary p-button-text" @click="delDigit()" />
          </div>
          <div class="field col-12 md:col-3">
            <Button label="4" class="p-button-lg p-button-outlined p-button-secondary" @click="addDigit(4)" />
          </div>
          <div class="field col-12 md:col-3">
            <Button label="5" class="p-button-lg p-button-outlined p-button-secondary" @click="addDigit(5)" />
          </div>
          <div class="field col-12 md:col-3">
            <Button label="6" class="p-button-lg p-button-outlined p-button-secondary" @click="addDigit(6)" />
          </div>
          <div class="field col-12 md:col-3">
          </div>
          <div class="field col-12 md:col-3">
            <Button label="7" class="p-button-lg p-button-outlined p-button-secondary" @click="addDigit(7)" />
          </div>
          <div class="field col-12 md:col-3">
            <Button label="8" class="p-button-lg p-button-outlined p-button-secondary" @click="addDigit(8)" />
          </div>
          <div class="field col-12 md:col-3">
            <Button label="9" class="p-button-lg p-button-outlined p-button-secondary" @click="addDigit(9)" />
          </div>
          <div class="field col-12 md:col-3">
            <Button icon="pi pi-times" class="p-button-lg p-button-outlined p-button-warning" @click="closeNumPad()" />
          </div>
          <div class="field col-12 md:col-3"></div>
          <div class="field col-12 md:col-3">
            <Button label="0" class="p-button-lg p-button-outlined p-button-secondary" @click="addDigit(0)" />
          </div>
          <div class="field col-12 md:col-3">
            <Button label=" ." class="p-button-lg p-button-outlined p-button-secondary" @click="addDigit('.')" />
          </div>
          <div class="field col-12 md:col-3">
            <Button icon="pi pi-check" class="p-button-lg p-button-outlined p-button-success" @click="inserValue()" />
          </div>
      </div>
    </div>
  </div>

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
import {Property, DocumentType, PaymentType, CheckPaymentType} from '@/js/Constants';
import ItemChoose from '@/components/tables/ItemChoose.vue';
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';
import AutoComplete from 'primevue/autocomplete';

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
        ItemChoose,
        InputNumber,
        Textarea,
        AutoComplete
    },
    props: {
        docId: Number,
        type: String,
        docType: String
    },
    emits: {
        disableHoldButton: null,
        disableSaveButton: null,
        disableCurrentTime: null
    },
    data() {
      return {
        loading: false,
        user: null,
        selectedPaymentType: null,
        selectedCheckPaymentType: null,
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
        disabledFillItemRest: true,
        orderDoc: false,
        isInventory: false,
        isCheck: false,
        isMovement: false,
        colSpan: 5,  
        colSpan2: 3,              
        DocumentType: DocumentType,
        paymentTypes:[],
        checkPaymentTypes:[],
        displayItems: 1,
        multiplySelectItems: false,
        complexItrems: false,
        currentItem: undefined,
        baseDocId: 0,
        companyNames: null,
        digitValue: 0,
        isMobile: Boolean,
        documentItem: null,
        documentField: null,
        comment: "",
        supplierDocNumber: "",
        startPeriod: "",
        selectedSupplierName: "",
        filteredSuppliers: [],
        selectedRecipientName: "",
        filteredRecipients: [],
        complexItems: false,
        expandedRows: [],
        lastValue: 0
      };
    },
    computed: {
      doc() {
        return this.$store.state.ds.document;
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
      totalAmountFact() {
        let total = 0;
        for(let item of this.doc.doc_items) {
            total += item.price * item.quantity_fact;
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
        return this.$store.state.ss.period;        
      },
      blockTime() {
        return this.$store.state.ss.blockTime;
      },
      newDocNumber() {
        return this.$store.state.ds.newDocNumber;
      },
      systemSettingMap() {
        return this.$store.state.ss.systemSettingMap;
      },
      itemIngredients() {
        return this.$store.state.ds.itemIngredients;
      },
      hasRalative() {
        return this.$store.state.ds.hasRalative;
      }
    },
    mounted() {
      if(this.type === "copyFromRequestDoc") {
        this.$store.dispatch('getMovDocFromRequest', this.docId);
      } else {
        this.$store.dispatch('getDocument', [this.docId, this.docType, this.type === "copy"]);
      }
      if(this.type === "copy") {
        this.disableSaveButton(true);
      }
      this.user = JSON.parse(localStorage.getItem('user'));
      this.setPaymentTypes();
      this.setCheckPaymentTypes();
      this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      this.modalDiv = document.getElementById("numPad");
      this.startPeriod = new Date(this.period.start_date);
    },
    watch: {
      doc(value) { 
        if(this.doc.base_document_id != 0) {
            this.baseDocId = this.doc.base_document_id;
        }      
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
          let author = this.users.find(u => u.id == this.user.id);
          value.author = author;
          if(this.defaultProperties.length > 0) {
            if(value.project.id == 0) {
              let projectId = this.defaultProperties.find(prop => prop.type == Property.PROJECT).property;
              value.project = this.getProjectById(projectId);
            }
            if(!this.disabledStorageTo && value.storage_to.id == 0) {
              let storageToId = this.defaultProperties.find(prop => prop.type == Property.STORAGE_TO).property;
              value.storage_to = this.getStorageById(storageToId);
            }
            if(!this.disabledStorageFrom && value.storage_from.id == 0) {
              let storageFromId = this.defaultProperties.find(prop => prop.type == Property.STORAGE_FROM).property;
              value.storage_from = this.getStorageById(storageFromId);
            }
            if(this.systemSettingMap.get(Property.OUR_COMPANY_ID) != 0) {
              value.recipient = this.getRecipientById(this.systemSettingMap.get(Property.OUR_COMPANY_ID));
            }
          }
        }
        if(value.payment_type) {
          this.selectedPaymentType = {"value": value.payment_type};
        }
        if(value.storage_from) {
          this.selectedStorageFrom = value.storage_from.id
        }
        if(value.storage_to) {
          this.selectedStorageTo = value.storage_to.id
        }
        if(value.doc_type == DocumentType.CHECK_DOC) {
          this.isCheck = true;
          this.colSpan2++;
        }
        if(value.doc_type == DocumentType.INVENTORY_DOC) {
          this.isInventory = true;
          this.colSpan+=2;
          this.colSpan2 -= 2;
        }
        if(value.doc_type == DocumentType.MOVEMENT_DOC && this.baseDocId) {
          this.isMovement = true;
          this.colSpan++;     }
          this.selectedProject = value.project
          this.dateInput = value.date_time;
        if(value.check_info) {
          this.checkDateInput = value.check_info.date_time;
        }
        this.enableFillItemRestButton();
        if(value.doc_info) {
          this.comment = value.doc_info.comment;
          this.supplierDocNumber = value.doc_info.supplier_doc_number;
        }
        if(value.supplier) {
          this.selectedSupplierName = value.supplier.name;
          this.selectedRecipientName = value.recipient.name;
        }
        if(this.isInventory) {
          this.$store.dispatch('checkRelativeDocuments', value.id);
        }
      },
      itemRest(value) {
        this.doc.doc_items = value;
      },
      dateInput(value) {
        this.doc.date_time = value;
      },
      items() {
        this.loading = false;
      },
      companies(value) {
        this.companyNames = value.map(function(company){return company.name})
      },
      period(value) {
        this.startPeriod = new Date(value.start_date);
      },
      itemIngredients(docItems) {
        for(let docItem of docItems.data.doc_item_list) {
          let index = this.doc.doc_items.findIndex(item => item.item_id == docItem.item_id);
          this.doc.doc_items[index].children = docItem.children;
        }
      }
    },
    methods: {
      searchSupplier(event) {
        if (!event.query.trim().length) {
          this.filteredSuppliers = [...this.company];
        }
        else {
          this.filteredSuppliers = this.companies.filter((company) => {
            return company.name.toLowerCase().includes(event.query.toLowerCase());
          }).map(company => company.name);
        } 
      },
      searchRecipient(event) {
        if (!event.query.trim().length) {
          this.filteredRecipients = [...this.company];
        }
        else {
          this.filteredRecipients = this.companies.filter((company) => {
            return company.name.toLowerCase().includes(event.query.toLowerCase());
          }).map(company => company.name);
        } 
      },
      setSupplierToDoc() {
        this.doc.supplier = this.companies.find(company => company.name == this.selectedSupplierName);
        this.$emit('disableHoldButton');
      },
      setRecipientToDoc() {
        this.doc.recipient = this.companies.find(company => company.name == this.selectedRecipientName);
        this.$emit('disableHoldButton');
      },
      onDocInfoChange(event) {
        this.disableHoldButton();
        if(!this.doc.doc_info) {
          this.doc.doc_info = {"id" : 0};
        }
        if(event.target.id == 'comment') {
          this.doc.doc_info.comment = event.target.value;
        } else {
          this.doc.doc_info.supplier_doc_number = event.target.value;
        }
      },
      addDigit(digit) {
        if(this.digitValue == '0') this.digitValue = '';
        this.digitValue += "" + digit;
        document.getElementById('inputDigit').focus();
      },
      delDigit() {
        if(this.digitValue.length == 1) {
          this.digitValue = '0';
          document.getElementById('inputDigit').focus();
          return;
        }
        this.digitValue = this.digitValue.substring(0, this.digitValue.length-1);
        document.getElementById('inputDigit').focus();
      },
      inserValue() {
        this.documentItem[this.documentField] = Number(this.digitValue);
        this.setFields(this.documentItem, this.documentField);
        document.getElementById('numPad').style.display='none';
        this.documentItem = null;
        this.documentField = null;
      },
      openNumPud(data, field) {
        this.documentItem = data;
        this.documentField = field;
        this.digitValue = 0;
        document.getElementById('numPad').style.display='block';
        document.getElementById('inputDigit').focus();
        
      },
      outsideCloseNumPad(event) {
        if(event.target == this.modalDiv) {
          this.closeNumPad();
        }
      },
      closeNumPad() {
        this.modalDiv.style.display='none';
        this.documentItem = null;
        this.documentField = null;
      },
      onKeyUp(event) {
        let key = event.key;
        if(key > -1 && key < 10) {
          this.addDigit(key);
        }
        if(key == ',' || key == '.') {
          if(!this.digitValue.includes('.')) {
            this.addDigit('.');
          }
        }
        if(key == 'Backspace' || key == 'Delete' || key == ' ') {
          this.delDigit();
        }
      },
      virtualKeyboard() {
        blur();
        this.$refs.keyboard.toggle(event);
      },
      setPaymentTypes() {
        this.paymentTypes = [];
        for(var i in PaymentType) {
            this.paymentTypes.push({'value': PaymentType[i] });
        }
      },
      setCheckPaymentTypes() {
        this.checkPaymentTypes = [];
        for(var i in CheckPaymentType) {
            this.checkPaymentTypes.push({'value': CheckPaymentType[i] });
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
      disableHoldButton(event, inputName) {
        if(inputName == 'date') {
          this.$emit('disableCurrentTime');
          if(event < this.startPeriod || (event <= this.blockTime && this.systemSettingMap.get(Property.DOC_BLOCK_ENABLE) == 1)) {
            this.disableSaveButton(true);
          } else {
            this.disableSaveButton(false);
          }
        }
        this.$emit('disableHoldButton');
      },
      disableSaveButton(value) {
        this.$emit('disableSaveButton', value);
      },
      getProjectById(id) {
        return this.projects.find(project => project.id == id);
      },
      getStorageById(id) {
        return this.storages.find(storage => storage.id == id);
      },
      getRecipientById(id) {
        return this.companies.find(company => company.id == id);
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
      rowUp(index, data) {
        if(index > 0) {
          let currentData = this.doc.doc_items[index - 1];
          this.doc.doc_items[index - 1] = data;
          this.doc.doc_items[index] = currentData;
        }
      },
      rowDown(index, data) {
        if(index < this.doc.doc_items.length - 1) {
          let currentData = this.doc.doc_items[index + 1];
          this.doc.doc_items[index + 1] = data;
          this.doc.doc_items[index] = currentData;
        }
      },
      onPaymentTypeClick(event) {
        this.$refs.opPaymentTypes.toggle(event);
      },
      onCheckPaymentTypeClick(event) {
        this.$refs.opCheckPaymentTypes.toggle(event);
      },
      onPaymentTypeSelect(event) {
        this.doc.payment_type = event.data.value;
        this.$refs.opPaymentTypes.hide();
        this.$emit('disableHoldButton');
      },
      onCheckPaymentTypeSelect(event) {
        this.doc.check_info.check_payment_type = event.data.value;
        this.$refs.opCheckPaymentTypes.hide();
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
      onCreateDocksClick() {
        this.$store.dispatch('addRelativeDocks', this.doc);
      },
      onCellEditComplete(event) {
        let { data, newValue, field } = event;
        if(field != 'item_name') {
          if(newValue == null) newValue = 0;
          data[field] = newValue;
        }
        this.setFields(data, field);  
      },
      setFields(data, field) {
        if(field === 'quantity' || field === 'quantity_fact' || field === 'price' || field === 'discount') {
          data['amount'] = this.formatPrice((data['price'] * data['quantity']) - data['discount']);
          if(this.doc.doc_type == this.DocumentType.INVENTORY_DOC) {
            data['amount_fact'] = this.formatPrice(data['price'] * data['quantity_fact']);
          }
        } else if (field === 'amount') {
          if(data['quantity'] > 0) {
            data['price'] = this.formatPrice(data['amount'] / data['quantity']);
            if(this.doc.doc_type == this.DocumentType.INVENTORY_DOC) {
              data['amount_fact'] = this.formatPrice(data['price'] * data['quantity_fact']);
            }
          }
        }
      },
      formatPrice(value) {
        return Number(value).toFixed(2);
      },
      formatQuantity(value) {
        return Number(value).toFixed(3);
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
      onIndividualClick(event) {
        this.userType = 'individual';
        this.$refs.opUsers.toggle(event);
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
      onItemClick(item) {
        this.currentItem = item;
        this.multiplySelectItems = false;
        this.$store.dispatch('getItemsWithRest', this.doc.date_time);
        this.displayItems++;
      },
      onAddItemClick(complex) {
        this.multiplySelectItems = true;
        this.complexItems = complex;
        if(complex) {
          this.$store.dispatch('getAllItems', false);
        } else {
          this.$store.dispatch('getItemsWithRest', this.doc.date_time);
        }
        this.displayItems++;
      },
      onCellEditInit(event) {
        let { data, field } = event;
        if(field == "item_name") {
          this.currentField = field;
          this.currentData = data;
        } else {
          if(this.isMobile) {
            this.openNumPud(data, field);
          }
        }
      },
      addItemsToDoc(newItemList) {
        if(newItemList.length == 0) return;
        let curItem;
        if (this.multiplySelectItems) {
          for(let item of newItemList) {
            curItem = this.doc.doc_items.find(i => i.item_id == item.item_id);
            if (curItem && curItem.item_id) {
              if(this.isInventory) {
                curItem.quantity_fact = item.quantity_fact;
                curItem.amount_fact = this.formatPrice(item.amount_fact);
              } else {
                curItem.quantity = item.quantity;
                curItem.amount = this.formatPrice(item.amount);
              }
            } else {
              this.doc.doc_items.push(item);
            }
          }
        } else {
          let item = newItemList[0];
          if (this.currentItem != undefined) {
              let curItem = this.doc.doc_items.find(i => i.item_id == this.currentItem.item_id);
              curItem.item_name = item.item_name;
              curItem.item_id = item.item_id;
          }
          this.currentItem = undefined;
        }
        this.$emit('disableHoldButton');
        this.$store.dispatch('getIngredientsOfItems', newItemList);
      },
      copyDocItems() {
        let docItems = [];
        for(let item of this.doc.doc_items) {
          docItems.push(Object.assign(item));
        }
        return docItems;
      },
      onFocusAmountFact(event) {
        this.lastValue = event.target.value;
      }
    }

}

</script>

<style scoped>
  .up-down-buttons {
    cursor: pointer;
    margin: 0px;
    padding: 0px;
  }
  .arrow-button {
    margin: 0px;
    padding: 0px;
  }
  .arrow-button:hover {
    background-color: #ffffff;
  }
  .num-pad {
    display: none;
    position: fixed;
    z-index: 100;
    padding-top: 100px;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0,0,0);
    background-color: rgba(0,0,0,0.4);
  }
  .shadow {
    box-shadow: 5px 5px 5px rgba(0,0,0,0.3);
    padding: 10px;
  }
  .modal-content {
    background-color: #fefefe;
    margin: auto;
    width: 300px; 
    height: 320px;
  }
  ::v-deep(.row-composite) {
      background-color: rgba(255, 0, 0, 0.15) !important;
  }
  .buttonContainer {
    display: flex;
    margin: 8px;
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
  .medium-inpyt {
    width: 150px;
  }
  .smallinput {
    width: 100px;
  }
  .flex-inpyt {
    width: 100%;
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
  .p-dialog, :deep(.p-dialog) {
    height : 500px;
    width : 900px;
  }
  ::v-deep(.p-inputnumber-input) {
    width: 100px;
  }
</style>