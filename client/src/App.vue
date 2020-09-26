<template>
  <div @click="checkLists">
    <router-view></router-view>
  </div>
</template>

<script>
import { initializeFirebase } from "../src/messaging/init";
import axios from "axios";
import { default as masonryGrid } from "./mixins/masonryGrid";
import { default as socketChat } from "./mixins/socketChat";
export default {
  name: "App",
  mixins: [masonryGrid, socketChat],
  created() {
    let token = localStorage.getItem("userToken");
    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
      this.$store.dispatch("user/getUserProfile");
    }
    initializeFirebase();
    window.addEventListener("scroll", () => {
      if (
        Math.abs(
          window.innerHeight + window.scrollY - document.body.offsetHeight
        ) <= 2
      ) {
        if (this.$route.path.includes("/More")) {
          console.log("scroloo");
          let boardId = this.$route.params.boardId;
          this.$store.dispatch("boards/moreLike", {
            boardId: boardId,
            limit: 8,
          });
        } else if (this.$route.path.includes("allpins")) {
          let name = this.$route.params.name;
          this.$store.dispatch("search/searchPins", {
            name: name,
          });
        } else if (this.$route.path.includes("PostPage")) {
          let postId = this.$route.params.postPageId;
          this.$store.dispatch("postPage/generateMorePins", {
            pinId: postId,
            limit: 10,
          });
        } else if (this.$route.path.includes("people")) {
          let name = this.$route.params.name;
          this.$store.dispatch("search/searchPeople", {
            name: name,
          });
        } else if (this.$route.path.includes("boards")) {
          let name = this.$route.params.name;
          this.$store.dispatch("search/searchBoards", {
            name: name,
          });
        } else if (this.$route.path.includes("mypins")) {
          let name = this.$route.params.name;
          this.$store.dispatch("search/searchMyPins", {
            name: name,
          });
        } else if (this.$route.path.includes("")) {
          //if condition is new here and in userHome
          if (localStorage.getItem("userToken") != "") {
            this.$store.dispatch("homeCards/userGenerateCards", 10);
          }
        }
      }
    });
    setInterval(() => {
      this.waitForImages();
    }, 500);
  },
  methods: {
    checkLists(event) {
      console.log(event.target.id);
      this.$store.commit(
        "notifications/alterShow",
        event.target.id == "alertIcon"
      );
      this.$store.commit(
        "popUpsState/toggleNavList",
        event.target.id == "homeNavSmall"
      );
      this.$store.commit(
        "popUpsState/toggleShowList",
        event.target.id == "showList"
      );
    },
  },
};
</script>
