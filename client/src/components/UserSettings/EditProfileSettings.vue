<template>
  <div>
    <div class="row">
      <div class="col">
        <h1>Edit profile</h1>
        <p>People on Pinterest will get to know you with the info below</p>
      </div>
      <div class="col">
        <button>Cancel</button>
        <button>Done</button>
      </div>
    </div>
    <section>
      <label for="profile-image">Photo</label><br />
      <img id="profile-image" :src="getUserImage()" />
      <button id="change-photo">Change</button>
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
      <input type="text" id="user-name" />
    </section>
    <section>
      <label for="location">Location</label><br />
      <input type="text" placeholder="Ex. Cairo, Egypt" id="location" />
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
    }
  },
  computed: {
    userData: function() {
      return this.$store.state.user.userData;
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
</style>
