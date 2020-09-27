<template>
  <div class="PhantomPopup">
    <div class="content">
      <div class="alertTitle">
        <h1>
          <span>O</span>
          <span>O</span>
          <span>P</span>
          <span>S</span>
          <span>!</span>
          You have to Login first
        </h1>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../scss/Colors";
@import "../scss/Mixins";
.PhantomPopup {
  @include popUpBackground;
}
.content {
  @include popUpContent;
  margin-top: 50px;
  padding-left: 1px;
  padding-right: 1px;
  width: 45%;
}
.alertTitle {
  display: flex;
  justify-content: center;
  text-align: center;
  padding: 17px;
}
h1 {
  margin: 0;
  padding: 0;
  font-weight: 700;
  font-size: 25px;
  color: $darkBlue;
  span {
    font-weight: 900;
    position: relative;
    display: inline-block;
    animation: animate 1.5s linear infinite;
  }
}
h1 span:nth-child(1) {
  animation-delay: 0s;
}
h1 span:nth-child(2) {
  animation-delay: 0.2s;
}
h1 span:nth-child(3) {
  animation-delay: 0.4s;
}
h1 span:nth-child(4) {
  animation-delay: 0.6s;
}
h1 span:nth-child(5) {
  animation-delay: 0.8s;
}
@keyframes animate {
  0% {
    transform: translateY(0px);
  }
  10% {
    transform: translateY(-30px);
  }
  15% {
    transform: translateY(0px);
  }
  25% {
    transform: translateY(-20px);
  }
  30% {
    transform: translateY(0px);
  }
  40% {
    transform: translateY(-10px);
  }
  45% {
    transform: translateY(0px);
  }
  100% {
    transform: translateY(0px);
  }
}
@media screen and (max-width: 1320px) {
  .content {
    width: 55%;
  }
}
@media screen and (max-width: 1290px) {
  .content {
    width: 75%;
  }
}
@media screen and (max-width: 800px) {
  .content {
    width: 85%;
  }
}
@media screen and (max-width: 690px) {
  .content {
    width: 96%;
  }
}
@media screen and (max-width: 411px) {
  .content {
    width: 93%;
  }
}
</style>

<script>
export default {
  name: "PhantomPopup"
};
</script>
