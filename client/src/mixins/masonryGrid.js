//import imagesLoaded from "imagesloaded";
export default {
  data:function(){
    return{
      allItems:[]
    }
  },
  methods: {
    resizeMasonryItem(item) {
      //var allItems = document.getElementsByClassName("masonryGridItem");
      /* Get the grid object, its row-gap, and the size of its implicit rows */
      var grid = document.getElementsByClassName("masonryGrid")[0],
        rowGap = parseInt(
          window.getComputedStyle(grid).getPropertyValue("grid-row-gap")
        ),
        rowHeight = parseInt(
          window.getComputedStyle(grid).getPropertyValue("grid-auto-rows")
        );
      /*
      
             * Spanning for any brick = S
             * Grid's row-gap = G
             * Size of grid's implicitly create row-track = R
             * Height of item content = H
             * Net height of the item = H1 = H + G
             * Net height of the implicit row-track = T = G + R
             * S = H1 / T
             */
     // console.log("this item",item)
      var rowSpan = Math.ceil(
        (item.querySelector(".card-img").getBoundingClientRect().height +
          rowGap) /
          (rowHeight + rowGap)
      );

      /* Set the spanning as calculated above (S) */
      item.style.gridRowEnd = "span " + rowSpan;
      //   const app =document.getElementById("app")
      //    if(rowHeight+rowGap >= app.style.height)
      //    app.style.height =document.body.offsetHeight+500+"px";
    },
    handleLoaded(i){
      //  console.log("img is loaded",this.allItems[i])
        this.resizeMasonryItem(this.allItems[i]);
    },
    waitForImages() {
      this.allItems = document.getElementsByClassName("masonryGridItem");
      for (var i = 0; i < this.allItems.length; i++) {
        // console.log("item",allItems[i])
        this.allItems[i].querySelector(".card-img").addEventListener('load',this.handleLoaded(i));
      }
    }
  }
};
