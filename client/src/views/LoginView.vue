<template>
  <div class="login-form">
    <form @submit.prevent="login">
      <center>
        <h2>Welcome Back 👋</h2>
      </center>
      <br />
      <div class="error" v-if="errorMessage && !loginState">
        <p class="text-center" style="padding-bottom:4px;">
          {{ errorMessage }} 😞
        </p>
      </div>
      <input
        type="email"
        id="email"
        v-model="email"
        placeholder="Enter Your Email"
        required
      />
      <br />
      <div>
        <input
          type="password"
          id="password"
          v-model="password"
          placeholder="Enter Your Password"
          required
        />
      </div>
      <input type="checkbox" id="show-password" @click="togglePassword" />
      <label for="show-password">Show Password</label>
      <center>
        <button type="submit" id="login">Login</button>
      </center>
    </form>
    <router-link to="/signup">
      <p>Create new account? Sign Up</p>
    </router-link>
  </div>
</template>

<script>
export default {
  methods: {
    login() {
      this.$store.dispatch("user/login", {
        email: this.email,
        password: this.password
      });
    },
    togglePassword() {
      var password = document.getElementById("password");
      const type =
        password.getAttribute("type") === "password" ? "text" : "password";
      password.setAttribute("type", type);
      this.passwordType = !this.passwordType;
    }
  },
  data: function() {
    return {
      email: null,
      password: null,
      passwordType: true
    };
  },
  computed: {
    loginState: function() {
      return this.$store.state.user.loginState;
    },
    errorMessage: function() {
      return this.$store.state.user.errorMessage;
    }
  },
  watch: {
    loginState: function() {
      if (this.loginState) this.$router.push("/");
    }
  },
  created: function() {
    this.$store.commit("user/setErrorMessage", null);
  }
};
</script>

<style lang="scss" scoped>
@import "../scss/Colors";
input {
  border-radius: 8px;
  border: 2px solid $ligthPaige;
  padding: 6px 8px;
  margin: 5px 0;
  outline: none;
  min-width: 300px;
  max-height: 300px;
}

input:focus {
  border: 2px solid $lightBlue;
  border-radius: 8px;
}
.field-icon {
  float: right;
  margin-left: -25px;
  margin-top: -37px;
  position: relative;
  z-index: 2;
  cursor: pointer;
}

.login-form {
  margin: 40px auto;
  padding: 5%;
  border: 2px solid $lightBlue;
  border-radius: 40px;
  max-width: 450px;
  margin-left: 35%;
}

button {
  padding: 4px 40px;
  margin: 10px 0;
  background-color: $darkBlue;
  border-radius: 20px;
  border: none;
  color: $offWhite;
  text-decoration: none;
  font-size: 18px;
}

button:focus {
  outline: none;
}
h2 {
  font-weight: bold;
}
.error {
  background-color: red;
  color: white;
  padding-top: 4px;
  margin-bottom: 4px;
  font-weight: bold;
  max-width: 300px;
}

a {
  text-decoration: none;
  color: black;
  font-size: 14px;
  font-weight: bold;
  margin-top: 5px;
}

a:hover {
  text-decoration: none;
  color: black;
}

#show-password {
  min-width: auto;
  margin: 4px 10px 0px 15px;
}

label {
  font-weight: bold;
  font-size: 14px;
}
</style>
