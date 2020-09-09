<template>
  <div>
    <ul>
      <li>
        <i class="fa fa-pencil"></i>
        <router-link to="/settings/edit-profile" exact id="edit">
          Edit profile</router-link
        >
      </li>
      <li>
        <i class="fa fa-user"></i>
        <router-link to="/settings/account-settings" exact id="settings">
          Account settings</router-link
        >
      </li>
      <li>
        <i class="fa fa-bell"></i>
        <router-link to="/settings/notifications" exact id="notifications">
          Notifications</router-link
        >
      </li>
    </ul>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
ul {
  list-style-type: none;
}

i {
  padding-right: 6px;
  color: grey;
}

a {
  color: grey;
}

a:hover {
  text-decoration: underline;
  color: black;
}

li {
  padding: 8px;
}

.exact {
  color: black;
}
</style>
