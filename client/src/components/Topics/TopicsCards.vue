<template>
  <div
    class="topic"
    :style="{ backgroundImage: `url(${getImg})` }"
    @click="alterFollow"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    :class="[{ show: clicked, doubleBorder: clicked || hover }]"
  >
    <i class="fa fa-check-circle" aria-hidden="true"></i>
    <p>
      {{ topicName }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.topic {
  width: 144px;
  height: 144px;
  border-radius: 16px;
  background-size: cover;
  background-repeat: no-repeat;
  cursor: pointer;
  text-align: right;
  margin: 10px;
  position: relative;
  p {
    color: white;
    text-align: left;
    padding-left: 10px;
    padding-top: 70px;
    font-size: 16px;
    font-weight: 700;
    position: absolute;
  }
  i {
    margin: 10px;
    font-size: 22px;
    color: transparent;
  }
}
.doubleBorder {
  border: 1px solid black;
  position: relative;
}
.doubleBorder:before {
  background: none;
  border: 4px solid #fff;
  border-radius: 16px;
  content: "";
  position: absolute;
  top: 1px;
  left: 1px;
  right: 1px;
  bottom: 1px;
}
.show {
  i {
    color: black;
  }
}
</style>

<script>
export default {
  name: "TopicsCards",
  data: function() {
    return {
      clicked: false,
      hover: false
    };
  },
  props: {
    topicId: {
      type: String
    },
    imageId: {
      type: String
    },
    topicName: {
      type: String
    },
    isFollowed: {
      type: Boolean
    }
  },
  computed: {
    getImg() {
      return process.env.VUE_APP_baseURL + "/image/" + this.imageId;
    }
  },
  methods: {
    async alterFollow() {
      this.clicked = !this.clicked;
      if (this.clicked) {
        await this.$store.dispatch("topics/followTopic", this.topicId);
      } else {
        await this.$store.dispatch("topics/unfollowTopic", this.topicId);
      }
      this.$store.dispatch("homeCards/userHome");
      setTimeout(() => {
        this.$store.dispatch("homeCards/userGenerateCards", 10);
      }, 3000);
    }
  },
  mounted() {
    this.clicked = this.isFollowed;
  }
};
</script>
