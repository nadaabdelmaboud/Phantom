<template>
  <div style="margin: 10%">
    <center>
      <p style="font-size:60px">🎉</p>
      <h1>Welcome to Phantom</h1>
      <br />
      <h2>It's the last step to enjoy Phantom</h2>
      <br />
      <h3>Lets go and confirm your email</h3>
      <br />
      <button class="btn" @click="goToGmail">Open Your Email Now</button>
    </center>
  </div>
</template>

<script>
export default {
  methods: {
    goToGmail: function() {
      window.open("https://mail.google.com/mail/u/0/");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";
h1,
h2 {
  font-weight: bold;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
}

.btn {
  padding: 4px 40px;
  margin: 10px 0px;
  background-color: $darkBlue;
  border-radius: 20px;
  border: none;
  color: $offWhite;
  text-decoration: none;
  font-size: 18px;
}

@media screen and (max-width: 500px) {
  h1 {
    font-size: 24px;
  }

  h2 {
    font-size: 20px;
  }

  h3 {
    font-size: 18px;
  }

  .btn {
    font-size: 12px;
  }
}
</style>
