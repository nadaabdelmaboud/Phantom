<template>
  <div class="msgWindow">
    <div class="msging">
      <div v-if="!inchat">
        <div
          class="userInfo"
          v-for="f in following"
          :key="f._id"
          @click="
            toChat({
              name: f.firstName + ' ' + f.lastName,
              id: f._id,
              imageId: f.profileImage,
            })
          "
        >
          <img :src="getImage(f.profileImage)" />
          <span>{{ f.firstName }}</span>
          <span> {{ f.lastName }}</span>
        </div>
      </div>

      <div class="currentUser" v-if="inchat">
        <i class="fa fa-arrow-left" @click="inchat = !inchat"></i>
        <p>{{ chatWith.name }}</p>
      </div>
      <div class="msgBox" v-if="inchat">
        <ChatMessage
          v-for="(msg, i) in chat"
          :key="i"
          :imageId="msg.senderImage"
          :msgText="msg.note"
          :owner="msg.owner"
          :timeStamp="msg.date"
          class="ChatMsg"
        />
        <div v-if="typing" class="typing-loader"></div>
      </div>

      <div id="msg" v-if="inchat">
        <input
          type="text"
          v-model="currentMsg"
          @keydown.enter="sendMsg"
          @input="isTyping"
        />
        <button type="submit" @click="sendMsg">
          <i class="fa fa-angle-double-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import ChatMessage from "./ChatMessage";
import { mapGetters, mapState } from "vuex";
import { default as getImage } from "../../mixins/getImage";
import io from "socket.io-client";

export default {
  name: "BoardPins",
  data: function() {
    return {
      currentMsg: "",
      inchat: false,
      chatWith: {
        name: "",
        imageId: "",
        id: "",
      },
      socket: "",
      allowNotify: false,
      typing: false,
    };
  },
  mixins: [getImage],
  components: {
    ChatMessage,
  },
  methods: {
    sendMsg() {
      if (this.currentMsg != "") {
        let msg = {
          owner: true,
          note: this.currentMsg,
          time: Date.now(),
        };
        this.$store.commit("chat/addMsg", msg);
        let payload = {
          senderId: this.myData._id,
          recieverId: this.chatWith.id,
          message: this.currentMsg,
        };
        this.$nextTick(() => {
          let msgBox = document.getElementsByClassName("msgBox")[0];
          msgBox.scrollTop = msgBox.scrollHeight;
        });
        this.$store.dispatch("chat/sendMsg", payload);

        this.socket.emit("message", {
          recieverImage: this.getImage(this.myData.profileImage),
          senderImage: this.getImage(this.myData.profileImage),
          recieverName: this.chatWith.name,
          recieverId: [this.chatWith.id],
          senderName: this.myData.firstName + " " + this.myData.lastName,
          message: this.currentMsg,
          senderId: this.myData._id,
          date: Date.now(),
        });
        this.currentMsg = "";
      }
    },
    toChat(chatWith) {
      let payload = {
        senderId: this.myData._id,
        recieverId: chatWith.id,
      };
      this.$store.dispatch("chat/getChat", payload);
      this.chatWith = chatWith;
      this.inchat = !this.inchat;
      this.$nextTick(() => {
        let msgBox = document.getElementsByClassName("msgBox")[0];
        msgBox.scrollTop = msgBox.scrollHeight;
      });
      setTimeout(() => {
        let msgBox = document.getElementsByClassName("msgBox")[0];
        msgBox.scrollTop = msgBox.scrollHeight;
      }, 3000);
    },
    messageListener() {
      this.socket.on("sendMessage", (data) => {
        this.typing = false;
        let ping = new Audio();
        ping.src = require("../../assets/Ping.mp3");
        ping.play();
        if (data.senderId == this.chatWith.id) {
          let msg = {
            owner: false,
            note: data.message,
            time: data.date,
          };
          this.$store.commit("chat/addMsg", msg);
          this.$nextTick(() => {
            let msgBox = document.getElementsByClassName("msgBox")[0];
            msgBox.scrollTop = msgBox.scrollHeight;
          });
        }
        let options = {
          body: data.senderName + " has sent you a new msg \n" + data.message,
          silent: true,
        };

        if (this.allowNotify) {
          let notify = new Notification("phantom new message", options);
          setTimeout(() => {
            notify.close();
          }, 5000);
        } else {
          console.log("notification disabled");
        }
        //alert server that the message has been delivered
        this.socket.emit("delivered", {
          recieverId: this.chatWith.id,
          senderId: this.myData._id,
          timeStamp: Date.now(),
        });
      });
    },
    typingLisener() {
      this.socket.on("isTyping", (data) => {
        if (data.senderId == this.chatWith.id) {
          console.log("dd");
          this.typing = true;
        }
        setTimeout(() => {
          this.typing = false;
        }, 5000);
      });
    },
    isTyping() {
      console.log("bnm");
      this.socket.emit("typing", {
        recieverId: this.chatWith.id,
        senderId: this.myData._id,
      });
    },
    deliveredListener() {
      this.socket.on("setDelivered", (data) => {
        console.log(data);
      });
    },
  },
  computed: {
    ...mapGetters({
      following: "followers/userFollowing",
      chat: "chat/currentChat",
    }),
    ...mapState({
      myData: (state) => state.user.userData,
    }),
  },
  created() {
    this.$store.dispatch("followers/getFollowing");
    //starting socket connection
    //send seen message to the other party
    this.socket = io.connect("http://localhost:3000");
    let token = localStorage.getItem("userToken");
    token = token.substring(7);
    //personalise connection
    this.socket.emit("setUserId", {
      token: token,
    });
    //ensure notification is enabled
    Notification.requestPermission().then((permission) => {
      if (permission == "granted") {
        this.allowNotify = true;
      } else {
        console.log("notification disabled");
      }
    });
    //messageListener
    this.messageListener();
    //typing
    this.typingLisener();
    //
    this.deliveredListener();
  },
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
  top: 160px;
  right: 140px;
  bottom: 0px;
  animation: dropDown 0.1s linear forwards;
  z-index: 100;
  padding: 20px;
}
.msgBox {
  height: 80%;
  overflow-y: auto;
}

