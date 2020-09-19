export default {
  methods: {
    getImage(imageId, topic = "") {
      console.log(imageId);
      if (topic != "") {
        return "http://localhost:3000/api/image/%20?topic=" + topic;
      }
      if (imageId == "") {
        return "http://localhost:3000/api/image/%20";
      }
      return "http://localhost:3000/api/image/" + imageId;
    }
  }
};
