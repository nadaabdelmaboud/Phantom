<template>
  <div>
    <div v-if="isLoading && this.userData == null">
      <Loading :loading="isLoading" class="loading" />
    </div>
    <div style="padding-bottom: 20px;" v-else>
      <div class="row">
        <div class="col-12 col-sm-6">
          <h1>Notifications</h1>
          <p>
            We'll always let you know about important changes, but you pick what
            else you want to hear about
          </p>
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
      <br />
      <section class="settings">
        <div class="row">
          <div class="col-12 col-sm-6">
            <p class="title">By push notifications</p>
            <br />
            <p>Pick which notifications to get on your phone or computer.</p>
          </div>
          <div class="col-12 col-sm-6">
            <button
              class="edit"
              v-if="showPushEdit"
              @click="showPushEdit = !showPushEdit"
            >
              Edit
            </button>
          </div>
        </div>
        <div v-if="!showPushEdit">
          <button class="trun-off" @click="switchAll" v-if="!off">
            Trun off all
          </button>
          <button class="trun-off" @click="switchAll" v-if="off">
            Enable all</button
          ><br />
          <p class="small-title">Recommendation</p>
          <br />
          <input type="checkbox" v-model="pinsForYou" />
          <p>Pins picked for you</p>
          <br />
          <input type="checkbox" v-model="boardsForYou" />
          <p>Boards for you</p>
          <br />
          <input type="checkbox" v-model="popularPins" />
          <p>Popular Pins</p>
          <br />
          <input type="checkbox" v-model="pinsInspired" />
          <p>Pins inspired by your recent activity</p>
          <br />
          <br />

          <p class="small-title">Actions</p>
          <br />
          <input type="checkbox" v-model="followNotification" />
          <p>People who folllow you</p>
          <br />
          <input type="checkbox" v-model="pinsNotification" />
          <p>Reacts and comments on your pins</p>
          <br />
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Loading from "../GeneralComponents/Loading";
export default {
  created: function() {
    this.updateModels();
  },
  components: {
    Loading
  },
  data: function() {
    return {
      showPushEdit: true,
      pinsForYou: false,
      pinsInspired: false,
      popularPins: false,
      boardsForYou: false,
      pinsNotification: false,
      followNotification: false,
      off: false
    };
  },
  methods: {
    updateModels: function() {
      if (!this.isLoading) {
        this.pinsForYou = this.userData.pinsForYou;
        this.pinsInspired = this.userData.pinsInspired;
        this.popularPins = this.userData.popularPins;
        this.boardsForYou = this.userData.boardsForYou;
        this.pinsNotification = this.userData.pinsNotification;
        this.followNotification = this.userData.followNotification;
      }
    },
    cancelChanges: function() {
      this.updateModels();
    },
    changeDone: function() {
      this.$store.dispatch("user/updateUserSettings", {
        pinsForYou: this.pinsForYou,
        pinsInspired: this.pinsInspired,
        popularPins: this.popularPins,
        boardsForYou: this.boardsForYou,
        pinsNotification: this.pinsNotification,
        followNotification: this.followNotification
      });
    },
    switchAll: function() {
      this.pinsForYou = this.off;
      this.pinsInspired = this.off;
      this.popularPins = this.off;
      this.boardsForYou = this.off;
      this.pinsNotification = this.off;
      this.followNotification = this.off;
      this.off = !this.off;
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
      if (this.userData.pinsForYou !== this.pinsForYou) return true;
      if (this.userData.pinsInspired !== this.pinsInspired) return true;
      if (this.userData.popularPins !== this.popularPins) return true;
      if (this.userData.boardsForYou !== this.boardsForYou) return true;
      if (this.userData.pinsNotification !== this.pinsNotification) return true;
      if (this.userData.followNotification !== this.followNotification)
        return true;
      return false;
    }
  },
  watch: {
    userData: function() {
      this.updateModels();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";
@import "../../scss/Mixins";

/*Header
****************/
button {
  @include profileButton;
}

p {
  font-size: 12px;
}

h1 {
  font-weight: bold;
}

/*Edit Buttons
*****************/
.edit {
  @include profileButton;
  background-color: $qainsboro;
  color: black;
  margin-left: 20px;
}

.trun-off {
  @include profileButton;
  background-color: $qainsboro;
  color: black;
  font-size: 14px;
  margin: 10px 0;
}

/*Titles
****************/
.title {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 0;
}

hr {
  width: 35vw;
  margin-left: 0;
}

.small-title {
  font-weight: bold;
  font-size: 14px;
  margin: 10px 0;
}

.phantom-activity {
  max-width: 400px;
  margin: 10px 0;
}
/*Checkbox
*****************/
.settings p {
  display: inline;
  margin-left: 4px;
}

/**Settings Buttons
-----------------------------------*/
button:focus {
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

/*Swithch
*****************/
.switch {
  position: relative;
  display: inline-block;
  width: 46px;
  height: 28px;
  margin-right: 4px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #000000;
}

input:focus + .slider {
  box-shadow: 0 0 1px #000000;
}

input:checked + .slider:before {
  -webkit-transform: translateX(22px);
  -ms-transform: translateX(22px);
  transform: translateX(22px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
/*Loading
******************/
.loading {
  left: -90px;
  position: relative;
}

/*Media Quires
******************/
@media screen and (max-width: 950px) {
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

@media screen and (max-width: 550px) {
  h1 {
    font-size: 28px;
  }

  p {
    font-size: 10px;
  }

  button,
  .edit,
  .trun-off,
  .small-title {
    font-size: 12px;
    margin-left: 0;
  }

  .title {
    font-size: 14px;
  }
}

@media screen and (max-width: 360px) {
  h1 {
    font-size: 20px;
  }

  p {
    font-size: 10px;
  }

  button,
  .edit,
  .trun-off,
  .title {
    font-size: 12px;
    margin-left: 0;
  }

  .small-title {
    font-size: 10px;
  }
}
</style>
