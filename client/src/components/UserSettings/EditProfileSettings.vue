<template>
  <div>
    <div class="row">
      <div class="col">
        <h1>Edit profile</h1>
        <p>People on Pinterest will get to know you with the info below</p>
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
    </div>
    <section>
      <label for="profile-image">Photo</label><br />
      <img id="profile-image" :src="getUserImage()" />
      <button id="change-photo" @click="openPopUp">Change</button>
    </section>
    <br />
    <section class="username">
      <div class="column">
        <label for="fname">First Name</label><br />
        <input type="text" id="fname" v-model="fname" />
      </div>
      <div class="column">
        <label for="lname">Last Name</label><br />
        <input type="text" id="lname" v-model="lname" />
      </div>
      <br />
    </section>
    <section>
      <label for="user-name">Username</label><br />
      <input type="text" id="user-name" v-model="username" />
    </section>
    <section>
      <label for="location">Location</label><br />
      <input
        type="text"
        placeholder="Ex. Cairo, Egypt"
        id="location"
        v-model="location"
      />
    </section>
    <section>
      <label for="bio">About your profile</label><br />
      <textarea
        type="text"
        id="about"
        placeholder="Write a little bit about yourself here"
        rows="4"
        cols="50"
        v-model="about"
      ></textarea>
    </section>
  </div>
</template>

<script>
import getUserImage from "../../mixins/getUserImage";

export default {
  created: async function() {
    this.$store.dispatch("user/getUserProfile");
    this.updateModels();
  },
  data: function() {
    return {
      fname: null,
      lname: null,
      username: null,
      location: null,
      about: null
    };
  },
  methods: {
    updateModels: function() {
      this.fname = this.userData.firstName;
      this.lname = this.userData.lastName;
      this.about = this.userData.about;
      this.location = this.userData.location;
      this.username = this.userData.userName;
    },
    cancelChanges: function() {
      this.updateModels();
    },
    changeDone: function() {
      this.$store.dispatch("user/updateUserInfo", {
        firstName: this.fname,
        lastName: this.lname,
        bio: this.about ? this.about : undefined,
        userName: this.username,
        location: this.location
      });
    },
    openPopUp: function() {
      this.$store.commit("popUpsState/toggleChangePhotoPopUp");
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
      if (this.userData.firstName !== this.fname) return true;
      if (this.userData.lastName !== this.lname) return true;
      if (this.userData.userName !== this.username) return true;
      if (this.userData.location !== this.location) return true;
      return false;
    },
    updateState: function() {
      return this.$store.state.user.updateState;
    }
  },
  watch: {
    userData: function() {
      this.updateModels();
    }
  },
  mixins: [getUserImage]
};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";
@import "../../scss/Mixins";

h1 {
  font-weight: bold;
}

button {
  @include profileButton;
}

img {
  border-radius: 60px;
  width: 70px;
  height: 70px;
}

label {
  font-size: 12px;
  margin-bottom: 2px;
}

#change-photo {
  background-color: $ligthPaige;
  color: black;
  font-size: 14px;
  padding: 5px 10px;
  margin-left: 10px;
}

.username {
  display: flex;
}

input,
textarea {
  @include inputField;
}

textarea {
  width: 40vw;
}

input:focus,
textarea:focus,
button:focus {
  border: 2px solid $lightBlue;
  outline: none;
}

.changed-done {
  background-color: $queenBlue;
  color: $qainsboro;
}

.changed-cancel {
  background-color: $qainsboro;
  color: black;
}
</style>
