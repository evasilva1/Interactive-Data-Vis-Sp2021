//CONSTANTS AND GLOBALS
const width = window.innerWidth*.9;
console.log("width", width);
const height = window.innerHeight*.75;
console.log("height", height);
margin = {top: 40, right: 20, bottom: 40, left: 20}

//LOAD DATA
Promise.all([
d3.json('../project2_draft1/data/NTA.geojson'),
//d3.json('../project2_draft1/data/bk301.geojson')
]).then(([data, polyData]) => {
    console.log("geojson", data)
    console.log("data", polyData);

//SVG
let svg = d3.select("#mapbox")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style('background-color', 'lightgrey');

//PROJECTION
const projection = d3.geoMercator()
    .center([-73.56, 40.39])
    .fitSize([width, height], data);

const pathFunction = d3.geoPath(projection);

//PATH
svg.selectAll("path.c")
    .data(data.features)
    .join("path")
    .attr("class","c")
    .attr("stroke","black")
    .attr("fill", "#faf0e6")
    .attr("opacity", ".5")
    .attr("d",pathFunction);

//svg.selectAll("path.b")
   // .data(polyData.features)
   // .join("path")
   // .attr("class","b")
   // .attr("stroke","black")
   // .attr("fill", "#faf0e6")
   // .attr("opacity", ".5")
   // .attr("d",pathFunction);

//TITLE
svg.append("text")
    .attr("x",(width/2))
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("font-weight", "bold")
    .text("Risk and Distance")
})