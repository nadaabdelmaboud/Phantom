<template>
  <div class="msgWindow">
    <div class="msging">
      <div v-if="!inchat">
        <input
          class="searchInput"
          type="text"
          v-model="searchWord"
          placeholder="Search"
          @input="searchFor"
        />
        <div class="searchList" v-if="searchWord">
          <div class="searchChat" @scroll="getPeople">
            <div v-for="(s, i) in peopleSearch" :key="i">
              <div
                class="userInfo"
                v-if="myData._id != s._id"
                @click="
                  toChat({
                    name: s.firstName + ' ' + s.lastName,
                    id: s._id,
                    imageId: s.profileImage,
                  })
                "
              >
                <img :src="getImage(s.profileImage)" />
                <span>{{ s.firstName }}</span>
                <span> {{ s.lastName }}</span>
              </div>
            </div>
          </div>
        </div>

        <div
          class="userInfo"
          v-for="r in recentChats"
          :key="r._id"
          @click="
            toChat({
              name: r.userName,
              id: r._id,
              imageId: r.profileImage,
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
            v-if="!recentChats.some((r) => r._id === f._id)"
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
      </div>

      <div class="currentUser" v-if="inchat">
        <i class="fa fa-arrow-left" @click="toChatters"></i>
        <p>{{ chatWith.name }}</p>
      </div>
      <div class="msgBox" v-if="inchat">
        <ChatMessage
          v-for="(msg, i) in chat"
          :key="i"
          :imageId="msg.owner ? myData.profileImage : chatWith.imageId"
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
        id: "",
      },
      socket: "",
      allowNotify: false,
      typing: false,
      meTyping: false,
      searchWord: "",
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
          message: this.currentMsg,
          date: Date.now(),
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
          date: Date.now(),
        });
        this.currentMsg = "";
      }
    },
    toChat(chatWith) {
      this.chatWith = chatWith;
      let payload = {
        senderId: this.myData._id,
        recieverId: chatWith.id,
      };
      this.$store.dispatch("chat/setAsSeen", payload);
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
      this.socket.on("sendMessage", (data) => {
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
            _id: data.messageId,
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
            messageId: data.messageId,
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
          recieverId: data.senderId,
          senderId: this.myData._id,
          messageId: data.messageId,
        });
      });
    },
    typingLisener() {
      this.socket.on("isTyping", (data) => {
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
      if (!this.meTyping) {
        this.meTyping = true;
        this.socket.emit("typing", {
          recieverId: this.chatWith.id,
          senderId: this.myData._id,
        });
        setTimeout(() => {
          this.meTyping = false;
        }, 3000);
      }
    },
    deliveredListener() {
      this.socket.on("setDelivered", (data) => {
        let payload = {
          senderId: this.myData._id,
          recieverId: [this.chatWith.id],
        };
        console.log("oh1");
        console.log("oh2", data);
        if (data.senderId == this.chatWith.id) {
          console.log("oh3");
          setTimeout(()=>{
             this.$store.dispatch("chat/getChat", payload);
          },10000)
        }
      });
    },
    seenListener() {
      this.socket.on("setSeen", (data) => {
        let payload = {
          senderId: this.myData._id,
          recieverId: [this.chatWith.id],
        };
        console.log("oh1 seeen", data);
        this.$store.dispatch("chat/getChat", payload);
        console.log("oh2 seeen");
        if (data.senderId == this.chatWith.id) {
          this.$store.commit("chat/setSeen", data.messageId);
          console.log("oh3");
        }
      });
    },
    searchFor() {
      if (this.searchWord) {
        this.$store.commit("chat/resetOffset");
        this.$store.dispatch("chat/searchPeople", {
          name: this.searchWord,
          recentSearch: false,
        });
      } else {
        this.$store.commit("chat/resetOffset");
      }
    },
    getPeople() {
      let searchBox = document.getElementsByClassName("searchChat")[0];
      if (searchBox.scrollTop == searchBox.scrollHeight - 300) {
        this.$store.dispatch("chat/searchPeople", {
          name: this.searchWord,
          recentSearch: false,
        });
      }
    },
  },
  computed: {
    ...mapGetters({
      following: "followers/userFollowing",
      recentChats: "chat/recentChats",
      chat: "chat/currentChat",
      peopleSearch: "chat/people",
    }),
    ...mapState({
      myData: (state) => state.user.userData,
    }),
  },
  created() {
    this.$store.dispatch("followers/getFollowing");
    this.$store.dispatch("chat/getRecentChats", this.myData._id);
    this.$store.commit("chat/resetOffset");
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
    //delivered
    this.deliveredListener();
    //seen
    this.seenListener();
  },
  filters: {
    sliceMsg: function(value) {
      if (typeof value == "undefined") return "no msg";
      if (value.length < 25) return value;
      return value.slice(0, 25) + "...";
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";
@import "../../scss/Mixins";
@import "../../scss/ChatStyling";
</style>
