/**
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.7,
  margin = { top: 30, bottom: 60, left: 60, right: 30 };

let svg;
let tooltip;

/**
 * APPLICATION STATE
 * */
let state = {
  // + INITIALIZE STATE
  data:null,
  hover:null
};

/**
 * LOAD DATA
 * */
d3.json("../data/flare.json", d3.autotype).then(data => {
  state.data = data;
  init();
});

/**
 * INITIALIZING FUNCTION
 * this will be run *one time* when the data finishes loading in
 * */
function init() {
  console.log(state.data)

  const colorScale = d3.scaleOrdinal(d3.schemePaired)

  const container = d3.select("#d3-container").style("position", "relative");

  svg = container
    .append("svg")
    .attr("width", width)
    .attr("height", height);


  // + INITIALIZE TOOLTIP IN YOUR CONTAINER ELEMENT
  tooltip = container
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("top", 0)
    .style("left", 0)


  // + CREATE YOUR ROOT HIERARCHY NODE
  const root = d3.hierarchy(state.data)
    .sum(d => d.value) //sets the val of each level
    .sort((a,b) => b.value - a.value);

  
  // + CREATE YOUR LAYOUT GENERATOR
  const pack = d3.pack()
    .size([width, height])
    .padding(1)
    //.paddingInner(1)
    //.round(true)
  
  // + CALL YOUR LAYOUT FUNCTION ON YOUR ROOT DATA
  pack(root)
  const node = root.descendants()

  // + CREATE YOUR GRAPHICAL ELEMENTS
  const packGroup = svg.selectAll("g")
      .data(node)
      .join("g")
      //.attr("class", "leaf")
      .attr("transform", d => `translate(${d.x},${d.y})`)
  
  // + DRAW LEAVES RECT
  packGroup.append("circle")
      //.attr("width", d => d.x1 - d.x0)
      //.attr("height", d => d.y1 - d.y0)
      .attr("fill", d => colorScale(d.height))//{
        // grab level
        //const level1Ancestor = d.ancestors().find(d => d.depth === 1 );
        //return colorScale(level1Ancestor.data.name)
      //})
      .attr("stroke","black")
      .attr("height", d => d.x)
      .attr("width", d => d.y)
      .attr("r", d => d.r)
  
  //packGroup.append("text")
      //.text(d => d.data.name)


  // + ADD MOUSEOVER
  packGroup 
      .on("mouseenter", (event, d) => {
        state.hover = {
          position: [d.x, d.y],
          name: d.data.name,
          value: d.data.value
        }
        draw()
      })
      .on("mouseleave", () => {
        state.hover = null
        draw();
      })

  draw(); // calls the draw function
}

/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/state
 * */
function draw() {
  // + UPDATE TOOLTIP //working on getting the hover to work
  if (state.hover) {
    tooltip
    .html(
      `
      <div>Name: ${state.hover.name}</div>
      <div>Value: ${state.hover.value}</div>
      `
    )
    .style("font-size","12px")
    .transition()
    .duration(200)
    .style("transform", `translate(${state.hover.position[0]}px,${state.hover.position[1]}px)`)
  }
  tooltip.classed("visible", state.hover)
}
