<template>
    <div class="name" v-if="user">
      <Avatar :label="label" class="avatar mr-1" shape="circle"  />
      {{user.first_name + " " + user.last_name + " (" + user.role + ")"}}
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
    this.label = this.user.first_name.substring(0, 1);
  },
  methods: {
  },
}
</script>
<style scoped>
  .name {
    color: #dee2e6;
    margin: 0px 20px 0px 0px;
  }
  .avatar {
    background-color:#9c27b0; 
    color: #dee2e6;
  }
</style>