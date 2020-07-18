<template>
  <div class="profile">
    <div class="profileInfo">
      <img
        src="https://images.unsplash.com/photo-1594843310575-90756e33c484?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
      />
      <h1>Menna Mahmoud</h1>
      <h6>16 following</h6>
    </div>
    <div class="stickyBar row  m-0">
      <div class="col-sm-4 col1">
        <i class="fa fa-pencil" aria-hidden="true"></i>
        <i class="fa fa-upload" aria-hidden="true"></i>
      </div>
      <div class="col-sm-4 col2">
        <router-link
          class="buttons"
          to="/UserProfile/Boards"
          tag="div"
          :class="{ inRoute: inBoards }"
        >
          Boards
        </router-link>
        <router-link
          class="buttons"
          to="/UserProfile/Pins"
          tag="div"
          :class="{ inRoute: inPins }"
        >
          Pins
        </router-link>
      </div>
      <div class="col-sm-4 col3">
        <i class="fa fa-plus" aria-hidden="true" style="float:right;"></i>
        <i class="fa fa-list" aria-hidden="true" style="float:right;"></i>
      </div>
    </div>
    <router-view> </router-view>
  </div>
</template>

<script>
export default {
  name: "UserProfile",
  data: function() {
    return {
      inBoards: true,
      inPins: false,
    };
  },
  watch: {
    $route: function() {
      if (this.$route.path == "/UserProfile/Pins") {
        this.inBoards = false;
        this.inPins = true;
      } else if (this.$route.path == "/UserProfile/Boards") {
        this.inBoards = true;
        this.inPins = false;
      } else {
        this.inBoards = false;
        this.inPins = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../scss/Colors";
@import "../scss/mixins";
.profileInfo {
  margin-bottom: 40px;
  img {
    width: 120px;
    border-radius: 50%;
    margin: 10px calc((100vw - 120px) / 2);
    height: 120px;
  }
}
h1,
h6 {
  text-align: center;
  font-weight: 700;
}
h1 {
  font-size: 36px;
}
h6 {
  font-size: 16px;
}
.stickyBar {
  height: 48px;
  position: sticky;
  top: 80px;
}
i {
  height: 48px;
  width: 48px;
  font-size: 24px;
  color: $darkBlue;
  border-radius: 50%;
  padding: 12px;
  text-align: center;
  transition: background-color 0.5s ease;
  cursor: pointer;
}
i:hover {
  background-color: $lightPink;
}
.col2{
padding: 0 60px;
}
.buttons {
  @include horizontalDivs;
  border-radius: 40px;
  font-size: 16px;
  font-weight: 700;
  padding: 12px;
}
.inRoute {
  background-color: $darkBlue;
  color: $lightPink;
}
.inRoute:hover {
  background-color: $darkBlue;
  color: $lightPink;
}
</style>
