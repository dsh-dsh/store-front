<template>
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
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

export default {
    name: 'UserForm',
    components: {
        InputText, 
        Button
    },
    data() {
        return {
            digitValue,
        }
    },
    methods: {
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
    }
}
</script>

<style scoped>
</style>