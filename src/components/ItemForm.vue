
<template>
    <div>
        <div class="itemform">
            <span class="p-float-label span">
                <Calendar class="longinput" v-model="formTime" :showIcon="true" dateFormat="dd.mm.yy" />
            </span>
            <span class="p-float-label span">
                <InputText id="itemname" class="longinput" type="text" v-model="item.name" />
                <label for="itemname">Наименование</label>
            </span>
            <span class="p-float-label span">
                <InputText id="printname" class="longinput" type="text" v-model="item.print_name" />
                <label for="printname">Наименование для печати</label>
            </span>
            <div class="col-12 md:col-4 span">
                <div class="p-inputgroup longinput">
                    <span class="p-inputgroup-addon">P</span>
                    <InputText v-model="price" placeholder="Цена" />
                    <span class="p-inputgroup-addon">.00</span>
                </div>
            </div>
            <div class="col-12 md:col-4 span">
                <div class="p-inputgroup longinput">
                    <span class="p-inputgroup-addon">P</span>
                    <InputText v-model="price2" placeholder="Цена на доставку" />
                    <span class="p-inputgroup-addon">.00</span>
                </div>
            </div>

            <div class="horisontalConteiner">
            <Dropdown class="shortinput" v-model="selectedUnit" :options="units" optionLabel="name" placeholder="Еденица" />
            <Dropdown class="shortinput" v-model="selectedWorkshop" :options="workshops" optionLabel="name" placeholder="Цех" />
            </div>
            <br>

            <div class="horisontalConteiner">
                <div class="checkBox">
                    <span class="checkBoxLabel">
                        <label for="garnish">Является гарнирниром  </label>
                        <Checkbox id="garnish" v-model="is_garnish" value="item.is_garnish" />
                    </span>
                    <span class="checkBoxLabel">
                        <label for="garnish">Включает гарнир  </label>
                        <Checkbox id="garnish" v-model="is_include_garnish" value="item.is_include_garnish" />
                    </span>
                </div>
                <div class="checkBox">
                    <span class="checkBoxLabel">
                        <label for="garnish">Является соусом  </label>
                        <Checkbox id="garnish" v-model="is_sauce" value="item.is_sauce" />
                    </span>
                    <span class="checkBoxLabel">
                        <label for="includgarnish">Включает соус  </label>
                        <Checkbox id="includgarnish" v-model="is_include_sauce" value="item.is_include_sauce" />
                    </span>
                </div>
            </div>
            <div class="horisontalConteiner">
                <div class="checkBox">
                    <span class="checkBoxLabel">
                        <label for="weight">Весовой  </label>
                        <Checkbox id="weight" v-model="is_weight" value="item.is_weight" />
                    </span>
                    <span class="checkBoxLabel">
                        <label for="alcohol">Алкоголь  </label>
                        <Checkbox id="alcohol" v-model="is_alcohol" value="item.is_alcohol" />
                    </span>
                </div>
                <div class="checkBox">
                    <span class="checkBoxLabel">
                        <label for="employeeMenu">Не для сотрудников  </label>
                        <Checkbox id="employeeMenu" v-model="is_in_employee_menu" value="item.is_in_employee_menu" />
                    </span>
                    <span class="checkBoxLabel">
                        <label for="notInPriceList">Не отображать  </label>
                        <Checkbox id="notInPriceList" v-model="is_not_in_price_list" value="item.is_not_in_price_list" />
                    </span>
                </div>
            </div>

            <span class="p-float-label span">
                <IngredientTable :ingrObject="item.ingredients" />
            </span>

            <span class="p-float-label span">
                <Textarea id="comment" class="textinput" v-model="item.comment" rows="4" cols="30" />
                <label for="comment">Комментарий</label>
            </span>
        </div>
    </div>
</template>

<script>
import IngredientTable from '../components/IngredientTable.vue'
import Calendar from 'primevue/calendar';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';
import Dropdown from 'primevue/dropdown';
import Textarea from 'primevue/textarea';
export default {
  name: 'ItemForm',
  components: {
    IngredientTable,
    Calendar,
    InputText, 
    Checkbox,
    Dropdown,
    Textarea
  },
    data() {
        return {
            formTime: null,
            // item: "",
            id: 6,
            date: '2022-05-05',
            selectedUnit: null,
            selectedWorkshop: null,
            is_garnish: false,
            is_include_garnish: false,
            is_sauce: false,
            is_include_sauce: false,
            is_weight: false,
            is_alcohol: false,
            is_in_employee_menu: false,
            is_not_in_price_list: false,
            price: 100,
            price2: 120
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
        }
    },
    // mounted() {
    //     this.$store.dispatch('getItem', {date: this.date, itemId: this.id})
    // }
}
</script>

<style scoped>
    .span {
        margin: 20px 20px 30px 20px;
    }
    .longinput {
        width: 400px;
    }
    .textinput {
        width: 400px;
        height: 120px;
    }
    .shortinput {
        width: 190px;
        margin-left: 20px;
    }
    .itemform {
        border: 1px solid #dee2e6;
        border-radius: 3px;
        margin-left: 30px;
    }
    .priceinput {
        width: 160px;
    }
    .checkBoxLabel {
        margin: 00px 0px 20px 20px;
    }
    .horisontalConteiner {
        display: flex;
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