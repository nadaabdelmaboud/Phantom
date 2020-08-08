<template>
  <div class="collab">
  <div class="userInfo">
      <img :src="getImage(imageId)"/>
      <span>{{collabName}}</span>
      <button class="editButton" v-if="!edit" @click="edit =!edit">Edit</button>
      <button class="editButton" v-if="edit" @click="edit =!edit">Cancel</button>
  </div>
  <div  v-if="edit">
  <div class="userCan">
      <div class="inputDiv">
      <label>
       can save pin...
      </label>
      <input
        type="range"
        min="0"
        max="1"
        v-model="callaborator.canSavePin"
        class="slider"
        id="myRange"
        :class="{ isPrivate: callaborator.canSavePin=='1'}"
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
        v-model="callaborator.canCreatePin"
        class="slider"
        id="myRange"
        :class="{ isPrivate: callaborator.canCreatePin=='1'}"
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
        v-model="callaborator.canEditTitle"
        class="slider"
        id="myRange"
        :class="{ isPrivate: callaborator.canEditTitle=='1'}"
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
        v-model="callaborator.canPersonalize"
        class="slider"
        id="myRange"
        :class="{ isPrivate: callaborator.canPersonalize=='1'}"
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
        v-model="callaborator.canEditDescription"
        class="slider"
        id="myRange"
        :class="{ isPrivate: callaborator.canEditDescription=='1'}"
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
        v-model="callaborator.canAddCollaborators"
        class="slider"
        id="myRange"
        :class="{ isPrivate: callaborator.canAddCollaborators=='1'}"
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
import { default as getImage } from "../../mixins/getImage";

export default {
  name: "CollaboratorsCard",
  mixins: [getImage],
  props:{
     id:{
        type:String
     },
     imageId:{
         type:String
     },
     collabName:{
         type:String
     },
     savePin:{
         type:Boolean
     },
    createPin:{
         type:Boolean
    },
    editTitle:{
         type:Boolean
    },
    personalization:{
         type:Boolean
    },
    editDescription:{
         type:Boolean
    },
    addCollaborators:{
         type:Boolean
    } 
  },
  data: function() {
    return {
        callaborator:{
            canSavePin:this.savePin ?"1":"0",
            canCreatePin:this.createPin ?"1":"0",
            canEditTitle:this.editTitle?"1":"0",
            canPersonalize:this.personalization ?"1":"0",
            canEditDescription:this.editDescription ?"1":"0",
            canAddCollaborators:this.addCollaborators ?"1":"0"
        },
        edit: false
    };
  },
  methods: {
      editCollab(){
          this.$store.dispatch("editCollaborators",this.callaborator)
      },
      deleteCollab(){
          this.$store.dispatch("boards/deletaCollaborator",{collaboratorId:this.id})
      }
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";
@import "../../scss/GlobalPopup";

img{
    width: 50px;
    height: 50px;
    border-radius: 50%;
}
input{
    float: right;
    margin: 15px 0;
}
label{
    font-family: Arial, Helvetica, sans-serif;
    font-size: 20px;
}
.inputDiv{
    border: $lightPink solid 2px;
    border-radius: 16px;
    padding: 0 12px;
    transition: linear 0.5s;
    margin-top: 10px;
}
.inputDiv:hover{
    border: $lightPinkHover solid 2px;
    border-radius: 16px;
    padding: 0 12px;
}
.collab{
    margin: 5px 0;
}
</style>
