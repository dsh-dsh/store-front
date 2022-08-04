<template>
    <br>
    <div class="formgrid grid">
        <div class="col-12 md:col-7 center">
            <h4>{{ header }}</h4>
        </div>
        <div class="col-12 md:col-5 center">
            <div class="center right">
                <div v-if="doc.doc_type === DocumentType.REQUEST_DOC" class="mr-2">
                    <Button label="Перемещение" class="p-button-rounded p-button-secondary p-button-outlined" @click="onRequestClick"/>
                </div>
                <div class="mr-2">
                    <Button label="Изменить" class="p-button-sm p-button-rounded p-button-secondary" @click="onUpdateClick" :disabled="enableRedactoring" />
                </div>
                <div>
                    <Button label="Копировать" class="p-button-sm p-button-rounded p-button-secondary" @click="onCopyClick"/>
                </div>
            </div>
        </div>
    </div>

    <div v-if="doc.author" class="formgrid grid">
        <div class="col-12 md:col-4">
            <label for="author" class="label">автор</label>
            <p id="author" class="text_field">{{ doc.author.name }}</p>
        </div>
        <div class="col-12 md:col-4">
            <label for="project" class="label">проект</label>
            <p id="project" class="text_field">{{ doc.project.name }}</p>
        </div>
        <div class="col-12 md:col-4"></div>

        <div v-if="doc.doc_items" class="col-12 md:col-4">
            <label for="storageFrom" class="label">со склада</label>
            <p id="storageFrom" class="text_field">{{ (doc.storage_from? doc.storage_from.name:'') }}</p>
        </div>
        <div v-if="doc.doc_items" class="col-12 md:col-4">
            <label for="storageTo" class="label">на склад</label>
            <p id="storageTo" class="text_field">{{ (doc.storage_to? doc.storage_to.name:'') }}</p>
        </div>
        <div v-if="doc.doc_items" class="col-12 md:col-4"></div>

        <div v-if="doc.doc_type == DocumentType.POSTING_DOC" class="field col-12 md:col-4">
            <label for="supplier" class="label">отправитель</label>
            <p id="supplier" class="text_field">{{ (doc.supplier? doc.supplier.name:'') }}</p>
        </div>
        <div v-if="doc.doc_type == DocumentType.POSTING_DOC" class="field col-12 md:col-4">
            <label for="recipient" class="label">получатель</label>
            <p id="recipient" class="text_field">{{ (doc.recipient? doc.recipient.name:'') }}</p>
        </div>
        <div v-if="doc.doc_type == DocumentType.POSTING_DOC" class="field col-12 md:col-4"></div>
    </div>
    
    <div v-if="doc.check_info">
        <Divider align="left">
            <div class="inline-flex align-items-center">
            <i class="pi pi-user mr-2"></i>
            информация из чека ККМ
            </div>
        </Divider>
        <div class="formgrid grid">
            <div class="col-12 md:col-3">
                <label for="waiter" class="label">официант</label>
                <p id="waiter" class="text_field sm">{{ doc.check_info.waiter }}</p>
            </div>
            <div class="col-12 md:col-3">
                <label for="check_number" class="label">номер чека</label>
                <p id="check_number" class="text_field sm">{{ doc.check_info.check_number }}</p>
            </div>
            <div class="col-12 md:col-3">
                <label for="cash_register_number" class="label">номер кассы</label>
                <p id="cash_register_number" class="text_field sm">{{ doc.check_info.cash_register_number }}</p>
            </div>
            <div class="col-12 md:col-3">
                <label for="amount_received" class="label">получено</label>
                <p id="amount_received" class="text_field sm">{{ doc.check_info.amount_received }}</p>
            </div>
            <div class="col-12 md:col-3">
                <label for="table_number" class="label">стол</label>
                <p id="table_number" class="text_field sm">{{ doc.check_info.table_number }}</p>
            </div>
            <div class="col-12 md:col-3">
                <label for="guest_number" class="label">гость</label>
                <p id="guest_number" class="text_field sm">{{ doc.check_info.guest_number }}</p>
            </div>
            <div class="col-12 md:col-3">
                <label for="kkm_check_time" class="label">время</label>
                <p id="kkm_check_time" class="text_field sm">{{ checkDate }}</p>
            </div>
            <div class="col-12 md:col-3">
            </div>
            <div class="col-12 md:col-2 center">
                <p>возврат </p>
                <img  v-if="doc.check_info.is_return" src="../../dist/img/v.png" class="ml-2" />
                <img  v-else src="../../dist/img/o.png" class="ml-2" />
            </div>
            <div class="col-12 md:col-2 center">
                <p>пробит </p>
                <img  v-if="doc.check_info.is_KKM_checked" src="../../dist/img/v.png" class="ml-2" />
                <img  v-else src="../../dist/img/o.png" class="ml-2" />
            </div>
            <div class="col-12 md:col-2 center">
                <p>оплачен </p>
                <img  v-if="doc.check_info.is_payed" src="../../dist/img/v.png" class="ml-2" />
                <img  v-else src="../../dist/img/o.png" class="ml-2" />
            </div>
            <div class="col-12 md:col-2 center">
                <p>эквайринг </p>
                <img  v-if="doc.check_info.is_payed_by_card" src="../../dist/img/v.png" class="ml-2" />
                <img  v-else src="../../dist/img/o.png" class="ml-2" />
            </div>
            <div class="col-12 md:col-2 center">
                <p>доставка </p>
                <img  v-if="doc.check_info.is_delivery" src="../../dist/img/v.png" class="ml-2" />
                <img  v-else src="../../dist/img/o.png" class="ml-2" />
            </div>
        </div>
    </div>

    <div v-if="!doc.doc_items">
        <div class="formgrid grid">
            <div class="col-12 md:col-4">
                <label for="individual" class="label">
                    {{ (doc.doc_type == DocumentType.WITHDRAW_ORDER_DOC? 'получатель' : 'плательщик') }}
                </label><br>
                <p id="individual" class="text_field">{{ getName(doc.individual) }}</p>
            </div>
            <div class="col-12 md:col-8"></div>

            <div class="field col-12 md:col-8">
                <label for="payment_type" class="label">назначение платежа</label><br>
                <p id="payment_type" class="text_field lm">{{ doc.payment_type }}</p>
            </div>
            <div class="field col-12 md:col-4"></div>

            <div class="field col-12 md:col-4">
                <label for="amount" class="label">сумма</label><br>
                <p id="amount" class="text_field">{{ doc.amount }}</p>
            </div>
            <div class="field col-12 md:col-4">
                <label for="tax" class="label">оплата налога</label><br>
                <p id="tax" class="text_field">{{ doc.tax }}</p>
            </div>
            <div class="field col-12 md:col-4"></div>
        </div>
    </div>

    <br>

    <div v-if="doc.doc_items">
      <DataTable :value="doc.doc_items" editMode="cell" class="p-datatable-sm" responsiveLayout="scroll">
        <Column field="item_name" header="Наименование" key="item_name"></Column>
        <Column field="quantity" header="Количество" key="quantity"></Column>
        <Column v-if="isInventory" field="quantity_fact" header="Фактически" key="quantity_fact"></Column>
        <Column field="price" header="Цена" key="price"></Column>
        <Column field="amount" header="Сумма" key="price"></Column>
        <Column v-if="isCheck" field="discount" header="Скидка" key="discount"></Column>
        <ColumnGroup type="footer">
          <Row>
              <Column footer="сумма:" :colspan="colSpan" footerStyle="text-align:right" />
              <Column :footer="totalAmount" />
          </Row>
        </ColumnGroup>
      </DataTable> 
    </div>      
