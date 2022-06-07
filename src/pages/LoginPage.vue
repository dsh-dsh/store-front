<template>
        <div class="loginform block">
            <div class="left"></div>
            <div class="column right">
                <h5>логин</h5>
                  <InputText id="login" type="text" v-model="login" />
                <h5>пароль</h5>
                  <Password v-model="password" toggleMask></Password>
                <br>
                <Button label="OK" class="p-button-sm" @click.prevent="onSubmit" />
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
  .block {
      display: flex;
      
  }
  .container {
    display: flex;
    margin: 8px;
  }
  .left {

  }
  .right {
      
  }
  .column {
    display: flex;
    flex-direction: column;
  }
  .loginform {
    /* border: 1px solid #dee2e6; */
    border-radius: 3px;
	margin: 0px 20px 0px 0px;
  }
</style>