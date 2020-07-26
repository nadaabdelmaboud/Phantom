<template>
  <form @submit.prevent="submit">
    <div class="signUpForm">
      <p class="text-center" id="phantom">Welcome to Phantom</p>
      <p class="text-center" id="findIdeas">Find new ideas to try</p>
      <div class="error" v-if="errorMessage && !signUpState">
        <p class="text-center" style="padding-bottom:4px;">
          {{ errorMessage }} 😞
        </p>
      </div>
      <input
        type="text"
        id="firstName"
        v-model="fname"
        placeholder="First Name"
        required
      />
      <br />
      <input
        type="text"
        id="lastName"
        v-model="lname"
        placeholder="Last Name"
        required
      />
      <br />
      <input
        type="email"
        id="email"
        v-model="email"
        placeholder="Enter Your Email"
        required
      />
      <br />
      <input
        type="password"
        id="password"
        v-model="password"
        placeholder="Enter Your Password"
        required
        @input="validatePassword()"
      />
      <br />
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
      <input
        type="password"
        id="passwordConfirm"
        v-model="confirmPassword"
        placeholder="Confrim Password"
        required
        @input="passwordMatch()"
      />
      <br />
      <div v-if="!this.passwordMatching" class="passwordValidation">
        <p style="color:red;">Password mismatching</p>
      </div>
      <label for="birthDate">Date of birth</label><br />
      <input
        type="date"
        id="birthDate"
        v-model="birthDate"
        required
        pattern="\d{4}-\d{2}-\d{2}"
      />
      <br />
      <div class="row">
        <p>About You</p>
        <p class="optional">(Optional)</p>
      </div>
      <textarea
        id="about"
        placeholder="Write something.."
        rows="4"
        cols="50"
        v-model="about"
      ></textarea>
      <br />
      <div id="signUp" class="text-center">
        <button type="submit">Sign Up</button>
      </div>
      <br />
      <router-link to="/login" class="text-center">
        <p>Already have an account? Login</p>
      </router-link>
    </div>
  </form>
</template>

<script>
export default {
  name: "SignUp",
  data: function() {
    return {
      fname: "",
      lname: "",
      email: "",
      password: "",
      confirmPassword: "",
      birthDate: "",
      about: "",
      passwordMatching: true
    };
  },
  methods: {
    submit() {
      this.passwordMatch();
      if (this.passwordMatching && this.validPassword) {
        this.$store.dispatch("user/signUp", {
          firstName: this.fname,
          password: this.password,
          birthday: this.birthDate,
          lastName: this.lname,
          bio: this.about,
          email: this.email
        });
      }
    },
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
  },
  watch: {
    signUpState: function() {
      if (this.signUpState) this.$router.push("email-confirm");
    }
  },
  created: function() {
    this.$store.commit("user/setErrorMessage", null);
  }
};
</script>

<style lang="scss" scoped>
@import "../scss/Colors";

input,
textarea {
  border-radius: 8px;
  border: 2px solid $ligthPaige;
  padding-left: 8px;
  padding-top: 6px;
  padding-bottom: 6px;
  margin-bottom: 10px;
  outline: none;
  min-width: 400px;
  max-height: 300px;
}

input:focus {
  border: 2px solid $lightBlue;
  border-radius: 8px;
}

button {
  padding-left: 40px;
  padding-right: 40px;
  padding-top: 4px;
  padding-bottom: 4px;
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

.signUpForm {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: absolute;
  height: 100%;
  width: 30%;
  margin: auto;
  padding: 20px;
}

.optional {
  padding-left: 4px;
  opacity: 0.8;
}

.row {
  margin-left: 4px;
}

a {
  text-decoration: none;
  color: black;
  font-size: 14px;
  font-weight: bold;
}
a:hover {
  text-decoration: none;
  color: black;
}

#signUp {
  align-content: center;
}

#phantom {
  color: $darkBlue;
  font-size: 25px;
  font-weight: bold;
}

#findIdeas {
  font-weight: bold;
  font-size: 14px;
}

.passwordValidation p {
  font-size: 12px;
}

i {
  margin-right: 4px;
}

#valid {
  color: green;
}

#unvalid {
  color: red;
}

.error {
  background-color: red;
  color: white;
  padding-top: 4px;
  margin-bottom: 4px;
  font-weight: bold;
  max-width: 400px;
}
</style>
