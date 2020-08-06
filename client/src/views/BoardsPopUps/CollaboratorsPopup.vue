<template>
  <div id="add" @click="editPopup">
       <div class="addCollab">
           <h3>Invite Collaborators</h3>
           <label>
               Collaborators can...
           </label>
           <CallaboratorsCard/>
       </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import CallaboratorsCard from "./CollaboratorsCard"
export default {
  name: "CollaboratorsPopup",
  data: function() {
    return {
    };
  },
  components:{
      CallaboratorsCard
  },
  methods: {
    editPopup(event) {
      if (event.target.id == "addCollab") {
        this.$store.commit("popUpsState/toggleCollaboratorsPopup");
      }
    }
  },
  computed: {
    ...mapGetters({
    }),
  },
  created() {
  },
};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";
@import '../../scss/Mixins';
@import "../../scss/GlobalPopup";

#add {
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  z-index: 12;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.addCollab {
  margin: 90px auto;
  background-color: white;
  width: 450px;
  padding: 20px;
  border-radius: 32px;
}
h3 {
  width: 100%;
  text-align: center;
}
</style>
