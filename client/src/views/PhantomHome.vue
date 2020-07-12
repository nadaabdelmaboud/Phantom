<template>
  <div class="home">
    <HomeNavigationBar />
    <router-view class="mainComponent"/>
    <i class="fa fa-comment globalIcons"></i>
    <router-link tag="i" class="fa fa-plus globalIcons" to="/PinBuilder"></router-link> 
    <i class="fa fa-question-circle globalIcons"></i>
  </div>
</template>

<style lang="scss" scoped>
@import "../scss/Colors";
.mainComponent{
  background-color: $offWhite;
  min-height: calc(100vh);
  padding-top: 80px;
}
.home{
.globalIcons{
  height: 48px;
  width: 48px;
  position: absolute;
  left: 94%;
  font-size: 24px;
  color:$darkBlue;
  border-radius: 50%;
  padding: 12px;
  text-align: center;
   box-shadow: 4px 4px 4px #888888;
   z-index: 2;
}
.globalIcons:hover{
background-color: $lightPink;
}

.globalIcons:nth-child(3){
  top:76%;
}
.globalIcons:nth-child(4){
  top:84%;
}
.globalIcons:nth-child(5){
  top:92%
}

}
</style>
<script>
import HomeNavigationBar from "../components/HomeNavigationBar";
export default {
  name: "PhantomHome",
  components: {
    HomeNavigationBar
  }
};
</script>
