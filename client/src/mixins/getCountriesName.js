import axios from "axios";

export default {
  methods: {
    getCountriesName() {
      axios.get("https://restcountries.eu/rest/v2/all").then(response => {
        return response.data;
      });
    }
  }
};
