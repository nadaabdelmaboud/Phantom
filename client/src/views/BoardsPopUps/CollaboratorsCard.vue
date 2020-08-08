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
        v-model=" collaborator.canSavePin"
        class="slider"
        id="myRange"
        :class="{ isPrivate:  collaborator.canSavePin=='1'}"
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
        v-model=" collaborator.canCreatePin"
        class="slider"
        id="myRange"
        :class="{ isPrivate:  collaborator.canCreatePin=='1'}"
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
        v-model=" collaborator.canEditTitle"
        class="slider"
        id="myRange"
        :class="{ isPrivate:  collaborator.canEditTitle=='1'}"
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
        v-model=" collaborator.canPersonalize"
        class="slider"
        id="myRange"
        :class="{ isPrivate:  collaborator.canPersonalize=='1'}"
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
        v-model=" collaborator.canEditDescription"
        class="slider"
        id="myRange"
        :class="{ isPrivate:  collaborator.canEditDescription=='1'}"
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
        v-model=" collaborator.canAddCollaborators"
        class="slider"
        id="myRange"
        :class="{ isPrivate:  collaborator.canAddCollaborators=='1'}"
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
         collaborator:{
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
          let collab ={
            savePin:this.collaborator.canSavePin=="1" ? true: false,
            createPin: this. collaborator.canCreatePin=="1" ? true: false,
            editTitle: this. collaborator.canEditTitle=="1" ? true: false,
            personalization: this. collaborator.canPersonalize =="1" ? true: false,
            editDescription: this. collaborator.canEditDescription=="1" ? true: false,
            addCollaborators: this. collaborator.canAddCollaborators =="1" ? true: false
          }
          this.$store.dispatch("boards/editCollaborators",collab)
      },
      deleteCollab(){
          this.$store.dispatch("boards/deletaCollaborator",{data:{collaboratorId:this.id}})
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
