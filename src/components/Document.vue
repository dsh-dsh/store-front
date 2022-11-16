<template>
    <br>
    <div class="formgrid grid">
        <div class="col-12 md:col-7 center">
            <h4>{{ header }}</h4>
            <!-- <Button v-if="baseDocId" label="документ основание" class="p-button-sm p-button-text ml-2" @click="openBaseDoc"/> -->
        </div>
        <div class="col-12 md:col-5 center">
            <div class="center right">
                <div v-if="doc.doc_type === DocumentType.REQUEST_DOC" class="mr-2">
                    <Button label="Перемещение" class="p-button-rounded p-button-secondary p-button-outlined" @click="onRequestClick"/>
                </div>
                <div class="mr-2">
                    <Button label="Изменить" class="p-button-rounded p-button-secondary" @click="onUpdateClick" :disabled="disableRedactoring" />
                </div>
                <div>
                    <Button label="Копировать" class="p-button-rounded p-button-secondary" @click="onCopyClick"/>
                </div>
            </div>
        </div>
    </div>

    <div v-if="doc.author" class="grid" style="max-width: 750px">
        <div class="col-4">
            <label for="author" class="label">автор</label>
            <p id="author" class="text_field">{{ doc.author.name }}</p></div>
        <div class="col-4">
            <label for="project" class="label">проект</label>
            <p id="project" class="text_field">{{ doc.project.name }}</p></div>
        <div class="col-4">
            <div v-if="doc.doc_info && doc.doc_info.supplier_doc_number">
                <label for="supplier_doc_number" class="label">номер приходной накладной</label>
                <p id="supplier_doc_number" class="text_field">{{ doc.doc_info.supplier_doc_number }}</p>
            </div></div>
        <div v-if="doc.doc_items" class="col-8">
            <div class="grid">
                <div class="col-6">
                    <label for="storageFrom" class="label">со склада</label>
                    <p id="storageFrom" class="text_field">{{ (doc.storage_from? doc.storage_from.name:'') }}</p>
                </div>
                <div class="col-6">
                    <label for="storageTo" class="label">на склад</label>
                    <p id="storageTo" class="text_field">{{ (doc.storage_to? doc.storage_to.name:'') }}</p>
                </div>
            </div>
            <div v-if="doc.doc_type == DocumentType.POSTING_DOC" class="grid">
                <div class="col-6">
                    <label for="supplier" class="label">отправитель</label>
                    <p id="supplier" class="text_field white-space-nowrap overflow-hidden text-overflow-ellipsis">
                        {{ (doc.supplier? doc.supplier.name:'') }}</p>
                </div>
                <div class="col-6">
                    <label for="recipient" class="label">получатель</label>
                    <p id="recipient" class="text_field white-space-nowrap overflow-hidden text-overflow-ellipsis">
                        {{ (doc.recipient? doc.recipient.name:'') }}</p>
                </div>
            </div>
        </div>
        <div v-if="doc.doc_items" class="col-4">
            <div v-if="doc.doc_info && doc.doc_info.comment">
                <label for="comment" class="label">комментарий</label>
                <p id="comment" class="text_field for-comment white-space-nowrap overflow-hidden text-overflow-ellipsis">
                    {{ doc.doc_info.comment }}</p>
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
                <img  v-if="doc.check_info.is_return" src="../../src/assets/img/v.png" class="ml-2" />
                <img  v-else src="../../src/assets/img/o.png" class="ml-2" />
            </div>
            <div class="col-12 md:col-2 center">
                <p>пробит </p>
                <img  v-if="doc.check_info.is_KKM_checked" src="../../src/assets/img/v.png" class="ml-2" />
                <img  v-else src="../../src/assets/img/o.png" class="ml-2" />
            </div>
            <div class="col-12 md:col-2 center">
                <p>оплачен </p>
                <img  v-if="doc.check_info.is_payed" src="../../src/assets/img/v.png" class="ml-2" />
                <img  v-else src="../../src/assets/img/o.png" class="ml-2" />
            </div>
            <div class="col-12 md:col-2 center">
                <p>эквайринг </p>
                <img  v-if="doc.check_info.is_payed_by_card" src="../../src/assets/img/v.png" class="ml-2" />
                <img  v-else src="../../src/assets/img/o.png" class="ml-2" />
            </div>
            <div class="col-12 md:col-2 center">
                <p>доставка </p>
                <img  v-if="doc.check_info.is_delivery" src="../../src/assets/img/v.png" class="ml-2" />
                <img  v-else src="../../src/assets/img/o.png" class="ml-2" />
            </div>
        </div>
    </div>

    <div v-if="!doc.doc_items" class="formgrid grid" style="max-width: 750px"> 
        <div v-if="doc.individual" class="col-12 md:col-4">
            <label for="individual" class="label">
                {{ (doc.doc_type == DocumentType.WITHDRAW_ORDER_DOC? 'получатель' : 'плательщик') }}
            </label><br>
            <p id="individual" class="text_field white-space-nowrap overflow-hidden text-overflow-ellipsis">
                {{ getName(doc) }}</p>
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

        <div class="field col-12 md:col-8">
            <div v-if="doc.doc_info && doc.doc_info.comment">
                <label for="comment" class="label">комментарий</label>
                <p id="comment" class="text_field for-comment overflow-hidden text-overflow-ellipsis">{{ doc.doc_info.comment }}</p>
            </div>
        </div>
        <div class="field col-12 md:col-4"></div>
    </div>
    <br>

    <div v-if="doc.doc_items">
      <DataTable :value="doc.doc_items" editMode="cell" class="p-datatable-sm" 
        responsiveLayout="scroll" :rowHover="true"> 
        <!-- :scrollable="true" scrollHeight="flex"> -->
        <Column header="#" style="width: 2rem">
            <template #body="{index}">
                {{index + 1}}
            </template>
        </Column>
        <Column field="item_name" header="Наименование" key="item_name" style="min-width:12rem"></Column>
        <Column v-if="!isMovement" field="quantity" header="Кол-во" key="quantity" style="width:7rem"></Column>
        <Column v-if="isInventory || isMovement" field="quantity_fact" :header="quantityColumnName" key="quantity_fact" style="width:7rem"></Column>
        <Column v-if="isMovement" field="quantity" header="Кол-во" key="quantity" style="width:7rem"></Column>
        <Column field="price" header="Цена" key="price" style="width:7rem"></Column>
        <Column field="amount" header="Сумма" key="amount" style="width:7rem"></Column>
        <Column v-if="isInventory" field="amount_fact" header="Сумма факт." key="amount_fact" style="width:7rem"></Column>
        <Column v-if="isCheck" field="discount" header="Скидка" key="discount" style="width:7rem"></Column>
        <ColumnGroup type="footer">
          <Row>
            <Column footer="сумма:" :colspan="colSpan" footerStyle="text-align:right" />
            <Column v-if="!isMovement" :footer="totalAmount" />
            <Column v-if="isInventory || isMovement" :footer="totalAmountFact" />
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
            isMovement: false,
            isCheck: false,
            isPosting: false,
            colSpan: 4,
            DocumentType: DocumentType,
            disableRedactoring: false,
            baseDocId: 0,
            quantityColumnName: 'Кол-во факт.',
            startPeriod: null,
        };
    },
    props: {
        docId: Number
    },
    emits: {
        openUpdateDoc: null,
        openCopyDoc: null,
        copyFromRequestDoc: null,
        openBaseDoc: null
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
        },
        totalAmountFact() {
          let total = 0;
          for(let item of this.doc.doc_items) {
              total += item.price * item.quantity_fact;
          }
          return this.formatCurrency(total);
        },
        period() {
            return this.$store.state.ss.period;
        },
        blockTime() {
            return this.$store.state.ss.blockTime;
        },
    },
    methods: {
        getName(doc) {
        if(doc.individual.id > 0) {
            return doc.individual.name;
        } else {
            return doc.recipient.name;
        }
        },
        formatCurrency(value) {
            return value.toLocaleString('re-RU', {style: 'currency', currency: 'RUB'});
        },
        onRequestClick() {
            this.$emit('copyFromRequestDoc', this.doc);
        },
        onUpdateClick() {
            this.$emit('openUpdateDoc', this.doc);
        },
        onCopyClick() {
            this.$emit('openCopyDoc', this.doc);
        },
        openBaseDoc() {
            this.$emit('openBaseDoc', this.baseDocId);
        },
        setEnableRedactoring(user, value) {
            this.disableRedactoring = (user.id != value.author.id && user.role != 'ADMIN');
            if(value.date_time < this.startPeriod || value.date_time <= this.blockTime) {
                this.disableRedactoring = true;
            }
        }
    },
    mounted() {
        this.$store.dispatch('getDocument', [this.docId, ""]);
        if(this.period) {
            this.startPeriod = new Date(this.period.start_date);
        }
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
            if(value.is_payed) {
                header += " (оплачен)";
            }
            if(this.doc.base_document_id != 0) {
                this.baseDocId = this.doc.base_document_id;
            }
            this.header = header;
            if(value.check_info) {
                this.checkDate = formatTime(value.check_info.date_time, true);
            }
            if(value.doc_type == DocumentType.CHECK_DOC) {
                this.isCheck = true;
                this.colSpan++;
            }
            if(value.doc_type == DocumentType.MOVEMENT_DOC && this.baseDocId) {
                this.isMovement = true;
                this.colSpan++;
                this.quantityColumnName = 'Заявка';
            }
            if(value.doc_type == DocumentType.INVENTORY_DOC) {
                this.isInventory = true;
                this.colSpan++;
            }
            let user = JSON.parse(localStorage.getItem('user'));
            this.setEnableRedactoring(user, value); 
        },
        period(val) {
            this.startPeriod = new Date(val.start_date);
        },
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

function formatTime(date) {
    let params = {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };
    return date.toLocaleString("ru-Ru", params);
}

</script>

<style scoped>
  .border {
    border: 1px solid #dee2e6;
    border-radius: 3px;
  }
  .label {
    margin: 0px;
    display: inline-block;
  }
  .text_field {
    width: 220px;
    height: 35px;
    margin: 5px 0px;
    padding: 5px 10px;
    background-color: rgb(247, 243, 238);
    border-radius: 5px
  }
  .for-comment{
    width: 350px;
    height: 110px;
  }
  .sm {
    width: 150px;
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
  .ml-4 {
    margin-left: 50 px;
  }
  .mr-2 {
    margin-right: 10 px;
  }
</style>