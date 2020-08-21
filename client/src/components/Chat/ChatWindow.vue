<template>
  <div class="msgWindow">
      <div class="msging">
          <div class="msgBox">
      <ChatMessage 
      v-for="(msg,i) in msgs"
      :key="i"
      :imageId="msg.imageId"
      :msgText="msg.msgText"
      :owner="msg.owner"
      :timeStamp="msg.ts"
      class="ChatMsg"/>
      </div>
      <div id="msg">
          <input type="text" v-model="currentMsg" @keydown.enter="sendMsg"/>
          <button type="submit" @click="sendMsg">
              <i class="fa fa-angle-double-right"></i>
            </button> 
      </div>
      </div>
  </div>
</template>

<script>
import ChatMessage from "./ChatMessage"
export default {
  name: "BoardPins",
  data: function() {
    return {
        currentMsg:"",
        msgs:[{
            imageId:"",
            msgText:"hii",
            owner:true,
            timeStamp:"9999"
        },{
            imageId:"",
            msgText:"hello",
            owner:false,
            timeStamp:"9999"
        },{
            imageId:"",
            msgText:"mmmmmm",
            owner:false,
            timeStamp:"9999"
        },{
            imageId:"",
            msgText:"kkkkk",
            owner:true,
            timeStamp:"9999"
        }]
    };
  },
  components: {
      ChatMessage
  },
  methods: {
      sendMsg(){
          if(this.currentMsg != ""){

            this.msgs.push({
                msgText: this.currentMsg,
                timeStamp:new Date(),
                owner:true
            })
            this.currentMsg= ""
            this.$nextTick(() => {
                let msgBox = document.getElementsByClassName("msgBox")[0];
                msgBox.scrollTop = msgBox.scrollWidth;
            })
          }
      }
  },
  created() {
  },
  mounted(){
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";

.msgWindow {
  height: calc(-179px + 100vh);
  width: 360px;
  box-shadow: rgba(0, 0, 0, 0.1) -3px 4px 14px 0px;
  background-color: #fff;
  position: absolute;
  border-radius: 16px;
  top:160px;
  right: 140px;
  bottom: 0px;
  animation: dropDown 0.1s linear forwards;
  z-index: 100;
  padding: 20px;
  
}
.msgBox{
    height: 90%;
    overflow-y:auto;
}

.msging{
    position: relative;
    height: 100%;
}

#msg{
    position: absolute;
    bottom: 0;
}
button{
    border:none;
    background-color: $lightPink;
    font-size: 20px;
    width: 40px;
    height: 40px;
    transition: background-color linear 0.5s;
    color: $darkBlue;
    border-radius: 50%;
    margin: 5px;
}
button:hover{
    background-color: $lightPinkHover;
}
button:active{
    transform: scale(0.9);
    background-color: $lightPinkHover;
}
input{
    border: 2px solid $darkBlue;
    height: 40px;
    width: 250px;
    border-radius: 32px;
    padding: 20px;
}
@keyframes dropDown{
    from{
        right: 0px;
    }
    to{
        right: 140px;
    }
}
</style>
