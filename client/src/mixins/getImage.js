export default {
  methods: {
    getImage(imageId, google = false, googleImage = "", topic = "") {
      if (topic != "") {
        return process.env.VUE_APP_baseURL+"/image/%20?topic=" + topic;
      }
      if (google) {
        return googleImage;
      } else if (imageId == "") {
        return process.env.VUE_APP_baseURL+"/image/%20";
      }
      return process.env.VUE_APP_baseURL+"/image/" + imageId;
    }
  }
};