</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';     //optional for column grouping
import Row from 'primevue/row'; 
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import {DocumentType} from '@/js/Constants';

export default {
    name: 'Document',
    components: {
        DataTable,
        Column,
        ColumnGroup,
        Row,
        Button,
        Divider
    },
    data() {
        return {
            header: '',
            checkDate: '',
            isInventory: false,
            isCheck: false,
            colSpan: 3,
            DocumentType: DocumentType,
            enableRedactoring: false
        };
    },
    props: {
        docId: Number
    },
    emits: {
        openUpdateDoc: null,
        openCopyDoc: null,
        copyToRequestDoc: null
    },
    computed: {
        doc() {
            return this.$store.state.ds.document
        },
        totalAmount() {
          let total = 0;
          for(let item of this.doc.doc_items) {
              total += (item.price * item.quantity) - item.discount;
          }
          return this.formatCurrency(total);
        }
    },
    methods: {
        getName(value) {
        if(value) {
            return value.name;
        }
        },
        formatCurrency(value) {
            return value.toLocaleString('re-RU', {style: 'currency', currency: 'RUB'});
        },
        onRequestClick() {
            this.$emit('copyToRequestDoc', this.doc);
        },
        onUpdateClick() {
            this.$emit('openUpdateDoc', this.doc);
        },
        onCopyClick() {
            this.$emit('openCopyDoc', this.doc);
        },
    },
    mounted() {
        this.$store.dispatch('getDocument', [this.docId, ""]);
    },
    watch: {
        doc(value) {
            let header = "Документ " + value.doc_type + " № " + value.number + 
            " от " + formatDate(value.date_time);
            if(value.is_hold) {
                header += " (проведен)";
            } else if(value.is_deleted) {
                header += " (удален)";
            } else {
                header += " (не проведен)";
            }
            this.header = header;
            if(value.check_info) {
                this.checkDate = formatDate(value.check_info.date_time, true);
            }
            if(value.doc_type == DocumentType.CHECK_DOC) {
                this.isCheck = true;
                this.colSpan++;
            }
            if(value.doc_type == DocumentType.INVENTORY_DOC) {
                this.isInventory = true;
                this.colSpan++;
            }
            let user = JSON.parse(localStorage.getItem('user'));
            this.enableRedactoring = user.id != value.author.id; 
        }
    }
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
  .label {
    margin: 0px;
    display: inline-block;
  }
  .text_field {
    width: 300px;
    height: 35px;
    margin: 5px 0px;
    padding: 5px 10px;
    background-color: rgb(247, 243, 238);
    border-radius: 5px
  }
  .sm {
    width: 180px;
  }
  .lm {
    width: 500px;
  }
  .inline {
    display: inline;
  }
  .center {
    display: flex;
    align-items: center;
  }
  .right {
    margin-left: auto;
  }
  .ml-2 {
    margin-left: 10 px;
  }
  .mr-2 {
    margin-right: 10 px;
  }
</style>