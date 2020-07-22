<template>
<div id="newPin" @click="newPinPopup">
    <div class="newPinData">
       
    </div>
</div>
</template>

<script>
export default {
  name: "newPinPopup",
  data: function() {
      return{
          boardName:"",
          noName:false
      };
    },
    methods:{
    newPinPopup(event){
     if(event.target.id =="newPin"){
      this.$store.commit("popUpsState/toggleNewPin");
      this.$router.push("/")
     }
    }
    }
  }
</script>

<style lang="scss" scoped>
@import "../scss/Colors";

#newPin{
    background-color: rgba(0,0,0,0.5);
    position: fixed;
    z-index: 12;
    top:0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
.newPinData{
    margin:  90px auto;
    background-color: white;
    width: 450px;
    padding: 20px;
    border-radius: 32px;

}

</style>
