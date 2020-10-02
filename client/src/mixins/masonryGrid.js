//import imagesLoaded from "imagesloaded";
import { default as getImage} from "./getImage"
export default {
  data:function(){
    return{
      allItems:[]
    }
  },
  mixins:[getImage],
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
     let img=item.querySelector(".card-img");
     let originalHeight=img.getBoundingClientRect().height;
    //  console.log(" originalHeight ",originalHeight)
    //  let newHeight= Math.round(originalHeight/ 50) * 50;
 //    console.log(" newHeight  ",newHeight)
  //   console.log("n",newHeight)
     img.style.height=  item.style.height +"px";
      var rowSpan = Math.ceil(
        (originalHeight +rowGap ) /
          (rowHeight + rowGap)
      );

      /* Set the spanning as calculated above (S) */
      item.style.gridRowEnd = "span " + rowSpan;
    
      img.style.height=  rowSpan*50+15*(rowSpan-1) +"px";
     // if(img.complete)
      //item.style.backgroundColor= "#f1f1f1";
    },
    waitForImages() {
      this.allItems = document.getElementsByClassName("masonryGridItem");
      for (let item of this.allItems) {
        item.querySelector(".card-img").addEventListener('load',this.resizeMasonryItem(item));
      }
    }
  }
};
