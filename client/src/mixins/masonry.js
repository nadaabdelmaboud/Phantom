import Masonry from "masonry-layout";

var elem = document.querySelector(".grid");
var msnry = new Masonry(elem, {
  // options
  itemSelector: ".grid-item",
  columnWidth: 200
});

msnry.init();
