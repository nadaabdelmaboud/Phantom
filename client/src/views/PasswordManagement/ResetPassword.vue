<template>
  <div class="main-border">
    <div class="main-content">
      <h1>
        Pick a new password
      </h1>
      <label for="new-password">New Password</label><br />
      <input
        type="password"
        id="new-password"
        v-model="password"
        @input="validatePassword()"
      /><br />
      <CheckPasswordFormat :password="this.password" />
      <label for="confirm-password">Type it again</label><br />
      <input
        type="password"
        id="confirm-password"
        style="margin-bottom:10px;"
        v-model="confirmPassword"
        @input="passwordMatch"
      /><br />
      <p v-if="!passwordMatching" class="password-matching">
        Passwords should match
      </p>
      <button @click="changePassword">Change Password</button>
    </div>
  </div>
</template>

<script>
import CheckPasswordFormat from "../../components/CheckPasswordFormat.vue";
export default {
  data: function() {
    return {
      password: "",
      confirmPassword: "",
      passwordMatching: true
    };
  },
  methods: {
    validatePassword() {
      this.$store.commit("user/validatePassword", this.password);
    },
    passwordMatch() {
      if (this.password === this.confirmPassword) this.passwordMatching = true;
      else this.passwordMatching = false;
    },
    changePassword() {
      console.log(this.$route.query.token);
      if (this.passwordMatching && this.validatePassword && this.password) {
        this.$store.dispatch("user/resetPassword", {
          forgetPassword: true,
          newPassword: this.password,
          token: this.$route.query.token
        });
      }
    }
  },
  computed: {
    validPassword: function() {
      return this.$store.state.user.validPassword;
    },
    errorMessage: function() {
      return this.$store.state.user.errorMessage;
    },
    resetStatus: function() {
      return this.$store.state.user.status;
    }
  },
  watch: {
    resetStatus: function() {
      if (this.resetStatus) this.$router.push("login");
    }
  },
  components: {
    CheckPasswordFormat
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";
@import "../../scss/Mixins";
.main-border {
  margin: 10% auto;
  border: 2px solid $lightBlue;
  border-radius: 40px;
  max-width: 500px;
  box-shadow: 5px 5px 8px 5px #888888;
}

.main-content {
  padding: 50px 40px;
}

h1 {
  font-weight: bold;
  margin-bottom: 10px;
}

input,
input:focus {
  @include inputField;
}

button,
button:focus {
  padding: 4px 25px;
  background-color: $darkBlue;
  border-radius: 20px;
  border: none;
  color: $offWhite;
  text-decoration: none;
  font-size: 18px;
  outline: none;
  float: right;
}

.passwordValidation p,
.password-matching {
  font-size: 12px;
}
.password-matching {
  color: red;
}
i {
  margin-right: 4px;
  padding-left: 15px;
}

label {
  font-weight: bold;
  margin-bottom: 0px;
}

#valid {
  color: green;
}

#unvalid {
  color: red;
}
</style>
