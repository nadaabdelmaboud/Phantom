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
      <h2>Tell us what you're interested in</h2>
      <Loading :loading="!topics.length" v-if="!topics.length" />
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
    document.body.classList.add("noscroll");
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
.noscroll {
  overflow-y: hidden;
}
h2 {
  width: 100%;
  text-align: center;
  font-weight: 700;
  margin: 15px 0;
  font-size: 25px;
  color: $darkBlue;
}
.boardData {
  margin: 30px auto;
  width: 70%;
  max-height: 70vh;
  overflow-y: auto;
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
  max-height: 40vh;
  overflow-y: auto;
}
button {
  width: 70%;
  margin: 0 15%;
}
@media screen and (max-width: 850px) {
  h2 {
    font-weight: 600;
    margin: 7px 0;
    font-size: 20px;
  }
  .boardData {
    margin: 10px auto;
  }
  .dots {
    i {
      font-size: 8px;
      margin: 3px;
    }
  }
  .topicsContainer {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    width: 100%;
    max-height: 30vh;
    overflow-y: auto;
  }
  .buttonDiv {
    padding-top: 15px;
  }
  button {
    width: 60%;
    margin: 0 20%;
  }
}
</style>
