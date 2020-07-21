<template>
  <div class="main-border">
    <div class="content">
      <center>
        <router-link class="icons" to="/">
          <i class="fa fa-times fa-2x" id="closeIcon"></i>
        </router-link>
        <h1>Password Reset</h1>
      </center>
      <p>
        Enter your <strong>email address</strong> that you used to register.
        We'll send you an email with your username and a link to reset your
        password.
      </p>
      <center>
        <input type="email" v-model="email" placeholder="Your Email" /><br />
        <p v-if="emptyField" style="color:red;">Please enter this field</p>
        <p v-if="!sendState" style="color:red;">{{ errorMessage }}</p>
        <button @click="sendEmail">Send</button>
      </center>
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      email: null,
      emptyField: false
    };
  },
  methods: {
    sendEmail: function() {
      if (this.email) {
        this.$store.dispatch("user/forgetPassword", this.email);
        this.emptyField = false;
      } else this.emptyField = true;
    }
  },
  computed: {
    sendState: function() {
      return this.$store.state.user.sendEmailStatus;
    },
    errorMessage: function() {
      return this.$store.state.user.errorMessage;
    }
  },
  created: function() {
    this.$store.commit("user/setErrorMessage", null);
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

.content {
  padding: 40px 35px;
}

h1 {
  font-weight: bold;
}

input,
input:focus {
  border-radius: 20px;
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
  margin: 10px 0;
  background-color: $darkBlue;
  border-radius: 20px;
  border: none;
  color: $offWhite;
  text-decoration: none;
  font-size: 18px;
  outline: none;
}

i {
  color: black;
}
</style>
