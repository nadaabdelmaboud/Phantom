<template>
  <div>
    <div v-if="this.password.length" class="passwordValidation">
      <p>Password sould be:</p>
      <div class="row">
        <i class="fa fa-check-circle valid" v-if="this.validLength"></i>
        <i class="fa fa-times-circle unvalid" v-else></i>
        <p>At least 8 characters</p>
      </div>
      <div class="row">
        <i class="fa fa-check-circle valid" v-if="this.capChar"></i>
        <i class="fa fa-times-circle unvalid" v-else></i>
        <p>Minimum one uppercase</p>
      </div>
      <div class="row">
        <i class="fa fa-check-circle valid" v-if="this.specialChar"></i>
        <i class="fa fa-times-circle unvalid" v-else></i>
        <p>Minimum one Special character</p>
      </div>
      <div class="row">
        <i class="fa fa-check-circle valid" v-if="containNum"></i>
        <i class="fa fa-times-circle unvalid" v-else></i>
        <p>Minimum one number</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    validPassword: function() {
      return this.$store.state.user.validPassword;
    },
    validLength: function() {
      return this.$store.state.user.validPasswordLength;
    },
    capChar: function() {
      return this.$store.state.user.containCapitalChar;
    },
    specialChar: function() {
      return this.$store.state.user.containSpecialChar;
    },
    containNum: function() {
      return this.$store.state.user.containNumber;
    }
  },
  props: {
    password: String
  }
};
</script>

<style lang="scss" scoped>
.valid {
  color: green;
}

.unvalid {
  color: red;
}

.passwordValidation p {
  font-size: 12px;
}

i {
  margin-right: 4px;
  margin-left: 12px;
}

.row {
  margin-left: 2px;
}
</style>
