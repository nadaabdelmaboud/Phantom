<template>
  <div class="signUpForm">
    <p class="text-center" id="phantom">Welcome to Phantom</p>
    <p class="text-center" id="findIdeas">Find new ideas to try</p>
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
    />
    <br />
    <input
      type="password"
      id="passwordConfirm"
      v-model="confirmPassword"
      placeholder="Confrim Password"
      required
    />
    <br />
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
      rows="8"
      cols="50"
      v-model="about"
    ></textarea>
    <br />
    <div id="signUp" class="text-center">
      <button @click="submit">Sign Up</button>
    </div>
    <br />
    <router-link to="/login" class="text-center">
      <p>Already have an account? Login</p>
    </router-link>
  </div>
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
      passwordMatching: false
    };
  },
  methods: {
    submit() {
      if (this.passwordMatching) {
        this.$store.dispatch("user/signUp", {
          firstName: this.fname,
          password: this.password,
          birthday: this.birthDate,
          lastName: this.lastName,
          bio: this.about
        });
      }
    }
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
</style>
