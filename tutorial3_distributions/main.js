/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.8,
  height = window.innerHeight * 0.8,
  margin = { top: 30, bottom: 60, left: 60, right: 30 },
  radius = 4;

// these variables allow us to access anything we manipulate in init() but need access to in draw().
// All these variables are empty before we assign something to them.
let svg;
let xScale;
let yScale;
let colorScale;

/* APPLICATION STATE */
let state = {
  data: [],
  selectedBoro: "All" // + YOUR FILTER SELECTION
};

/* LOAD DATA */
d3.csv("../data/Energy_Efficiency_Projects.csv", d3.autoType).then(raw_data => {
  // + SET YOUR DATA PATH
  console.log("data", raw_data);
  // save our data to application state
  state.data = raw_data;
  init();
});

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function init() {
  // + SCALES
    xScale = d3.scaleLinear()
      .domain(d3.extent(state.data, d=> d.NumberOfDays))
      .range([margin.left,width - margin.right])

    yScale = d3.scaleLinear()
      .domain(d3.extent(state.data, d=> d.CO2e_Calculated_MT))
      .range([height - margin.bottom, margin.top])

    colorScale = d3.scaleOrdinal()
      .domain(["Bronx","Brooklyn","Manhhattan","Queens","Staten Island"])
      .range(["green","red","blue","pink","purple"])
  // + AXES
    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)

// + CREATE SVG ELEMENT
  svg = d3.select("#d3-container")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

// + CALL AXES
 const xAxisGroup = svg.append("g")
  .attr("class","xAxis")
  .attr("transform",`translate(${0},${height - margin.bottom})`)
  .call(xAxis)

 xAxisGroup.append("text")
  .attr("class",'axis-title')
  .attr("x",width/2)
  .attr("y",40)
  .attr("text-anchor","middle")
  .attr("font-size","12")
  .attr("fill","black")
  .text("Project Duration in Days")
  
 const yAxisGroup = svg.append("g")
  .attr("class","yAxis")
  .attr("transform",`translate(${margin.left},${0})`)
  .call(yAxis)

 yAxisGroup.append("text")
  .attr("class",'axis-title')
  .attr("x",-40)
  .attr("y",height/2)
  .attr("writing-mode","vertical-lr")
  .attr("text-anchor","middle")
  .attr("fill","black")
  .attr("font-size","12")
  .text("CO2 Reduction in Metric Tons")

// + SETUP UI ELEMENTS
 const dropdown = d3.select("#dropdown")

 dropdown.selectAll("options")
  .data([
    { key: "All", label: "All"},
    { key: "BRONX", label: "Bronx"},
    { key: "BROOKLYN", label: "Brooklyn"},
    { key: "MANHATTAN", label: "Manhattan"},
    { key: "QUEENS", label: "Queens"},
    { key: "STATEN IS", label: "Staten Island"}])
  .join("option")
  .attr("value", d => d.key)
  .text(d => d.label)

// + SET UP EVENT LISTENER
dropdown.on("change", event=>{
  console.log("dropdown change", event.target.value)
  state.selectedBoro = event.target.value
  console.log("new state", state)
  draw();
})
  draw(); // calls the draw function
}

/* DRAW FUNCTION */
// we call this everytime there is an update to the data/state
function draw() {
  console.log("in the drawing function")

  const filteredData = state.data
    .filter(d => {
      if (state.selectedBoro === "All") return true
      else return d.Borough === state.selectedBoro
    })
  
  svg.selectAll("circle")
    .data(filteredData, d => d.ID)
    .join(
      enter => enter.append("circle")
        .attr("r",radius*1.5)
        .attr("fill", d => colorScale(d.Borough))
        .style("stroke-opacity",.50)
        .style("stroke","#ffffff")
        .attr("cy",margin.top)
        .attr("cx", d=> xScale(d.NumberOfDays))
        .call(enter => enter
          .transition()
          .ease(d3.easeCircleIn)
          .duration(1000)
          .attr("cy", d => yScale(d.CO2e_Calculated_MT))
          ),

      update => update
        .call(sel => sel
          .transition()
          .duration(250)
          .attr("r",radius*2.5)
          .transition()
          .duration(500)
          .attr("r",radius)
          ),

      exit => exit
        .attr("cy", d => yScale(d.CO2e_Calculated_MT))
        .attr("cx", d => xScale(d.NumberOfDays))
          .call(exit => exit
            .transition()
            .style("opacity", .25)
            .duration(1000)
            .attr("cx", margin.left)
            .attr("cy", height-margin.bottom)
            .remove()
            )
        );

}
