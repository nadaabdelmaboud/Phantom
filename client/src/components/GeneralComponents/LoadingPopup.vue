<template>
  <div id="newPin" @click="newPinPopup">
    <div class="newPinData">
       <Loading :loading="loading"/>
    </div>
  </div>
</template>

<script>
import Loading from "./Loading"
export default {
  name: "LoadingPopup",
  data:function(){
      return{
          loading:true
      };
  },
  components:{
      Loading
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";

#newPin {
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
.newPinData {
  margin: 90px auto;
  background-color: white;
  width: 450px;
  padding: 20px;
  padding-top: 50px;
  border-radius: 32px;
}
@media screen and (max-width: 500px) {
  .newPinData {
    margin: 50px auto;
    width: 97%;
  }
}
h1 {
  width: 100%;
  text-align: center;
  font-size: 32px;
  font-weight: 700;
}
</style>
