//CONSTANTS AND GLOBALS
const width1 = d3.select('#map').node().getBoundingClientRect().width;
console.log("width1",width1);
const height1 = d3.select('#map').node().getBoundingClientRect().height;
console.log("height1",height1);
margin = {top: 40, right:20, bottom:60, left:60}

//LOAD DATA
d3.json('../project_draft1/data/NTA.geojson')
.then(data=> {
  console.log("data", data)

//SVG
let svg = d3.select("#map")
  .append("svg")
  .attr("width", width1)
  .attr("height", height1)
  .style('background-color', 'lightgrey');


//PROJECTION
const projection = d3.geoMercator()
  .center([-73.94, 40.70])
  .fitSize([width1, height1], data);

const pathFunction = d3.geoPath(projection);

//PATH
svg.selectAll("path")
  .data(data.features)
  .join("path")
  .attr("stroke","black")
  .attr("fill","#faf0e6")
  .attr("opacity",".5")
  .attr("d",pathFunction);

//TITLE
svg.append("text")
  .attr("x", (width1/2))
  .attr("y", 20)
  .attr("text-anchor","middle")
  .attr("font-size", "16px")
  .attr("font-weight", "bold")
  .text("Incidents")

})

