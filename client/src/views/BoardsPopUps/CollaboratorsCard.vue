<template>
  <div class="collab">
    <div class="userInfo">
      <img :src="getImage(imageId, google, googleImage)" />
      <span>{{ collabName }}</span>
      <button
        class="editButton"
        v-if="board.type == 'creator' && !edit"
        @click="edit = !edit"
      >
        Edit
      </button>
      <button class="editButton" v-if="edit" @click="edit = !edit">
        Cancel
      </button>
    </div>
    <div v-if="edit">
      <div class="userCan">
        <div class="inputDiv">
          <label>
            can save pin...
          </label>
          <input
            type="range"
            min="0"
            max="1"
            v-model="collaborator.canSavePin"
            class="slider"
            id="myRange"
            :class="{ isPrivate: collaborator.canSavePin == '1' }"
          />
        </div>
      </div>
      <div class="inputDiv">
        <label>
          can create pin...
        </label>
        <input
          type="range"
          min="0"
          max="1"
          v-model="collaborator.canCreatePin"
          class="slider"
          id="myRange"
          :class="{ isPrivate: collaborator.canCreatePin == '1' }"
        />
      </div>
      <div class="inputDiv">
        <label>
          can edit title...
        </label>
        <input
          type="range"
          min="0"
          max="1"
          v-model="collaborator.canEditTitle"
          class="slider"
          id="myRange"
          :class="{ isPrivate: collaborator.canEditTitle == '1' }"
        />
      </div>
      <div class="inputDiv">
        <label>
          can personalise...
        </label>
        <input
          type="range"
          min="0"
          max="1"
          v-model="collaborator.canPersonalize"
          class="slider"
          id="myRange"
          :class="{ isPrivate: collaborator.canPersonalize == '1' }"
        />
      </div>
      <div class="inputDiv">
        <label>
          can edit description...
        </label>
        <input
          type="range"
          min="0"
          max="1"
          v-model="collaborator.canEditDescription"
          class="slider"
          id="myRange"
          :class="{ isPrivate: collaborator.canEditDescription == '1' }"
        />
      </div>
      <div class="inputDiv">
        <label>
          can add collaborators...
        </label>
        <input
          type="range"
          min="0"
          max="1"
          v-model="collaborator.canAddCollaborators"
          class="slider"
          id="myRange"
          :class="{ isPrivate: collaborator.canAddCollaborators == '1' }"
        />
      </div>

      <div class="controls buttonDiv">
        <button @click="editCollab">Save</button>
        <button class="leftButton" @click="deleteCollab">Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { default as getImage } from "../../mixins/getImage";

export default {
  name: "CollaboratorsCard",
  mixins: [getImage],
  props: {
    id: {
      type: String
    },
    imageId: {
      type: String
    },
    collabName: {
      type: String
    },
    savePin: {
      type: Boolean
    },
    createPin: {
      type: Boolean
    },
    editTitle: {
      type: Boolean
    },
    personalization: {
      type: Boolean
    },
    editDescription: {
      type: Boolean
    },
    addCollaborators: {
      type: Boolean
    },
    google: {
      type: Boolean
    },
    googleImage: {
      type: String
    }
  },
  data: function() {
    return {
      collaborator: {
        collaboratorId: this.id,
        canSavePin: this.savePin ? "1" : "0",
        canCreatePin: this.createPin ? "1" : "0",
        canEditTitle: this.editTitle ? "1" : "0",
        canPersonalize: this.personalization ? "1" : "0",
        canEditDescription: this.editDescription ? "1" : "0",
        canAddCollaborators: this.addCollaborators ? "1" : "0"
      },
      edit: false
    };
  },
  methods: {
    editCollab() {
      let collab = {
        collaboratorId: this.id,
        savePin: this.collaborator.canSavePin == "1" ? true : false,
        createPin: this.collaborator.canCreatePin == "1" ? true : false,
        editTitle: this.collaborator.canEditTitle == "1" ? true : false,
        personalization: this.collaborator.canPersonalize == "1" ? true : false,
        editDescription:
          this.collaborator.canEditDescription == "1" ? true : false,
        addCollaborators:
          this.collaborator.canAddCollaborators == "1" ? true : false
      };
      this.$store.dispatch("boards/editCollaborators", collab),
        (this.edit = false);
    },
    deleteCollab() {
      this.$store.dispatch("boards/deletaCollaborator", {
        data: { collaboratorId: this.id }
      });
    }
  },
  computed: {
    ...mapGetters({
      board: "boards/currentBoard"
    })
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";
@import "../../scss/GlobalPopup";

img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
input {
  float: right;
  margin: 15px 0;
}
label {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 20px;
}
.inputDiv {
  border: $lightPink solid 2px;
  border-radius: 16px;
  padding: 0 12px;
  transition: linear 0.5s;
  margin-top: 10px;
  position: relative;
}
.inputDiv:hover {
  border: $lightPinkHover solid 2px;
}
.collab {
  margin: 5px 0;
}

.userInfo {
  padding: 7px;
  margin: 4px 0;
  color: $darkBlue;
  transition: linear 0.2s;
  border-radius: 16px;
  cursor: pointer;
  height: 54px;
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 5px;
  }
}
.slider {
  position: absolute;
  margin: 7px 0;
  right: 5px;
  top: 7px;
}
@media screen and (max-width: 360px) {
  .userInfo {
    padding: 4px;
    margin: 4px 0;
    height: 54px;
    font-size: 12px;
    img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: 5px;
    }
  }
  @media screen and (max-width: 360px) {
    .UserInfo {
      padding: 2px;
      margin: 4px 0;
      font-size: 12px;
      img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-right: 2px;
      }
    }
    .editButton {
      padding: 4px;
      height: 30px;
    }
  }
  label {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 14px;
    margin: 10px 20px 10px 0;
  }
}
</style>
