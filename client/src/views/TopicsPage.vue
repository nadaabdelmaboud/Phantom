<template>
  <div class="TopicsPage">
    <div class="conatiner">
      <div class="titleContent">
        <div class="title">
          <h5>Tune your home feed</h5>
          <h3>
            The Pins in your home feed are based on your boards, recent activity
            and favorite topics. Edit your preferences to change things up!
          </h3>
        </div>
        <div class="userImage">
          <img
            v-if="this.showGoogleImage"
            :src="
              getImage(
                userData.profileImage,
                userData.google,
                userData.googleImage
              )
            "
            class="userImage"
            alt="User Image"
            @click="toUserPage"
          />
        </div>
      </div>
      <Loading :loading="topicsLoading" v-if="topicsLoading" />
      <div class="callingTopicsCards" v-if="!topicsLoading">
        <div v-for="topic in topics" :key="topic.name">
          <TopicsPageCard
            :topicName="topic.name"
            :topicId="topic._id"
            :imageId="topic.imageId"
            :isFollow="topic.isFollow"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.TopicsPage {
  margin-top: 40px;
  align-items: center;
  display: flex;
  flex-direction: column;
}
.conatiner {
  width: 65%;
}
.titleContent {
  display: flex;
}
.userImage {
  margin-top: 5px;
  margin-left: 50px;
  width: 106px;
  height: 106px;
  border-radius: 50%;
  cursor: pointer;
}
.title {
  width: 70%;
  text-align: left;
}
h5 {
  font-size: 36px;
  font-weight: 700;
}
h3 {
  width: 90%;
  margin-top: 17px;
  font-size: 21px;
  font-weight: 400;
}
.callingTopicsCards {
  margin-top: 15px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 10px;
}
@media screen and (max-width: 1500px) {
  .conatiner {
    width: 70%;
  }
}
@media screen and (max-width: 1100px) {
  .conatiner {
    width: 75%;
  }
}
@media screen and (max-width: 993px) {
  .titleContent {
    flex-flow: wrap;
  }
  .title {
    margin-left: 5px;
    width: 100%;
  }
  .conatiner {
    width: 95%;
  }
  .userImage {
    margin: auto;
  }
  .callingTopicsCards {
    justify-items: center;
  }
}
@media screen and (max-width: 512px) {
  .conatiner {
    width: 98%;
  }
}
</style>

<script>
import { default as getImage } from "../mixins/getImage";
import TopicsPageCard from "../components/Topics/TopicsPageCard";
import Loading from "../components/GeneralComponents/Loading";
import { mapState, mapGetters } from "vuex";
export default {
  name: "TopicsPage",
  data: function() {
    return {
      showGoogleImage: false
    };
  },
  components: {
    TopicsPageCard,
    Loading
  },
  mixins: [getImage],
  methods: {
    toUserPage() {
      this.$router.push("/UserProfile/Boards");
    }
  },
  computed: {
    ...mapState({
      topics: state => state.topics.topics,
      userData: state => state.user.userData
    }),
    ...mapGetters({
      topicsLoading: "topics/topicsLoading"
    })
  },
  mounted() {
    this.$store.dispatch("topics/getTopics");
    if (this.userData != null) this.showGoogleImage = true;
  },
  watch: {
    userData() {
      if (this.userData == null) this.showGoogleImage = false;
      else this.showGoogleImage = true;
    }
  }
};
</script>
