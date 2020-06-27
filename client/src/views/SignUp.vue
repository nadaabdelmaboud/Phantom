<template>
  <div>
    <center>
      <form action="">
        <p>Phantom</p>
        <input
          type="text"
          id="firstName"
          v-model="fname"
          placeholder="First Name"
          required
        />
        <input
          type="text"
          id="lastName"
          v-model="lname"
          placeholder="Last Name"
          required
        />
        <br />
        <input
          type="text"
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
        <input
          type="text"
          id="about"
          v-model="about"
          placeholder="About You.."
        />
        <br />
        <button>Sign Up</button>
        <br />
        <p>Already have an account?</p>
        <router-link to="/login">
          <p>Login</p>
        </router-link>
      </form>
    </center>
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
      about: ""
    };
  }
};
</script>

<style scoped></style>
