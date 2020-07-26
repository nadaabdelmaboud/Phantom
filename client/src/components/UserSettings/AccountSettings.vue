<template>
  <div>
    <section class="row">
      <div class="col">
        <h1>Account Settings</h1>
        <p>
          Set your login preferences, help us personalize your experience and
          make big account changes here
        </p>
      </div>
      <div class="col">
        <button>Cancel</button>
        <button>Done</button>
      </div>
    </section>
    <br />
    <section>
      <p>Basic Information</p>
      <label for="email">Email address</label><br />
      <input type="text" id="email" />
    </section>
    <br />
    <section>
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
    <section>
      <p>Gender</p>
      <input type="radio" id="male" name="gender" value="male" />
      <label for="male">Male</label>
      <input type="radio" id="female" name="gender" value="female" />
      <label for="female">Female</label>
    </section>
    <section>
      <h4>Login Options</h4>
      <p>Use your Facebook or Google account to log in to Phantom.</p>
      <label for="facebook">Facebook</label><br />
      <input type="checkbox" id="facebook" />
      <p>Use your Facebook account to log in</p>
      <br /><br />
      <label for="google">Google</label><br />
      <input type="checkbox" id="google" />
      <p>Use your Google account to log in</p>
    </section>
    <hr />
    <section>
      <h3>Account changes</h3>
      <div class="row">
        <p class="col">
          Convert to a business account. You'll keep your boards and Pins, and
          switch to a business-only account.
        </p>
        <button class="col">Convert account</button>
      </div>
      <div class="row">
        <p class="col">Hide your Pins and profile</p>
        <button class="col">Deactivate account</button>
      </div>
      <div class="row">
        <p class="col">Delete your account and account data</p>
        <button class="col">Close account</button>
      </div>
    </section>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
h1 {
  font-weight: bold;
}

label {
  font-size: 12px;
  margin-bottom: 2px;
}
</style>
