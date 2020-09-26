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
                    google:s.google,
                    googleImage:s.googleImage
                  })
                "
              >
                <img :src="getImage(s.profileImage,s.google,s.googleImage)" />
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
              google:r.google,
              googleImage:r.googleImage
            })
          "
        >
          <img style=" margin-top: -25px;" :src="getImage(r.profileImage,r.google,r.googleImage)" />
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
                imageId: f.profileImage,
                google:f.google,
                googleImage:f.googleImage
              })
            "
          >
            <img :src="getImage(f.profileImage,f.google,f.googleImage)" />
            <span>{{ f.firstName }}</span>
            <span> {{ f.lastName }}</span>
          </div>
        </div>
      </div>

      <div class="currentUser" v-if="inchat">
        <i class="fa fa-arrow-left" @click="toChatters"></i>
        <p>{{ chatWith.name }}</p>
      </div>
      <Loading :loading="loading" v-if="loading" />
      <div class="msgBox" v-if="inchat && !loading">
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
          :google="msg.owner ? myData.google : chatWith.google"
          :googleImage="msg.owner ? myData.googleImage : chatWith.googleImage"
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
import Loading from "../GeneralComponents/Loading";
import { default as socketChat } from "../../mixins/socketChat";

export default {
  name: "BoardPins",
  data: function() {
    return {
    }
  },
  mixins: [socketChat],
  components: {
    ChatMessage,
    Loading
  },
  created(){
    this.$store.dispatch("followers/getFollowing");
    this.$store.dispatch("chat/getRecentChats", this.myData._id);
    this.$store.commit("chat/resetOffset");
  //  this.inChat();
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";
@import "../../scss/Mixins";
@import "../../scss/ChatStyling";
</style>
