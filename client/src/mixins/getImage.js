export default {
  methods: {
    getImage(imageId) {
      if (imageId == "") {
        return "http://localhost:3000/api/image/99";
      }
      return "http://localhost:3000/api/image/" + imageId;
    }
  }
};
