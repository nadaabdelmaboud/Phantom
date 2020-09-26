<template>
  <div id="createBoard">
    <div class="boardData">
      <div class="dots">
        <i class="fa fa-circle"></i>
        <i class="fa fa-circle"></i>
        <i class="fa fa-circle"></i>
        <i class="fa fa-circle"></i>
        <i class="fa fa-circle"></i>
      </div>
      <h2>Last step! Tell us what you're interested in</h2>
      <Loading :loading="!topics.length" />
      <div v-if="topics.length" class="topicsContainer">
        <div v-for="t in topics" :key="t.name" @click="addTopic(t._id)">
          <TopicsCard
            :isFollowed="t.isFollow"
            :topicName="t.name"
            :topicId="t._id"
            :imageId="t.imageId"
          />
        </div>
      </div>
      <div class="buttonDiv">
        <button v-if="picked.length < 5" class="disable">
          pick {{ 5 - picked.length }} more
        </button>
        <button v-if="picked.length >= 5" @click="closePopup">Done</button>
      </div>
    </div>
  </div>
</template>

<script>
import TopicsCard from "./TopicsCards";
import Loading from "../GeneralComponents/Loading";
import { mapGetters } from "vuex";

export default {
  name: "followTopics",
  data: function() {
    return {
      picked: []
    };
  },
  components: {
    TopicsCard,
    Loading
  },
  methods: {
    addTopic(id) {
      let findtopic = this.picked.indexOf(id);
      if (findtopic == -1) {
        this.picked.push(id);
      } else {
        this.picked.splice(findtopic, 1);
      }
    },
    closePopup() {
      this.$store.commit("popUpsState/toggleTopicsPopup");
    }
  },
  computed: {
    ...mapGetters({
      topics: "topics/topics"
    })
  },
  mounted() {
    this.$store.dispatch("topics/getTopics");
    this.topics.forEach(topic => {
      if (topic.isFollow && this.picked.indexOf(topic._id) == -1) {
        this.picked.push(topic._id);
      }
    });
  },
  watch: {
    topics: {
      handler(topics) {
        topics.forEach(topic => {
          if (topic.isFollow && this.picked.indexOf(topic._id) == -1) {
            this.picked.push(topic._id);
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";
@import "../../scss/GlobalPopup";
h2 {
  width: 100%;
  text-align: center;
  font-weight: 700;
  margin: 15px 0;
  font-size: 30px;
  color: $darkBlue;
}
.boardData {
  margin: 30px auto;
  width: 70%;
}
.dots {
  display: flex;
  justify-content: center;
  color: $darkBlue;
  i {
    font-size: 12px;
    margin: 7px;
  }
}
.topicsContainer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  width: 100%;
  height: 55vh;
  max-height: 400px;
  overflow-y: auto;
}
button {
  width: 70%;
  margin: 0 15%;
}
</style>
