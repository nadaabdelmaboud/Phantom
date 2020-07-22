<template>
  <div class="board">
    <div style="height:250px">
     <div class="image"></div>
     <div class="image">
     <div class="imagesmall"></div>
     <div class="imagesmall"></div>
     </div>
     </div>
     <div>
       <p>{{boardName}}</p>
       <p>{{pinsImages.length}} pins</p>
     </div>
  </div>
</template>

<script>
export default {
  name: "Board",
  props:{
    boardName:{
      type:String
    },
    boardId:{
      type:String
    },
    pinsImages:{
      type:Array
    },
    isPrivate:{
      type: Boolean
    },
    createdAt:{
      type:Date
    }
  }
};
</script>

<style lang="scss" scoped>
.board{
  margin-top: 20px;
  cursor: pointer;
}
.image{
  background-color: white;
  display: inline-block;
  margin: 2%;
  height: 96%;
  width: 66%;
  border-radius: 16px;
}
.image:nth-child(2){
   width: 26%;
   background-color: transparent;
  .imagesmall{
    background-color: white;
    height: 47%;
    border-radius: 16px;
  }
  .imagesmall:nth-child(1){
    margin-bottom: 6%;
  }
}
p{
  margin-bottom: 10px;
  margin-left: 2%;
}

</style>