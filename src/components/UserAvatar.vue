<template>
    <div class="name" v-if="user">
      <Avatar :label="label" class="avatar" shape="circle"  />
      {{user.first_name + " " + user.last_name}}
    </div>
</template>

<script>
import Avatar from 'primevue/avatar';
export default {
  name: 'LoginForm',
  components: {
    Avatar
  },
  data() {
    return {
        user: null,
        label: ''
    };
  },
  watch: {
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.label = this.user.last_name.substring(0, 1);
  },
  methods: {
  },
}
</script>
<style scoped>
  .name {
    color: #121e2b;
    margin: 0px 0px 0px 0px;
  }
  .avatar {
    background-color:#3b8882; 
    color: #eff1f3;
  }
</style>