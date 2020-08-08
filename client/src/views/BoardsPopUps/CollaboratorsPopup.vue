<template>
  <div id="add" @click="editPopup">
       <div class="addCollab">
           <h3>Invite Collaborators</h3>
           <div class="collabCard">
           <label>
               Collaborators can...
           </label>
           <CallaboratorsCard
            v-for="c in collaborators"
            :key="c.id"
            :id="c.id"
            :imageId="c.imageId"
            :collabName="c.name"
            :savePin="c.savePin"
            :createPin="c.createPin"
            :editTitle="c.editTitle"
            :personalization="c.personalization"
            :editDescription="c.editDescription"
            :addCollaborators="c.addCollaborators"
            />
           </div>
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
      if (event.target.id == "add") {
        this.$store.commit("popUpsState/toggleCollaboratorsPopup");
      }
    }
  },
  computed: {
    ...mapGetters({
        collaborators: "boards/collaborators",
        followers: "followers/userFollowers"
    }),
  },
  mounted(){
      this.$store.dispatch("boards/getCollaborators");
      this.$store.dispatch("followers/getFollowers");
  },
  created() {
  }
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
  margin: 50px auto;
  background-color: white;
  width: 450px;
  padding: 20px;
  border-radius: 32px;
}
h3 {
  width: 100%;
  text-align: center;
}
.collabCard{
    height: 550px;
    overflow-y: auto;
}
</style>
