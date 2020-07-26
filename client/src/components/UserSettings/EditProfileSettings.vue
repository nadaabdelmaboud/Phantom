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
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";
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
</style>
