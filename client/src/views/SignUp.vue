<template>
  <form @submit.prevent="submit">
    <div class="signUpForm">
      <p class="text-center" id="phantom">Welcome to Phantom</p>
      <div class="row google">
        <a :href="$url + '/google'">
          <i class="fa fa-google google-icon"></i>
          Continue with Google
        </a>
      </div>
      <div style="font-size: 12px; text-align: center;">
        <strong>OR</strong>
      </div>
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
      />
      <br />
      <input
        type="text"
        id="lastName"
        v-model="lname"
        placeholder="Last Name"
      />
      <br />
      <input
        type="email"
        id="email"
        v-model="email"
        placeholder="Enter Your Email"
      />
      <br />
      <input
        type="password"
        id="password"
        v-model="password"
        placeholder="Enter Your Password"
        @input="validatePassword()"
      />
      <br />
      <CheckPasswordFormat :password="this.password" />
      <input
        type="password"
        id="passwordConfirm"
        v-model="confirmPassword"
        placeholder="Confrim Password"
        @input="passwordMatch()"
      />
      <br />
      <div v-if="!this.passwordMatching">
        <p style="color:red;">Password mismatching</p>
      </div>
      <label for="birthDate">Date of birth</label><br />
      <input
        type="date"
        id="birthDate"
        v-model="birthDate"
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
import CheckPasswordFormat from "../components/CheckPasswordFormat.vue";
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
      if (
        this.passwordMatching &&
        this.validPassword &&
        this.fname &&
        this.lname &&
        this.password &&
        this.birthDate &&
        this.email
      ) {
        this.$store.dispatch("user/signUp", {
          firstName: this.fname,
          password: this.password,
          birthday: this.birthDate,
          lastName: this.lname,
          bio: this.about ? this.about : undefined,
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
    },
    googleAuth() {
      this.$store.dispatch("user/googleAuth");
    }
  },
  computed: {
    validPassword: function() {
      return this.$store.state.user.validPassword;
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
  },
  components: {
    CheckPasswordFormat
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

.error {
  background-color: red;
  color: white;
  padding-top: 4px;
  margin-bottom: 4px;
  font-weight: bold;
  max-width: 400px;
}

.google {
  background-color: $offWhite;
  color: black;
  width: 400px;
  padding: 10px 61px;
  font-weight: 700;
  font-size: 14px;
  margin: 4px auto;
}

.google-icon {
  color: red;
  margin-right: 10px;
}
</style>
