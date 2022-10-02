<template>
    <div>
        <div class="itemform">
            <div class="header">
                <Button label="Новый пользователь" @click="addNewCompany" class="p-button-rounded p-button-secondary p-button-sm" />
            </div>
            <br>
            <div class="formgrid grid form">

                <div class="field col-12 md:col-6">
                    <span class="p-float-label">
                        <InputText id="itemname" class="longinput" type="text" v-model="currentCompany.name" />
                        <label for="itemname">Наименование</label>
                    </span>
                </div>
                <div class="field col-12 md:col-6">
                    <!-- <span class="p-float-label">
                        <InputText id="printname" class="longinput" type="text" v-model="currentCompany.inn" />
                        <label for="printname">ИНН</label>
                    </span> -->
                </div>

                <div class="field col-12 md:col-6">
                    <span class="p-float-label">
                        <InputText id="password" class="longinput" type="text" v-model="currentCompany.kpp" />
                        <label for="password">КПП</label>
                    </span>
                </div>
                <div class="field col-12 md:col-6">
                    <span class="p-float-label">
                        <InputText id="inn" class="longinput" type="text" v-model="currentCompany.inn" />
                        <label for="inn">ИНН</label>
                    </span>
                </div>

                <div class="field col-12 md:col-6">
                    <span class="p-float-label">
                        <InputText id="email" class="longinput" type="text" v-model="currentCompany.email" />
                        <label for="email">email</label>
                    </span>
                </div>
                <div class="field col-12 md:col-6">
                    <span class="p-float-label">
                        <InputText id="phone" class="longinput" type="text" v-model="currentCompany.phone" />
                        <label for="phone">телефон</label>
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
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import {Company} from "@/js/model/Company"

export default {
    name: 'CompanyForm',
    components: {
        InputText, 
        Button,
        Dialog
    },
    data() {
        return {
            displayConfirmation: false,
            confirmationMessage: "",
            currentCompany: new Company(),
        }
    },
    computed: {
        company() {
            return this.$store.state.fs.company;
        }
    },
    watch: {
        company(val) {
            this.currentCompany = val;
        }
    },
    methods: {
        addNewCompany() {
            this.$store.dispatch('getCompany', 0);
        },
        saveCompany() {
            this.$store.dispatch("saveCompany", this.currentCompany);
        },
        closeConfirmation() {
            this.displayConfirmation = false;
        },
        positiveConfirmation() {
            this.saveCompany();
            this.displayConfirmation = false;
        },
        onSave() {
            this.confirmationMessage = "Сохранить "+ this.currentCompany.name + "?";
            this.displayConfirmation = true;
        }
    },
    mounted() {
        this.$store.dispatch('getCompany', 0);
    }
}
</script>

<style scoped>
    .field {
        margin-bottom: 30px;
    }
    .header {
        text-align: end;
        background-color: #eff1f3;
        padding: 10px;
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
        margin-left: 20px;
    }
    .border {
        border: 1px solid #dee2e6;
        border-radius: 3px;
    }
    .checkBoxLabel {
        margin: 00px 0px 20px 0px;
    }
    .checkBox {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }
</style>