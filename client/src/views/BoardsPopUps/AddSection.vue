<template>
  <div id="add" @click="closeAdd">
    <div class="addSection">
      <h3>Add Section</h3>
      <input type="text" v-model="name" />
      <div class="buttonDiv">
        <button @click="addSection" :class="{ disable: name.length == 0 }">
          Add
        </button>
        <button class="leftButton" id="close" @click="addSection">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddSectionPopup",
  data: function() {
    return {
      name
    };
  },
  methods: {
    addSection(event) {
      if (event.target.id != "close") {
        if (this.name.length != 0) {
          let id = this.$route.params.boardId;
          this.$store.dispatch("boards/createSection", {
            id: id,
            name: this.name
          });
          this.$store.commit("popUpsState/toggleAddSection");
        }
      } else this.$store.commit("popUpsState/toggleAddSection");
    },
    closeAdd(event) {
      if (event.target.id == "add")
        this.$store.commit("popUpsState/toggleAddSection");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";
@import "../../scss/Mixins";
@import "../../scss/GlobalPopup";

#add {
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  z-index: 12;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.addSection {
  margin: 50px auto;
  background-color: white;
  width: 450px;
  padding: 20px;
  border-radius: 32px;
  input {
    border: none;
    width: 100%;
    height: 48px;
    border-radius: 32px;
    border: 2px $lightPink solid;
    transition: linear 0.5s;
    margin-top: 20px;
    padding: 0 20px;
  }
  input:hover {
    border-color: $lightPinkHover;
  }
}
@media screen and (max-width: 500px) {
  .addSection {
    width: 97%;
  }
}
h3 {
  width: 100%;
  text-align: center;
}
</style>
