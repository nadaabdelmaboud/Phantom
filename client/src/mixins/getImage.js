export default {
  methods: {
    getImage(imageId) {
      console.log(imageId);
      return "http://localhost:3000/api/image/" + imageId;
    }
  }
};
