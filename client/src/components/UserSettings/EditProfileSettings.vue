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
      <img
        id="profile-image"
        src="https://images.unsplash.com/photo-1594843310575-90756e33c484?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
      />
      <button id="change-photo">Change</button>
    </section>
    <br />
    <section class="username">
      <div class="column">
        <label for="fname">First Name</label><br />
        <input type="text" id="fname" />
      </div>
      <div class="column">
        <label for="lname">Last Name</label><br />
        <input type="text" id="lname" />
      </div>
    </section>
    <section>
      <label for="bio">About your profile</label><br />
      <textarea
        type="text"
        id="about"
        placeholder="Write a little bit about yourself here"
        rows="4"
        cols="50"
      ></textarea>
    </section>
    <section>
      <label for="location">Location</label><br />
      <input type="text" placeholder="Ex. Cairo, Egypt" id="location" />
    </section>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";
@import "../../scss/Mixins";

h1 {
  font-weight: bold;
}

button {
  border-radius: 400px;
  padding: 7px 15px;
  font-weight: bold;
  background-color: $lightgrey;
  color: $darkgrey;
  outline: none;
  border: 0;
  margin: 0 2px;
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

#location,
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
