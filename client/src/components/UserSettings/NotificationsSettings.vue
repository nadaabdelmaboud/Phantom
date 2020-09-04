<template>
  <div>
    <div class="row">
      <div class="col">
        <h1>Norifications</h1>
        <p>
          We'll always let you know about important changes, but you pick what
          else you want to hear about
        </p>
      </div>
      <div class="col">
        <button
          v-bind:class="{
            'changed-cancel': this.isChanged
          }"
        >
          Cancel
        </button>
        <button
          id="done"
          v-bind:class="{
            'changed-done': this.isChanged
          }"
        >
          Done
        </button>
      </div>
    </div>
    <section>
      <div class="row">
        <div class="col">
          <p class="title">On Phantom</p>
          <p v-if="showPhantomEdit">
            Pick which notifications to see while in the app or on the site.
          </p>
        </div>
        <div class="col">
          <button
            class="edit"
            v-if="showPhantomEdit"
            @click="showPhantomEdit = !showPhantomEdit"
          >
            Edit
          </button>
        </div>
      </div>
      <div v-if="!showPhantomEdit">
        <p class="phantom-activity">
          Control whether you see activity from your Facebook friends and people
          you follow. This includes things like Pins they saw, people they
          follow and boards they created.
        </p>
        <br />
        <label class="switch">
          <input type="checkbox" v-model="activity" />
          <span class="slider round"></span>
        </label>
        <p style="display:inline;">See activity from other people</p>
      </div>
    </section>
    <hr />
    <section class="settings">
      <div class="row">
        <div class="col">
          <p class="title">By push notifications</p>
          <br />
          <p>Pick which notifications to get on your phone or computer.</p>
        </div>
        <div class="col">
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
        <button class="trun-off">Trun off all</button><br />
        <p class="small-title">Recommendation</p>
        <br />
        <input type="checkbox" v-model="pins" />
        <p>Pins picked for you</p>
        <br />
        <input type="checkbox" v-model="boards" />
        <p>Boards for you</p>
        <br />
        <input type="checkbox" v-model="topics" />
        <p>Topics for you</p>
        <br /><br />

        <p class="small-title">Social</p>
        <br />
        <input type="checkbox" v-model="boardUpdates" />
        <p>Group board updates</p>
        <br />
        <input type="checkbox" v-model="invitations" />
        <p>Invitations</p>
        <br />
        <input type="checkbox" v-model="messages" />
        <p>Messages</p>
        <br />
        <input type="checkbox" v-model="mentions" />
        <p>Comment Mentions</p>
        <br />
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      showPhantomEdit: true,
      showPushEdit: true,
      activity: false,
      pins: false,
      boards: false,
      topics: false,
      boardUpdates: false,
      invitations: false,
      messages: false,
      mentions: false,
      isChanged: false
    };
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
</style>
