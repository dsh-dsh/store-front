<template>
    <div class="conteiner">
      <div class="border">
        <p><b>авторизация</b></p>
        <br>
        <div class="grid p-fluid">
          <div class="col-12 md:col-12">
            <div class="p-inputgroup">
              <span class="p-inputgroup-addon">
                <i class="pi pi-user"></i>
              </span>
              <InputText v-model="login" />
            </div>
          </div>
          <div class="col-12 md:col-12">
            <Password v-model="password" toggleMask></Password>
          </div>
          <div class="col-12 md:col-12">
            <Button label="OK" @click.prevent="onSubmit" />
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import InputText from 'primevue/inputtext';
  import Password from 'primevue/password';
  import Button from 'primevue/button';
  export default {
  name: 'LoginForm',
  components: {
    InputText,
    Password,
    Button
  },
  data() {
    return {
        login: null,
        password: null
    };
  },
  computed: {
  },
  methods: {
    onSubmit() {
      this.$store.dispatch('login', { login: this.login, password: this.password })
    }
  },
}
</script>
<style scoped>
  .conteiner {
    height: 100vh;
    justify-content: center;
    display: flex;
  }
  .border {
    margin: auto;
    width: 400px;
    padding: 10px 30px 30px 30px;
    border: 1px solid #dee2e6;
    border-radius: 3px;
  }
  .b {
    text-align: left;
  }
</style>