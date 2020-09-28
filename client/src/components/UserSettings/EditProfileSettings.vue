<template>
  <div>
    <div class="row">
      <div class="col-12 col-sm-6">
        <h1>Edit profile</h1>
        <p>People on Pinterest will get to know you with the info below</p>
      </div>
      <div class="col-12 col-sm-6">
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
      <img
        id="profile-image"
        v-if="this.showGoogleImage"
        :src="
          getImage(userData.profileImage, userData.google, userData.googleImage)
        "
      />

      <button id="change-photo" @click="openPopUp" v-if="!userData.google">
        Change
      </button>
    </section>
    <br />
    <section class="username">
      <div class="row">
        <div class="col-12 col-sm-6">
          <label for="fname">First Name</label><br />
          <input type="text" id="fname" v-model="fname" />
        </div>
        <div class="col-12 col-sm-6">
          <label for="lname">Last Name</label><br />
          <input type="text" id="lname" v-model="lname" />
        </div>
      </div>
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
import getImage from "../../mixins/getImage";

export default {
  created: async function() {
    this.$store.dispatch("user/getUserProfile");
    this.updateModels();
    if (this.userData != null) this.showGoogleImage = true;
  },
  data: function() {
    return {
      fname: null,
      lname: null,
      username: null,
      location: null,
      about: null,
      showGoogleImage: false
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
        location: this.location ? this.location : undefined
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
      if (this.userData.about !== this.about) return true;
      return false;
    }
  },
  watch: {
    userData: function() {
      this.updateModels();
      if (this.userData == null) this.showGoogleImage = false;
      else this.showGoogleImage = true;
    }
  },
  mixins: [getImage]
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
  margin-right: 5px;
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

/*Media Quires
******************/
@media screen and (max-width: 1100px) {
  h1 {
    font-size: 32px;
  }

  p {
    font-size: 12px;
  }

  button {
    font-size: 12px;
  }
}

@media screen and (max-width: 860px) {
  h1 {
    font-size: 28px;
  }

  p {
    font-size: 10px;
  }

  button {
    font-size: 12px;
    margin-left: 0;
  }

  .title {
    font-size: 14px;
  }
}

@media screen and (max-width: 760px) {
  h1 {
    font-size: 24px;
  }

  p {
    font-size: 10px;
  }

  button,
  .title {
    font-size: 12px;
    margin-left: 0;
  }
}

@media screen and (max-width: 660px) {
  h1 {
    font-size: 20px;
  }

  p,
  button,
  .account-changes button,
  select,
  .change-password button {
    font-size: 10px;
  }

  #change-photo {
    font-size: 12px;
  }

  h5 {
    font-size: 14px;
  }
}
</style>
