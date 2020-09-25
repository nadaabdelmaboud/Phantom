export default {
  methods: {
    getImage(imageId, google = false, googleImage = "", topic = "") {
      if (topic != "") {
        return "http://localhost:3000/api/image/%20?topic=" + topic;
      }
      if (google) {
        return googleImage;
      } else if (imageId == "") {
        return "http://localhost:3000/api/image/%20";
      }
      return "http://localhost:3000/api/image/" + imageId;
    }
  }
};
