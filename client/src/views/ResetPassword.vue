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
      <div v-if="this.password.length" class="passwordValidation">
        <p>Password sould be:</p>
        <div class="row">
          <i class="fa fa-check-circle" v-if="this.validLength" id="valid"></i>
          <i class="fa fa-times-circle" v-else id="unvalid"></i>
          <p>At least 8 characters</p>
        </div>
        <div class="row">
          <i class="fa fa-check-circle" v-if="this.capChar" id="valid"></i>
          <i class="fa fa-times-circle" v-else id="unvalid"></i>
          <p>Minimum one uppercase</p>
        </div>
        <div class="row">
          <i class="fa fa-check-circle" v-if="this.specialChar" id="valid"></i>
          <i class="fa fa-times-circle" v-else id="unvalid"></i>
          <p>Minimum one Special character</p>
        </div>
        <div class="row">
          <i class="fa fa-check-circle" v-if="containNum" id="valid"></i>
          <i class="fa fa-times-circle" v-else id="unvalid"></i>
          <p>Minimum one number</p>
        </div>
      </div>
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
      <button style="float: right">Change Password</button>
    </div>
  </div>
</template>

<script>
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
    }
  },
  computed: {
    validPassword: function() {
      return this.$store.state.user.validPassword;
    },
    validLength: function() {
      return this.$store.state.user.validPasswordLength;
    },
    capChar: function() {
      return this.$store.state.user.containCapitalChar;
    },
    specialChar: function() {
      return this.$store.state.user.containSpecialChar;
    },
    containNum: function() {
      return this.$store.state.user.containNumber;
    },
    signUpState: function() {
      return this.$store.state.user.signUpState;
    },
    errorMessage: function() {
      return this.$store.state.user.errorMessage;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../scss/Colors";
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
  border-radius: 10px;
  border: 2px solid $ligthPaige;
  padding: 6px 8px;
  margin: 5px 0;
  outline: none;
  min-width: 300px;
  max-height: 300px;
}

button,
button:focus {
  padding: 4px 40px;
  background-color: $darkBlue;
  border-radius: 20px;
  border: none;
  color: $offWhite;
  text-decoration: none;
  font-size: 18px;
  outline: none;
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
