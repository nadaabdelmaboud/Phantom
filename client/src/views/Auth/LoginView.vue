<template>
  <div class="login-form">
    <form @submit.prevent="login">
      <h2>Welcome Back 👋</h2>
      <div class="row google">
        <a :href="$url + '/google'">
          <i class="fa fa-google google-icon"></i>
          Continue with Google
        </a>
      </div>
      <div style="font-size: 12px; text-align: center;">
        <strong>OR</strong>
      </div>
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
      />
      <br />
      <div>
        <input
          type="password"
          id="password"
          v-model="password"
          placeholder="Enter Your Password"
        />
      </div>
      <input type="checkbox" id="show-password" @click="togglePassword" />
      <label for="show-password">Show Password</label>
      <center>
        <button type="submit" id="login">Login</button>
      </center>
    </form>
    <router-link to="/password-reset">
      <p>Forget your password?</p>
    </router-link>
    <router-link to="/signup">
      <p>Create new account? Sign Up</p>
    </router-link>
  </div>
</template>

<script>
import { initializeFirebase } from "../../messaging/init";
export default {
  methods: {
    login() {
      if (this.email && this.password)
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
      return this.$store.state.user.status;
    },
    errorMessage: function() {
      return this.$store.state.user.errorMessage;
    }
  },
  watch: {
    loginState: function() {
      if (this.loginState) {
          initializeFirebase()
        this.$router.push("/");
      }
    }
  },
  created: function() {
    this.$store.commit("user/setErrorMessage", null);
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";
@import "../../scss/Mixins";

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
.login-form {
  margin: 10vh auto;
  padding: 40px;
  border: 2px solid $lightBlue;
  border-radius: 40px;
  max-width: 450px;
}
button {
  @include CTAButton;
}

button:focus {
  outline: none;
}
h2 {
  font-weight: bold;
  text-align: center;
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

form {
  margin: 0 auto;
}
.google {
  background-color: $offWhite;
  color: black;
  min-width: 300px;
  max-width: 320px;
  padding: 10px 61px;
  font-weight: 700;
  font-size: 14px;
  margin: 0;
}
i {
  color: red;
  margin-right: 10px;
}
</style>
