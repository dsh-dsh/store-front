
<template>
    <div>
        <div class="itemform">
            <div class="header">
                <Button label="Новый пользователь" @click="addNewPerson" class="p-button-rounded p-button-secondary p-button-sm" />
            </div>
            <div class="formgrid grid form">

                <div class="field col-12 md:col-12">
                    <span class="p-float-label">
                        <Calendar v-model="currentPerson.birth_date" @date-select="setDate" class="longinput" 
                                :showIcon="true" :showButtonBar="true" dateFormat="dd.mm.yy" />
                    </span>
                </div>

                <div class="field col-12 md:col-6">
                    <span class="p-float-label">
                        <InputText id="itemname" class="longinput" type="text" v-model="currentPerson.first_name" />
                        <label for="itemname">Имя</label>
                    </span>
                </div>
                <div class="field col-12 md:col-6">
                    <span class="p-float-label">
                        <InputText id="printname" class="longinput" type="text" v-model="currentPerson.last_name" />
                        <label for="printname">Фамилия</label>
                    </span>
                </div>

                <div class="col-12 md:col-12" style="text-align: end">
                    <Button label="Сохранить" @click="onSave" class="p-button-rounded p-button-sm" style="margin-top: 15px" />
                </div>

            </div>
        </div>
    </div>

    <Dialog header="Подтверждение" class="border" v-model:visible="displayConfirmation" :style="{width: '300px'}" :modal="true" :showHeader="false">
        <h4>{{confirmationMessage}}</h4>
        <template #footer>
        <Button label="Нет" icon="pi pi-times" @click="closeConfirmation" class="p-button-text"/>
        <Button label="Да" icon="pi pi-check" @click="positiveConfirmation" class="p-button-text" autofocus />
        </template>
    </Dialog>

</template>

<script>
import Calendar from 'primevue/calendar';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import {Person} from "@/js/model/Person"

export default {
    name: 'UserForm',
    components: {
        Calendar,
        InputText, 
        Button,
        Dialog
    },
    data() {
        return {
            displayConfirmation: false,
            confirmationMessage: "",
            currentPerson: new Person(new Date())
        }
    },
    computed: {
        person() {
            return this.$store.state.us.person
        },
    },
    watch: {
        person(val) {
            console.log(val)
            this.currentPerson = val;
        }
    },
    methods: {
        setDate(value) {
            this.$store.dispatch('setDate', value);
        },
        addNewPerson() {
            this.$store.dispatch('getPerson', 0);
        },
        savePerson() {
            this.item.parent_id = this.parentNode.data;
            this.$store.dispatch("savePerson", this.person);
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
        }
    },
    mounted() {
        this.$store.dispatch('getPerson', 0);
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
    .form {
        margin: 20px;
    }
    .longinput {
        width: 250px;
    }
    .itemform {
        width: 580px;
        text-align: left;
        border: 1px solid #dee2e6;
        border-radius: 3px;
        margin-left: 30px;
    }
    .border {
        border: 1px solid #dee2e6;
        border-radius: 3px;
    }
</style>