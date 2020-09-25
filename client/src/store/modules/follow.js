import axios from "axios";

const state = {
  All: [],
  Trending: [],
  Topics: [],
  following: [],
  followPageLoading: false,
  popupLoading: false,
  firstList: [
    {
      name: "Travel"
    },
    {
      name: "Anime"
    },
    {
      name: "Babies"
    },
    {
      name: "Photography"
    },
    {
      name: "Kpop"
    },
    {
      name: "The Witcher"
    },
    {
      name: "Design"
    },
    {
      name: "Books"
    },
    {
      name: "Flowers"
    },
    {
      name: "Men Style"
    },
    {
      name: "Nutrition"
    },
    {
      name: "Desserts"
    },
    {
      name: "Nature"
    },
    {
      name: "Memes"
    },
    {
      name: "Quran"
    },
    {
      name: "Sewing"
    },
    {
      name: "Skin Care"
    },
    {
      name: "Education"
    },
    {
      name: "Peircing"
    },
    {
      name: "Prom Dresses"
    },
    {
      name: "Love Quotes"
    },
    {
      name: "Dresses Gowns"
    }
  ],
  secondList: [
    {
      name: "Anime Girls"
    },
    {
      name: "Animation"
    },
    {
      name: "Braids"
    },
    {
      name: "Baking"
    },
    {
      name: "Recipes"
    },
    {
      name: "Makeup"
    },
    {
      name: "Beauty"
    },
    {
      name: "Hairstyles"
    },
    {
      name: "Cooking"
    },
    {
      name: "Astronomy"
    },
    {
      name: "Disney"
    },
    {
      name: "Writing"
    },
    {
      name: "Animals"
    },
    {
      name: "Cats"
    },
    {
      name: "Nails"
    },
    {
      name: "Shoes"
    },
    {
      name: "Road Trips"
    },
    {
      name: "Gardening"
    },
    {
      name: "Tatto"
    },
    {
      name: "Men Fitness"
    },
    {
      name: "Harry Potter"
    },
    {
      name: "Eyemakup"
    }
  ]
};

const mutations = {
  setAllRecommend(state, cards) {
    state.All = cards;
  },
  setTrendingRecommend(state, cards) {
    state.Trending = cards;
  },
  setTopicsRecommend(state, cards) {
    state.Topics = cards;
  },
  setfollowInAll(state, id) {
    state.All.find(x => x.user._id === id).user.followers++;
  },
  setunfollowInAll(state, id) {
    state.All.find(x => x.user._id === id).user.followers--;
  },
  setfollowInTrending(state, id) {
    state.Trending.find(x => x.user._id === id).user.followers++;
  },
  setunfollowInTrending(state, id) {
    state.Trending.find(x => x.user._id === id).user.followers--;
  },
  setfollowInTopics(state, id) {
    state.Topics.find(x => x._id === id).followers++;
  },
  setunfollowInTopics(state, id) {
    state.Topics.find(x => x._id === id).followers--;
  },
  setFollowing(state, follow) {
    state.following = follow;
  }
};

const actions = {
  allRecommendations({ commit }) {
    state.popupLoading = true;
    axios
      .get("me/recommendation/follow")
      .then(response => {
        commit("setAllRecommend", response.data);
        state.popupLoading = false;
      })
      .catch(error => {
        console.log(error);
      });
  },
  trendingRecommendations({ commit }) {
    state.popupLoading = true;
    axios
      .get("me/recommendation/trending")
      .then(response => {
        commit("setTrendingRecommend", response.data);
        state.popupLoading = false;
      })
      .catch(error => {
        console.log(error);
      });
  },
  async topicsRecommendations({ commit }, topicName) {
    state.popupLoading = true;
    await axios
      .get("me/recommendation/topics/" + topicName)
      .then(response => {
        commit("setTopicsRecommend", response.data);
        state.popupLoading = false;
      })
      .catch(error => {
        console.log(error);
      });
  },
  followPinCreator({ commit }, { pinCreatorId, type }) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    axios
      .put("me/follow-user/" + pinCreatorId)
      .then(() => {
        if (type == "All") commit("setfollowInAll", pinCreatorId);
        else if (type == "Trending")
          commit("setfollowInTrending", pinCreatorId);
        else if (type == "Topics") commit("setfollowInTopics", pinCreatorId);
      })
      .catch(error => {
        console.log(error);
      });
  },
  unFollowPinCreator({ commit }, { pinCreatorId, type }) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    axios
      .delete("me/follow-user/" + pinCreatorId)
      .then(() => {
        if (type == "All") commit("setunfollowInAll", pinCreatorId);
        else if (type == "Trending")
          commit("setunfollowInTrending", pinCreatorId);
        else if (type == "Topics") commit("setunfollowInTopics", pinCreatorId);
      })
      .catch(error => {
        console.log(error);
      });
  },
  followingPage({ commit }) {
    state.followPageLoading = true;
    axios
      .get("me/followings/pins")
      .then(response => {
        console.log("data nihal", response.data);
        commit("setFollowing", response.data);
        state.followPageLoading = false;
      })
      .catch(error => {
        console.log(error);
        state.followPageLoading = false;
      });
  }
};

const getters = {
  All: state => state.All,
  Trending: state => state.Trending,
  Topics: state => state.Topics,
  following: state => state.following,
  followPageLoading: state => state.followPageLoading,
  popupLoading: state => state.popupLoading,
  firstList: state => state.firstList,
  secondList: state => state.secondList
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
