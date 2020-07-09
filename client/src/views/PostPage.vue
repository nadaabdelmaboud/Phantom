<template>
  <div class="postpage">
    <div class="row">
      <post-page-card />
    </div>
    <div class="row">
      <span>More like this</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.row {
  display: flex;
  justify-content: center;
  align-items: center;
}
span {
  font-size: 21px;
  font-weight: 700;
  color: black;
  margin: 30px;
}
</style>

<script>
import PostPageCard from "../components/PostPageCard";
export default {
  name: "postpage",
  components: {
    PostPageCard
  }
};
</script>
