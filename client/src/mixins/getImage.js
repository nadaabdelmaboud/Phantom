export default {
  methods: {
    getImage(imageId, topic = "") {
      if (topic != "") {
        return "http://localhost:3000/api/image/%20?topic=" + topic;
      }
      if (imageId == "") {
        return "http://localhost:3000/api/image/none";
      }
      return "http://localhost:3000/api/image/" + imageId;
    }
  }
};