.msging {
  position: relative;
  height: 100%;
}

#msg {
  position: absolute;
  bottom: 0;
}
button {
  border: none;
  background-color: $lightPink;
  font-size: 20px;
  width: 40px;
  height: 40px;
  transition: background-color linear 0.5s;
  color: $darkBlue;
  border-radius: 50%;
  margin: 5px;
  text-align: center;
  box-sizing: border-box;
  i {
    padding-top: 5px;
  }
}
button:hover {
  background-color: $lightPinkHover;
}
button:active {
  transform: scale(0.9);
  background-color: $lightPinkHover;
}
input {
  border: 2px solid $darkBlue;
  height: 40px;
  width: 250px;
  border-radius: 32px;
  padding: 20px;
}
@keyframes dropDown {
  from {
    right: 0px;
  }
  to {
    right: 140px;
  }
}
.userInfo {
  padding: 7px;
  margin: 4px 0;
  color: $darkBlue;
  transition: linear 0.2s;
  border-radius: 16px;
  img {
    width: 40px;
    border-radius: 50%;
    margin-right: 5px;
  }
}
.userInfo:hover {
  background-color: $offWhite;
}
.currentUser {
  i {
    display: inline-block;
    transition: linear 0.2s;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    padding: 7px;
  }
  i:hover {
    background-color: $lightPink;
  }
  p {
    width: 85%;
    display: inline-block;
    text-align: center;
  }
}

//copied from codepen
.typing-loader {
  margin: 10px 0 10px 10px;
  width: 6px;
  height: 6px;
  -webkit-animation: line 1s linear infinite alternate;
  -moz-animation: line 1s linear infinite alternate;
  animation: line 1s linear infinite alternate;
}
@-webkit-keyframes line {
  0% {
    background-color: rgba(0, 0, 0, 1);
    box-shadow: 12px 0px 0px 0px rgba(0, 0, 0, 0.2),
      24px 0px 0px 0px rgba(0, 0, 0, 0.2);
  }
  25% {
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 12px 0px 0px 0px rgba(0, 0, 0, 2),
      24px 0px 0px 0px rgba(0, 0, 0, 0.2);
  }
  75% {
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 12px 0px 0px 0px rgba(0, 0, 0, 0.2),
      24px 0px 0px 0px rgba(0, 0, 0, 2);
  }
}

@-moz-keyframes line {
  0% {
    background-color: rgba(0, 0, 0, 1);
    box-shadow: 12px 0px 0px 0px rgba(0, 0, 0, 0.2),
      24px 0px 0px 0px rgba(0, 0, 0, 0.2);
  }
  25% {
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 12px 0px 0px 0px rgba(0, 0, 0, 2),
      24px 0px 0px 0px rgba(0, 0, 0, 0.2);
  }
  75% {
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 12px 0px 0px 0px rgba(0, 0, 0, 0.2),
      24px 0px 0px 0px rgba(0, 0, 0, 2);
  }
}

@keyframes line {
  0% {
    background-color: rgba(0, 0, 0, 1);
    box-shadow: 12px 0px 0px 0px rgba(0, 0, 0, 0.2),
      24px 0px 0px 0px rgba(0, 0, 0, 0.2);
  }
  25% {
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 12px 0px 0px 0px rgba(0, 0, 0, 2),
      24px 0px 0px 0px rgba(0, 0, 0, 0.2);
  }
  75% {
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 12px 0px 0px 0px rgba(0, 0, 0, 0.2),
      24px 0px 0px 0px rgba(0, 0, 0, 2);
  }
}
</style>
