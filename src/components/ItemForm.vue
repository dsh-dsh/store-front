
<template>
    <div>
        <div class="itemform">
            <div class="header">
                <Button label="Новая номенклатура" @click="addNewItem" class="p-button-rounded p-button-secondary p-button-sm" />
            </div>
            <div class="formgrid grid form">

                <div class="field col-12 md:col-12">
                    <span class="p-float-label">
                        <Calendar v-model="formDate" class="longinput" :showIcon="true" dateFormat="dd.mm.yy" />
                    </span>
                </div>

                <div class="field col-12 md:col-6">
                    <span class="p-float-label">
                        <InputText id="itemname" class="longinput" type="text" v-model="item.name" />
                        <label for="itemname">Наименование</label>
                    </span>
                </div>
                <div class="field col-12 md:col-6">
                    <span class="p-float-label">
                        <InputText id="printname" class="longinput" type="text" v-model="item.print_name" />
                        <label for="printname">Наименование для печати</label>
                    </span>
                </div>

                <div class="field col-12 md:col-6">
                    <div class="p-inputgroup longinput">
                        <InputText v-model="retailPrice" placeholder="Цена" @change="setPrice($event, 'RETAIL')" style="text-align: end"/>
                        <span class="p-inputgroup-addon">.00</span>
                    </div>
                </div>
                <div class="field col-12 md:col-6">
                    <div class="p-inputgroup longinput">
                        <span class="p-inputgroup-addon" @click="calculateDeliveryPrice">+</span>
                        <InputText v-model="deliveryPrice" placeholder="Цена на доставку" @change="setPrice($event, 'DELIVERY')" style="text-align: end" />
                        <span class="p-inputgroup-addon">.00</span>
                    </div>
                </div>

                <div class="field col-12 md:col-6">
                    <div id="aaa" class="p-inputgroup longinput">
                        <InputText id="unit" type="text" placeholder="Еденица" v-model="selectedUnit.name" />
                        <Button icon="pi pi-check" class="p-button-warning" @click="onUnitClick"/>
                    </div>
                </div>
                <div class="field col-12 md:col-6">
                    <div class="p-inputgroup longinput">
                        <InputText id="workshop" type="text" placeholder="Цех" v-model="selectedWorkshop.name" />
                        <Button icon="pi pi-check" class="p-button-warning" @click="onWorkshopClick"/>
                    </div>
                </div>
                <br>

                <div class="col-12 md:col-6">
                    <div class="checkBox">
                        <span class="checkBoxLabel">
                            <label for="garnish">Является гарнирниром  </label>
                            <Checkbox id="garnish" v-model="item.is_garnish" :binary="true" />
                        </span>
                        <span class="checkBoxLabel">
                            <label for="garnish">Включает гарнир  </label>
                            <Checkbox id="garnish" v-model="item.is_include_garnish" :binary="true" />
                        </span>
                        <span class="checkBoxLabel">
                            <label for="weight">Весовой  </label>
                            <Checkbox id="weight" v-model="item.is_weight" :binary="true" />
                        </span>
                        <span class="checkBoxLabel">
                            <label for="alcohol">Алкоголь  </label>
                            <Checkbox id="alcohol" v-model="item.is_alcohol" :binary="true" />
                        </span>
                    </div>
                </div>
                <div class="col-12 md:col-6">
                    <div class="checkBox">
                        <span class="checkBoxLabel">
                            <label for="garnish">Является соусом  </label>
                            <Checkbox id="garnish" v-model="item.is_sauce" :binary="true" />
                        </span>
                        <span class="checkBoxLabel">
                            <label for="includgarnish">Включает соус  </label>
                            <Checkbox id="includgarnish" v-model="item.is_include_sauce" :binary="true" />
                        </span>
                        <span class="checkBoxLabel">
                            <label for="employeeMenu">Не для сотрудников  </label>
                            <Checkbox id="employeeMenu" v-model="item.is_in_employee_menu" :binary="true" />
                        </span>
                        <span class="checkBoxLabel">
                            <label for="notInPriceList">Не отображать  </label>
                            <Checkbox id="notInPriceList" v-model="item.is_not_in_price_list" :binary="true" />
                        </span>
                    </div>
                </div>

                <div class="field col-12 md:col-12">
                    <IngredientTable :ingrObject="item.ingredients" />
                </div>

                <div class="col-12 md:col-6">
                    <span class="p-float-label">
                        <Textarea id="comment" class="textinput" v-model="item.comment" rows="4" cols="30" />
                        <label for="comment">Комментарий</label>
                    </span>
                </div>

                <div class="col-12 md:col-12" style="text-align: end">
                    <Button label="Сохранить" @click="onSave" class="p-button-rounded p-button-sm" style="margin-top: 15px" />
                </div>
            </div>
        </div>
    </div>

    <OverlayPanel ref="opUnits">
        <DataTable :value="units" v-model:selection="selectedUnit" selectionMode="single" 
        :paginator="true" :rows="5" @rowSelect="onUnitSelect" responsiveLayout="scroll" >
            <Column field="name" header="Name" sortable />
        </DataTable>
    </OverlayPanel>

    <OverlayPanel ref="opWorkshops">
        <DataTable :value="workshops" v-model:selection="selectedWorkshop" selectionMode="single" 
            :paginator="true" :rows="5" @rowSelect="onWorkshopsSelect" responsiveLayout="scroll" >
            <Column field="name" header="Name" sortable />
        </DataTable>
    </OverlayPanel>

    <Dialog header="Подтверждение" class="border" v-model:visible="displayConfirmation" :style="{width: '300px'}" :modal="true" :showHeader="false">
        <h4>{{confirmationMessage}}</h4>
        <template #footer>
        <Button label="Нет" icon="pi pi-times" @click="closeConfirmation" class="p-button-text"/>
        <Button label="Да" icon="pi pi-check" @click="positiveConfirmation" class="p-button-text" autofocus />
        </template>
    </Dialog>
