<template>
  <div id="createBoard" @click="closePopup">
    <div class="boardData">
      <div class="dots">
        <i class="fa fa-circle"></i>
        <i class="fa fa-circle"></i>
        <i class="fa fa-circle"></i>
        <i class="fa fa-circle"></i>
        <i class="fa fa-circle"></i>
      </div>
      <h2>Last step! Tell us what you're interested in</h2>
      <div class="topicsContainer">
        <div v-for="t in topics" :key="t.name" @click="addTopic(t._id)">
          <TopicsCard :topicName="t.name" :topicId="t._id" :imageId="t.imageId" />
        </div>
      </div>
      <div class="buttonDiv">
        <button v-if="picked.length < 5" class="disable">
          pick {{ 5 - picked.length }} more
        </button>
        <button v-if="picked.length >= 5" @click="followTopics">Done</button>
      </div>
    </div>
  </div>
</template>

<script>
import TopicsCard from "./TopicsCards";
import { mapGetters } from "vuex";

export default {
  name: "followTopics",
  data: function() {
    return {
      picked: []
    };
  },
  components: {
    TopicsCard
  },
  methods: {
    addTopic(name) {
      let findtopic = this.picked.indexOf(name);
      if (findtopic == -1) this.picked.push(name);
      else {
        this.picked.splice(findtopic, 1);
      }
    },
    followTopics() {
      this.picked.forEach(topic => {
        console.log(topic);
        this.$store.dispatch("topics/followTopic", topic);
      });
      this.$store.commit("popUpsState/toggleTopicsPopup");
    },
    closePopup(event) {
      if (event.target.id == "createBoard")
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
