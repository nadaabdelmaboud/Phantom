<template>
  <div class="msgWindow">
    <div class="msging">
      <div v-if="!inchat">
        <div
          class="userInfo"
          v-for="r in recentChats"
          :key="r._id"
          @click="
            toChat({
              name: r.userName,
              id: r._id,
              imageId: r.profileImage
            })
          "
        >
          <img style=" margin-top: -25px;" :src="getImage(r.profileImage)" />
          <div class="inlineDiv">
            <p>{{ r.userName }}</p>
            <p>{{ r.lastMessage.message | sliceMsg }}</p>
          </div>
        </div>

        <div v-for="(f, i) in following" :key="i">
          <div
            class="userInfo"
            v-if="!recentChats.some(r => r._id === f._id)"
            @click="
              toChat({
                name: f.firstName + ' ' + f.lastName,
                id: f._id,
                imageId: f.profileImage
              })
            "
          >
            <img :src="getImage(f.profileImage)" />
            <span>{{ f.firstName }}</span>
            <span> {{ f.lastName }}</span>
          </div>
        </div>
      </div>

      <div class="currentUser" v-if="inchat">
        <i class="fa fa-arrow-left" @click="toChatters"></i>
        <p>{{ chatWith.name }}</p>
      </div>
      <div class="msgBox" v-if="inchat">
        <ChatMessage
          v-for="(msg, i) in chat"
          :key="i"
          :imageId="msg.senderImage"
          :msgText="msg.message"
          :owner="msg.owner"
          :timeStamp="msg.date"
          :last="msg.last"
          :seen="msg.seen"
          :delivered="msg.deliver"
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
        id: ""
      },
      socket: "",
      allowNotify: false,
      typing: false,
      meTyping: false
    };
  },
  mixins: [getImage],
  components: {
    ChatMessage
  },
  methods: {
    sendMsg() {
      if (this.currentMsg != "") {
        let msg = {
          owner: true,
          message: this.currentMsg,
          date: Date.now()
        };
        this.$store.commit("chat/addMsg", msg);
        this.$nextTick(() => {
          let msgBox = document.getElementsByClassName("msgBox")[0];
          msgBox.scrollTop = msgBox.scrollHeight;
        });
        this.socket.emit("message", {
          recieverImage: this.getImage(this.myData.profileImage),
          senderImage: this.getImage(this.myData.profileImage),
          recieverName: this.chatWith.name,
          recieverId: this.chatWith.id,
          senderName: this.myData.firstName + " " + this.myData.lastName,
          message: this.currentMsg,
          senderId: this.myData._id,
          date: Date.now()
        });
        this.currentMsg = "";
      }
    },
    toChat(chatWith) {
      let payload = {
        senderId: this.myData._id,
        recieverId: chatWith.id
      };
      this.$store.dispatch("chat/setAsSeen", payload);
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
    toChatters() {
      // this.$store.dispatch("followers/getFollowing");
      this.chatWith.id = "";
      this.$store.dispatch("chat/getRecentChats", this.myData._id);
      this.inchat = !this.inchat;
    },
    messageListener() {
      this.socket.on("sendMessage", data => {
        this.typing = false;
        let ping = new Audio();
        ping.src = require("../../assets/Ping.mp3");
        ping.play();
        if (data.senderId == this.chatWith.id) {
          let msg = {
            owner: false,
            message: data.message,
            date: data.date,
            seen: false,
            deliver: false,
            last: true,
            _id: data.messageId
          };
          this.$store.commit("chat/addMsg", msg);
          this.$nextTick(() => {
            let msgBox = document.getElementsByClassName("msgBox")[0];
            msgBox.scrollTop = msgBox.scrollHeight;
          });

          //if in same chat set as seen
          this.socket.emit("seen", {
            recieverId: data.senderId,
            senderId: this.myData._id,
            messageId: data.messageId
          });
        }
        let options = {
          body: data.senderName + " has sent you a new msg \n" + data.message,
          silent: true
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
        console.log("hb3t");
        this.socket.emit("delivered", {
          recieverId: data.senderId,
          senderId: this.myData._id,
          messageId: data.messageId
        });
      });
    },
    typingLisener() {
      this.socket.on("isTyping", data => {
        if (data.senderId == this.chatWith.id) {
          this.typing = true;
          this.$nextTick(() => {
            let msgBox = document.getElementsByClassName("msgBox")[0];
            msgBox.scrollTop = msgBox.scrollHeight;
          });
        }
        setTimeout(() => {
          this.typing = false;
        }, 3000);
      });
    },
    isTyping() {
      console.log("bnm");
      if (!this.meTyping) {
        this.meTyping = true;
        this.socket.emit("typing", {
          recieverId: this.chatWith.id,
          senderId: this.myData._id
        });
        setTimeout(() => {
          this.meTyping = false;
        }, 3000);
      }
    },
    deliveredListener() {
      this.socket.on("setDelivered", data => {
        let payload = {
          senderId: this.myData._id,
          recieverId: [this.chatWith.id]
        };
        console.log("oh1");
        this.$store.dispatch("chat/getChat", payload);
        console.log("oh2", data);
        if (data.senderId == this.chatWith.id) {
          console.log("oh3");
          this.$store.commit("chat/setDeliver", data.messageId);
        }
      });
    },
    seenListener() {
      this.socket.on("setSeen", data => {
        let payload = {
          senderId: this.myData._id,
          recieverId: [this.chatWith.id]
        };
        console.log("oh1 seeen", data);
        this.$store.dispatch("chat/getChat", payload);
        console.log("oh2 seeen");
        if (data.senderId == this.chatWith.id) {
          this.$store.commit("chat/setSeen", data.messageId);
          console.log("oh3");
        }
      });
    }
  },
  computed: {
    ...mapGetters({
      following: "followers/userFollowing",
      recentChats: "chat/recentChats",
      chat: "chat/currentChat"
    }),
    ...mapState({
      myData: state => state.user.userData
    })
  },
  created() {
    this.$store.dispatch("followers/getFollowing");
    this.$store.dispatch("chat/getRecentChats", this.myData._id);
    //starting socket connection
    //send seen message to the other party
    this.socket = io.connect("http://localhost:3000");
    let token = localStorage.getItem("userToken");
    token = token.substring(7);
    //personalise connection
    this.socket.emit("setUserId", {
      token: token
    });
    //ensure notification is enabled
    Notification.requestPermission().then(permission => {
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
    //delivered
    this.deliveredListener();
    //seen
    this.seenListener();
  },
  filters: {
    sliceMsg: function(value) {
      console.log("hi", value);
      if (typeof value == "undefined") return "no msg";
      if (value.length < 25) return value;
      return value.slice(0, 25) + "...";
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";

.msgWindow {
  height: calc(-179px + 100vh);
  min-height: 250px;
  width: 360px;
  box-shadow: rgba(0, 0, 0, 0.1) -3px 4px 14px 0px;
  background-color: #fff;
  position: fixed;
  border-radius: 16px;
  // top: 160px;
  right: 80px;
  bottom: 10px;
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
  overflow-y: auto;
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
    right: 80px;
  }
}
.userInfo {
  padding: 7px;
  margin: 4px 0;
  color: $darkBlue;
  transition: linear 0.2s;
  border-radius: 16px;
  cursor: pointer;
  height: 54px;
  img {
    width: 40px;
    height: 40px;
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

.inlineDiv {
  display: inline-block;
  p {
    margin: 0;
  }
  p:nth-child(2) {
    font-size: 10px;
    color: $lightBlue;
  }
}
</style>