</template>

<script>
import IngredientTable from '../components/IngredientTable.vue'
import Calendar from 'primevue/calendar';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';
import OverlayPanel from 'primevue/overlaypanel';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';

export default {
  name: 'ItemForm',
  components: {
    IngredientTable,
    Calendar,
    InputText, 
    Checkbox,
    Textarea,
    Button,
    Column,
    OverlayPanel,
    DataTable,
    Dialog
  },
    data() {
        return {
            displayConfirmation: false,
            formDate: new Date(),
            id: 6,
            selectedUnit: {name: '---'},
            selectedWorkshop: {name: '---'},
            retailPrice: "",
            deliveryPrice: "",
            confirmationMessage: ""
        }
    },
    computed: {
        workshops() {
            return this.$store.state.workshops
        },
        units() {
            return this.$store.state.units
        },
        item() {
            return this.$store.state.item
        },
        parentNode() {
            return this.$store.state.parentNode;
        }
    },
    methods: {
        addNewItem() {
            this.$store.dispatch('getItem', 0);
        },
        calculateDeliveryPrice() {
            this.deliveryPrice = Math.ceil((this.retailPrice * 1.2) / 10) * 10;
            this.setPrice(this.deliveryPrice, "DELIVERY");
        },
        onUnitClick(event) {
            this.$refs.opUnits.toggle(event);
        },
        onWorkshopClick(event) {
            this.$refs.opWorkshops.toggle(event);
        },
        onUnitSelect(event) {
            this.item.unit = this.selectedUnit;
            this.$refs.opUnits.toggle(event);
        },
        onWorkshopsSelect(event) {
            this.item.workshop = this.selectedWorkshop;
            this.$refs.opWorkshops.toggle(event);
        },
        saveItem() {
            let date = this.formDate.getTime();
            this.item.parent_id = this.parentNode.data;
            this.$store.dispatch("saveItem", [this.item, date]);
        },
        closeConfirmation() {
            this.displayConfirmation = false;
        },
        positiveConfirmation() {
            this.saveItem();
            this.displayConfirmation = false;
        },
        onSave() {
            this.confirmationMessage = "Сохранить "+ this.item.name + " в " + this.parentNode.label + "?";
            this.displayConfirmation = true;
        },
        setPrice(value, type) {
            if(value.target) {
                value = value.target._value;
            }
            console.log(event, type);
            this.item.prices.push(new Price(this.formDate.getTime(), value, type));
        }
    },
    watch: {
        item(value) {
            this.selectedUnit = value.unit;
            this.selectedWorkshop = value.workshop;
            this.retailPrice = "";
            this.deliveryPrice = "";
            for(let price of value.prices) {
                if(price.type === "RETAIL") {
                    this.retailPrice = price.value;
                }
                if(price.type === "DELIVERY") {
                    this.deliveryPrice = price.value;
                }
            }
        }
    },
    mounted() {
        this.$store.dispatch('getItem', 0);
    }
}

class Price {
    value = 0;
    type = "";
    date = "";
    constructor(date, value, type) {
        this.date = date;
        this.value = value;
        this.type = type;
    }
}

</script>

<style scoped>
    .field {
        margin-bottom: 30px;
    }
    .header {
        text-align: end;
        background-color: #dee2e6;
        padding: 20px;
    }
    .contentRight {
        text-align: end;
    }
    .form {
        margin: 20px;
    }
    .longinput {
        width: 250px;
    }
    .textinput {
        width: 520px;
        height: 100px;
    }
    .itemform {
        width: 580px;
        text-align: left;
        border: 1px solid #dee2e6;
        border-radius: 3px;
        margin-left: 30px;
    }
    .checkBoxLabel {
        margin: 00px 0px 20px 0px;
    }
    .checkBox {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
    .border {
        border: 1px solid #dee2e6;
        border-radius: 3px;
    }
</style>