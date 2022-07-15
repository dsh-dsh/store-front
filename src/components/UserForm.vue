
<template>
    <div>
        <div class="itemform">
            <div class="header">
                <Button label="Новый пользователь" @click="addNewPerson" class="p-button-rounded p-button-secondary p-button-sm" />
            </div>
            <div class="formgrid grid form">

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

                <div class="field col-12 md:col-6">
                    <span class="p-float-label">
                        <InputText id="password" class="longinput" type="text" v-model="currentPerson.password" disabled/>
                        <label for="password">Пароль</label>
                    </span>
                </div>
                <div class="field col-12 md:col-6">
                    <span class="p-float-label">
                        <InputText id="inn" class="longinput" type="text" v-model="currentPerson.inn" />
                        <label for="inn">ИНН</label>
                    </span>
                </div>

                <div class="field col-12 md:col-6">
                    <span class="p-float-label">
                        <InputText id="email" class="longinput" type="text" v-model="currentPerson.email" />
                        <label for="email">email</label>
                    </span>
                </div>

                <div class="field col-12 md:col-6">
                    <span class="p-float-label">
                        <InputText id="phone" class="longinput" type="text" v-model="currentPerson.phone" />
                        <label for="phone">телефон</label>
                    </span>
                </div>

                <div class="field col-12 md:col-6">
                    <span class="p-float-label">
                        <Calendar id="birthdate" v-model="currentPerson.birth_date" @date-select="setDate" class="longinput" 
                                :showIcon="true" :showButtonBar="true" dateFormat="dd.mm.yy" />
                        <label for="birthdate">день рождения</label>
                    </span>
                </div>
                <div class="field col-12 md:col-6">
                    <div id="aaa" class="p-inputgroup longinput">
                        <InputText id="unit" type="text" placeholder="Проект" v-model="selectedProject.name" />
                        <Button icon="pi pi-check" class="p-button-warning" @click="onProjectClick"/>
                    </div>
                </div>

                <div class="field col-12 md:col-12">
                    <span class="p-float-label">
                        <InputText id="discount" class="longinput" type="text" v-model="currentPerson.discount" />
                        <label for="discount">Скидка</label>
                    </span>
                </div>
                <br>

                <div class="col-12 md:col-6">
                    <div class="checkBox">
                        <span class="checkBoxLabel">
                            <label for="garnish">показывать в списке расходов </label>
                            <Checkbox id="garnish" v-model="currentPerson.in_expence_list" :binary="true" />
                        </span>
                        <span class="checkBoxLabel">
                            <label for="garnish">скидка на все </label>
                            <Checkbox id="garnish" v-model="currentPerson.discount_for_all" :binary="true" />
                        </span>
                    </div>
                </div>
                <div class="col-12 md:col-6">
                    <div class="checkBox">
                        <span class="checkBoxLabel">
                            <label for="garnish">показывать кнопку расходов </label>
                            <Checkbox id="garnish" v-model="currentPerson.show_expence_button" :binary="true" />
                        </span>
                        <span class="checkBoxLabel">
                            <label for="includgarnish">выплаты запрещены </label>
                            <Checkbox id="includgarnish" v-model="currentPerson.expenses_disable" :binary="true" />
                        </span>
                    </div>
                </div>

                <div class="col-12 md:col-12">
                    <span class="p-float-label">
                        <Textarea id="comment" class="textinput" v-model="currentPerson.comment" rows="4" cols="65" />
                        <label for="comment">Комментарий</label>
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
    
    <OverlayPanel ref="opProjects">
        <DataTable :value="projects" v-model:selection="selectedProject" selectionMode="single" 
            :paginator="true" :rows="5" @rowSelect="onProjectSelect" responsiveLayout="scroll" >
            <Column field="name" header="Name" sortable style="width: 60%"/>
        </DataTable>
    </OverlayPanel>

</template>

<script>
import Calendar from 'primevue/calendar';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import {Person} from "@/js/model/Person"
import OverlayPanel from 'primevue/overlaypanel';
import Textarea from 'primevue/textarea';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';

export default {
    name: 'UserForm',
    components: {
        Calendar,
        InputText, 
        Button,
        Dialog,
        Checkbox,
        OverlayPanel,
        Textarea,
        Column,
        DataTable
    },
    data() {
        return {
            displayConfirmation: false,
            confirmationMessage: "",
            currentPerson: new Person(new Date()),
            selectedProject: {name: ""}
        }
    },
    computed: {
        person() {
            return this.$store.state.us.person;
        },
        projects() {
          return this.$store.state.cs.projects
        },
    },
    watch: {
        person(val) {
            console.log(val)
            // this.selectedProject = val.project;
            this.currentPerson = val;
        }
    },
    methods: {
        onProjectClick(event) {
            this.$refs.opProjects.toggle(event);
        },
        onProjectSelect(event) {
            this.selectedProject = event.data;
            this.currentPerson.project = event.data;
            this.$refs.opProjects.hide();
        },
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
    .checkBoxLabel {
        margin: 00px 0px 20px 0px;
    }
    .checkBox {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }
</style>