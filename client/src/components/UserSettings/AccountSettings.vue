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
      <div class="col edit-buttons">
        <button>Cancel</button>
        <button>Done</button>
      </div>
    </section>
    <br />
    <section>
      <h5>Basic Information</h5>
      <label for="email">Email address</label><br />
      <input type="text" id="email" />
    </section>
    <br />
    <section class="change-password">
      <button>Change Password</button>
    </section>
    <br />
    <section>
      <label for="country">Country/Region</label><br />
      <select name="country" id="country">
        <option value="Egypt">Egypt</option>
        <option value="London">London</option>
      </select>
    </section>
    <br />
    <section class="gender">
      <p>Gender</p>
      <input type="radio" id="male" name="gender" value="male" />
      <label for="male">Male</label>
      <input type="radio" id="female" name="gender" value="female" />
      <label for="female">Female</label>
    </section>
    <br />
    <section class="login-options">
      <h5>Login Options</h5>
      <p style="margin-left:0px;">
        Use your Facebook or Google account to log in to Phantom
      </p>
      <br /><br />
      <label for="facebook">Facebook</label><br />
      <input type="checkbox" id="facebook" />
      <p>Use your Facebook account to log in</p>
      <br /><br />
      <label for="google">Google</label><br />
      <input type="checkbox" id="google" />
      <p>Use your Google account to log in</p>
    </section>
    <hr />
    <section class="account-changes">
      <h5>Account changes</h5>
      <div>
        <p>
          Convert to a business account. You'll keep your boards and Pins, and
          switch to a business-only account.
        </p>
        <button>Convert account</button>
      </div>
      <div>
        <p>Hide your Pins and profile</p>
        <button>Deactivate account</button>
      </div>
      <div>
        <p>Delete your account and account data</p>
        <button>Close account</button>
      </div>
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
</style>
