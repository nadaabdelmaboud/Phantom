<template>
  <div class="home">
    <CreateBoardPopup v-if="createBoard" />
    <NewPinPopup v-if="newPin" />
    <EditBoardPopup v-if="editBoard" />
    <CollaboratorsPopup v-if="collaborators"/>
    <div>
      <HomeNavigationBar />
      <router-view class="mainComponent" />
      <i class="fa fa-comment globalIcons"></i>
      <router-link
        tag="i"
        class="fa fa-plus globalIcons"
        to="/PinBuilder"
      ></router-link>
      <i class="fa fa-question-circle globalIcons"></i>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../scss/Colors";
.mainComponent {
  background-color: $offWhite;
  min-height: calc(100vh);
  padding-top: 80px;
}
.home {
  .globalIcons {
    height: 48px;
    width: 48px;
    position: fixed;
    left: 92%;
    font-size: 24px;
    color: $darkBlue;
    border-radius: 50%;
    padding: 12px;
    text-align: center;
    box-shadow: 4px 4px 4px #888888;
    z-index: 2;
    transition: background-color 0.5s ease;
    background-color: $offWhite;
  }
  .globalIcons:hover {
    background-color: $lightPink;
  }

  .globalIcons:nth-child(3) {
    bottom: 170px;
  }
  .globalIcons:nth-child(4) {
    bottom: 110px;
  }
  .globalIcons:nth-child(5) {
    bottom: 50px;
  }
}
</style>
<script>
import HomeNavigationBar from "../components/HomeNavigationBar";
import CreateBoardPopup from "../views/CreateBoardPopup";
import NewPinPopup from "../views/NewPinPopup";
import EditBoardPopup from "../views/BoardsPopUps/EditBoardPopup";
<<<<<<< HEAD
=======
import CollaboratorsPopup from "../views/BoardsPopUps/CollaboratorsPopup"
>>>>>>> FE_Boards
import { mapState } from "vuex";
export default {
  name: "PhantomHome",
  components: {
    HomeNavigationBar,
    CreateBoardPopup,
    NewPinPopup,
    EditBoardPopup,
    CollaboratorsPopup
  },
  computed: {
    ...mapState({
      createBoard: state => state.popUpsState.createBoardPopup,
      newPin: state => state.popUpsState.newPinPopup,
<<<<<<< HEAD
      editBoard: state => state.popUpsState.editBoardPopup
=======
      editBoard: state =>state.popUpsState.editBoardPopup,
      collaborators: state =>state.popUpsState.CollaboratorsPopup
>>>>>>> FE_Boards
    })
  }
};
</script>
