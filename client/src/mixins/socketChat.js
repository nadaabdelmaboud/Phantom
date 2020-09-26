import io from "socket.io-client";
import { mapGetters, mapState } from "vuex";
import { default as getImage } from "./getImage";

export default {
  data: function() {
    return {
      currentMsg: "",
      inchat: false,
      chatWith: {
        name: "",
        imageId: "",
        id: "",
        google: false,
        googleImage: "",
      },
      socket: "",
      allowNotify: false,
      typing: false,
      meTyping: false,
      searchWord: "",
    };
  },
  mixins: [getImage],
  methods: {
    sendMsg() {
      if (this.currentMsg != "") {
        let msg = {
          owner: true,
          message: this.currentMsg,
          date: Date.now(),
        };
        this.$store.commit("chat/addMsg", msg);
        this.scrollDown();
        this.socket.emit("message", {
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
        senderId: chatWith.id,
        recieverId: this.myData._id,
      };
      this.$store.dispatch("chat/setAsSeen", payload);
      this.inchat = !this.inchat;
    },
    toChatters() {
      this.$store.commit("chat/setChat", []);
      this.chatWith.id = "";
      this.$store.dispatch("chat/getRecentChats", this.myData._id);
      this.inchat = !this.inchat;
    },
    messageListener() {
      this.socket.on("sendMessage", (data) => {
        if (document.getElementsByClassName("msgWindow").length) {
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
            this.scrollDown();

            //if in same chat set as seen
            this.socket.emit("seen", {
              recieverId: this.myData._id,
              senderId: data.senderId,
              messageId: data.messageId,
            });
          }
        }
        this.typing = false;
        let ping = new Audio();
        ping.src = require("../assets/Ping.mp3");
        ping.play();
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
          recieverId: this.myData._id,
          senderId: data.senderId,
          messageId: data.messageId,
        });
      });
    },
    typingLisener() {
      this.socket.on("isTyping", (data) => {
        if (data.senderId == this.chatWith.id) {
          this.typing = true;
          this.scrollDown();
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
        if (data.senderId == this.myData._id) {
          this.$store.commit("chat/setState", "deliver");
        }
      });
    },
    seenListener() {
      this.socket.on("setSeen", (data) => {
        console.log("d", data);
        if (data.senderId == this.myData._id) {
          this.$store.commit("chat/setState", "seen");
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
      if (searchBox && searchBox.scrollTop == searchBox.scrollHeight - 300) {
        this.$store.dispatch("chat/searchPeople", {
          name: this.searchWord,
          recentSearch: false,
        });
      }
    },
    scrollDown() {
      this.$nextTick(() => {
        let msgBox = document.getElementsByClassName("msgBox")[0];
        if (msgBox) msgBox.scrollTop = msgBox.scrollHeight;
      });
    },
  },
  computed: {
    ...mapGetters({
      following: "followers/userFollowing",
      recentChats: "chat/recentChats",
      chat: "chat/currentChat",
      peopleSearch: "chat/people",
      loading: "chat/loading",
    }),
    ...mapState({
      myData: (state) => state.user.userData,
    }),
  },
  created() {
    //starting socket connection
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
  watch: {
    loading: {
      handler(loading) {
        if (!loading) {
          this.scrollDown();
        }
      },
    },
  },
};
