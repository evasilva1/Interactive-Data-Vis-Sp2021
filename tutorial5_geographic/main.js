/**
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth * 0.8,
  height = window.innerHeight * 0.8,
  margin = { top: 30, bottom: 60, left: 60, right: 30 };

/** these variables allow us to access anything we manipulate in
 * init() but need access to in draw().
 * All these variables are empty before we assign something to them.*/
let svg;

/**
 * APPLICATION STATE
 * */
let state = {
  // + SET UP STATE
  geojson: null,
  otherData: null,
  hover: {
    stateName: null,
    tempChange: null,
    screenPosition: null,
    mapPosition: null,
    visible: false,
  }
};

/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
Promise.all([
  d3.json("../data/usState.json"),
  d3.csv("../data/usHeatExtremes.csv", d3.autoType),
]).then(([geojson, otherData]) => {
  // + SET STATE WITH DATA
  state.temp = otherData
  state.geojson = geojson
  console.log("state: ", state);
  init();
});

/**
 * INITIALIZING FUNCTION
 * this will be run *one time* when the data finishes loading in
 * */
function init() {
  // long-lat -> x-y
  const projection = d3.geoAlbersUsa()
    .fitSize([width, height], state.geojson)


  const pathFunction = d3.geoPath(projection)

  //const graduateCenterCoords = [{long: -73.98, lat:40.7486}]

  // create an svg element in our main `d3-container` element
  svg = d3
    .select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // + DRAW BASE MAP PATH
  const states = svg.selectAll("path")
    .data(state.geojson.features)
    .join("path")
    .attr("stroke","black")
    .attr("fill","#faf0e6")
    .attr("opacity",".5")
    .attr("d",pathFunction)

  // wanted to work on changing opacity of hover
  // + POINTS
  svg.selectAll("circle")
    .data(state.temp)
    .join("circle")
    .attr("r", 4)
    .attr("stroke", "#ccc")
    .attr("fill", d=> {
      if (d.Change > 0) return "#E60026";
      else if (d.Change === 0) return "#FFF880"
      else return "blue" //not sure why it's black on deployed
    })
    .attr("fill-opacity", 0.5)
    .attr("transform",d =>{
      //console.log(d)
      const [x,y] = projection([d.Long,d.Lat])
      return `translate(${x},${y})`
    })
    .on("mouseover", function(event, d){
      d3.select(this).transition()
        .duration("50")
        .attr("stroke","black")
        .attr("opacity", 1)
        .attr("r",16)
      const {clientX, clientY} = event
      const [long, lat] = projection.invert([clientX, clientY])

      state.hover = {
        stateName: d.State,
        tempChange: d.Change,
        screenPosition: [clientX, clientY],
        mapPosition: [d3.format(".2f")(long), d3.format(".2f")(lat)],
        visible: true
      }
      draw();
    })
    .on("mouseout", function(event,d){
      d3.select(this).transition()
        .duration("50")
        .attr("stroke","#ccc")
        .attr("r", 3)
      state.hover.visible = false
      draw();
    })

  // + ADD EVENT LISTENERS (if you want)

  draw(); // calls the draw function
}

/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/state
 * */
function draw() {
  d3.select("#d3-container")
    .selectAll('div.hover-content')
    .data([state.hover])
    .join("div")
    .attr("class", 'hover-content')
    .classed("visible", d => d.visible)
    .style("position", 'absolute')
    .style("transform", d => {
      // only move if we have a value for screenPosition
      if (d.screenPosition)
        return `translate(${d.screenPosition[0]}px, ${d.screenPosition[1]}px)`
    })
    .html(d => {
      return `
      <div> State: ${d.stateName} </div>
      <div> Coordinates: ${d.mapPosition} </div>
      <div> Temperature changes in 95 days: ${d3.format(".2f")(d.tempChange)} </div>
      `})
}
