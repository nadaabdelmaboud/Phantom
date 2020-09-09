<template>
  <div class="main-content">
    <section class="row">
      <div class="col">
        <h1>Account Settings</h1>
        <p>
          Set your login preferences, help us personalize your experience and
          make big account changes here
        </p>
      </div>
      <div class="col">
        <button
          v-bind:class="{
            'changed-cancel': this.isChanged
          }"
          @click="cancelChanges"
        >
          Cancel
        </button>
        <button
          id="done"
          v-bind:class="{
            'changed-done': this.isChanged
          }"
          @click="changeDone"
        >
          Done
        </button>
      </div>
    </section>
    <br />
    <section>
      <h5>Basic Information</h5>
      <label for="email">Email address</label><br />
      <input type="text" id="email" v-model="email" />
    </section>
    <br />
    <section class="change-password">
      <button @click="changePassword">Change Password</button>
    </section>
    <br />
    <section>
      <label for="country">Country/Region</label><br />
      <select name="country" v-model="country">
        <option
          v-for="country in getCountriesName()"
          :key="country.name"
          :value="country.name"
          >{{ country.name }}</option
        >
      </select>
    </section>
    <br />
    <section class="gender">
      <p>Gender</p>
      <input type="radio" id="male" v-model="gender" value="male" />
      <label for="male">Male</label>
      <input type="radio" id="female" v-model="gender" value="female" />
      <label for="female">Female</label>
    </section>
    <hr />
    <section class="account-changes">
      <h5>Account changes</h5>
      <div>
        <p>Delete your account and account data</p>
        <button @click="openClosePopUp">Close account</button>
      </div>
    </section>
    <div class="toast" id="email-toast">
      <div class="message">
        An email will be sent to you if no accounts with this email
      </div>
    </div>
  </div>
</template>

<script>
import getCountriesName from "../../mixins/getCountriesName";
export default {
  created: async function() {
    this.$store.dispatch("user/getUserProfile");
    this.updateModels();
  },
  data: function() {
    return {
      email: null,
      gender: null,
      facebook: false,
      google: false,
      country: "Egypt"
    };
  },
  methods: {
    updateModels: function() {
      this.email = this.userData.email;
      this.gender = this.userData.gender;
      this.country = this.userData.country;
      this.facebook = this.userData.facebook;
      this.google = this.userData.google;
    },
    cancelChanges: function() {
      this.updateModels();
    },
    changeDone: function() {
      this.$store.dispatch("user/updateUserInfo", {
        country: this.country,
        gender: this.gender,
        email: this.email
      });
      this.showToast();
    },
    changePassword: function() {
      this.$store.commit("popUpsState/toggleChangePasswordPopUp");
    },
    openClosePopUp: function() {
      this.$store.commit("popUpsState/toggleLeavingPopUp");
    },
    showToast() {
      var mytoast = document.getElementById("email-toast");
      clearTimeout(mytoast.hideTimeout);
      mytoast.className = "toast toast--visible";
      mytoast.hideTimeout = setTimeout(() => {
        mytoast.classList.remove("toast--visible");
      }, 2000);
    }
  },
  computed: {
    userData: function() {
      return this.$store.state.user.userData;
    },
    isLoading: function() {
      return this.$store.state.user.isLoading;
    },
    isChanged: function() {
      if (this.isLoading) return false;
      if (this.userData.email !== this.email) return true;
      if (this.userData.gender !== this.gender) return true;
      if (this.userData.country !== this.country) return true;
      if (this.userData.facebook !== this.facebook) return true;
      if (this.userData.google !== this.google) return true;
      return false;
    }
  },
  watch: {
    userData: function() {
      this.updateModels();
    }
  },
  mixins: [getCountriesName]
};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";
@import "../../scss/Mixins";

h1 {
  font-weight: bold;
}

label {
  font-size: 12px;
  margin-bottom: 2px;
}

.edit-buttons button {
  @include profileButton;
}

#email {
  @include inputField;
}

h5 {
  font-weight: bold;
}

hr {
  max-width: 900px;
}

p {
  font-size: 14px;
}

.main-content {
  max-width: 700px;
  display: block;
}

/**Change Password
-----------------------------------*/
button {
  @include profileButton;
}

button:focus {
  outline: none;
}

.change-password button {
  @include profileButton;
  background-color: $qainsboro;
  color: black;
  font-size: 14px;
}
select {
  @include inputField;
}
/*Gender
-----------------------------------*/
.gender input,
.gender p {
  margin: 0 5px;
  font-weight: bold;
}

.gender label {
  font-size: 14px;
  margin-right: 10px;
}
/*Login Options
-----------------------------------*/
.login-options p {
  display: inline;
  margin-left: 4px;
}

.login-options label {
  font-weight: bold;
}
/*Account Changes
-----------------------------------*/
.account-changes button {
  @include profileButton;
  background-color: $qainsboro;
  padding: 0 10px;
  color: black;
  float: right;
  font-size: 14px;
  margin: 0px 0px 10px 30px;
}

.account-changes div {
  display: flex;
  justify-content: space-between;
}

.account-changes p {
  max-width: 400px;
}

/**Settings Buttons
-----------------------------------*/
.changed-done {
  background-color: $queenBlue;
  color: $qainsboro;
}

.changed-cancel {
  background-color: $qainsboro;
  color: black;
}

/**Toast
-----------------------------------*/
.message {
  font-size: 14px;
  font-weight: 700px;
}
.toast {
  display: flex;
  align-content: center;
  left: 40%;
  visibility: hidden;
  opacity: 0;
  position: fixed;
  bottom: 18px;
  margin: auto;
  min-width: 380px;
  height: 60px;
  background-color: rgb(19, 20, 20);
  padding: 10px;
  color: white;
  text-align: center;
  border-radius: 50px;
  z-index: 1500;
  box-shadow: 0 0 10 rgb(19, 20, 20);
  transition: 0.5s ease-in-out;
  font-size: 16px;
}

.toast--visible {
  visibility: visible;
  opacity: 1;
}
</style>
