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
let yAxis;
let xAxisGroup;
let yAxisGroup;

/* APPLICATION STATE */
let state = {
  data: [],
  selectedPermit: "New Building", // + YOUR FILTER SELECTION
};

/* LOAD DATA */
// + SET YOUR DATA PATH
d3.csv("../data/PermitIssuanceAgg.csv", (d) => {
  return{
    type: d.PermitType,
    total: +d.Total,
    year: new Date(d.Year,01,01) // (year, month,day)
  }
})
  .then(data => {
    console.log("loaded data:", data);
    state.data = data;
    init();
  });

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function init() {
  // + SCALES
    xScale = d3.scaleTime()
      .domain(d3.extent(state.data, d=> d.year))
      .range([margin.left,width - margin.right])

    yScale = d3.scaleLinear()
      .domain(d3.extent(state.data, d=> d.total))
      .range([height - margin.bottom, margin.top])
    
    colorScale = d3.scaleOrdinal()
      .domain(["New Building", "Demolition", "Alteration"])
      .range(["blue","orange","green"])

  // + AXES
    const xAxis = d3.axisBottom(xScale)
    yAxis = d3.axisLeft(yScale)

  // + CREATE SVG ELEMENT
    svg = d3.select ("#d3-container")
      .append("svg")
      .attr("width", width)
      .attr("height", height)

  // + CALL AXES
    const xAxisGroup = svg.append("g")
      .attr("class","xAxis")
      .attr("transform",`translate(${0},${height - margin.bottom})`)
      .call(xAxis)
    
    xAxisGroup.append("text")
        .attr("class", 'axis-title')
        .attr("x",width/2)
        .attr("y",40)
        .attr("text-anchor", "middle")
        .attr("font-size","12")
        .attr("fill","black")
        .text("Year")
    
    yAxisGroup = svg.append("g")
      .attr("class","yAxis")
      .attr("transform",`translate(${margin.left},${0})`)
      .call(yAxis)
    
    yAxisGroup.append("text")
      .attr("class", 'axis-title')
      .attr("x", -50)
      .attr("y", height/2)
      .attr("writing-mode","vertical-lr")
      .attr("text-anchor","middle")
      .attr("fill","black")
      .attr("font-size","12")
      .text("Total Number of Permits Issued")

  // + UI ELEMENT SETUP
    const dropdown = d3.select("#dropdown")

    dropdown.selectAll("options")
    .data(
      Array.from(new Set(state.data.map(d => d.type))))
    .join("option")
    .attr("value", d => d)
    .text(d => d)
    // add in dropdown options from the unique values in the data

  // + SET SELECT ELEMENT'S DEFAULT VALUE (optional)
    dropdown.on("change", event =>{
      console.log("dropdown changed to", event.target.value)
      state.selectedPermit = event.target.value
      console.log("new state is", state)
      draw();
    })


      draw(); // calls the draw function
}

/* DRAW FUNCTION */
// we call this everytime there is an update to the data/state
function draw() {
  console.log("in the drawing function")

  // + FILTER DATA BASED ON STATE
  const filteredData = state.data
  .filter(d => d.type === state.selectedPermit)

  // + UPDATE SCALE(S), if needed
  yScale.domain([0, d3.max(filteredData, d => d.total)])
  // + UPDATE AXIS/AXES, if needed
  yAxisGroup 
    .transition()
    .duration(1000)
    .call(yAxis.scale(yScale))

  // + DRAW CIRCLES/LABEL GROUPS, if you decide to
  const dots = svg
    .selectAll(".dot")
    .data(filteredData, d => d.year) // if i change it to total dot color changes
    .join(                           // if i change it to year transitions work
      enter => enter.append("g")
        .attr("class","dot")
        .attr("fill", d => colorScale(d.type) ) //d => colorScale(d.type)
        .attr("transform", d => `translate(${xScale(d.year)},${yScale(d.total)})`)
        ,
      update => update
        .call(update => update.transition()
        .duration(1000)
        .attr("transform",d => `translate(${xScale(d.year)},${yScale(d.total)})`)
    ),
    exit => exit.remove()
    );

  dots.selectAll("circle")  //add circle into group
      .data(d => [d])
      .join("circle")
      .attr("r", radius)

  //dots.selectAll("text")  //add text into group
      //.data(d => [d])
      //.join("text")
      //.atrr("text-anchor","end")
      //.text(d => `{formatDate(d.year)}`)

  // + DEFINE LINE GENERATOR FUNCTION
  const lineFunction = d3.line()
      .x(d => xScale(d.year))
      .y(d => yScale(d.total))

  // + DRAW LINE AND/OR AREA
  svg.selectAll("path.line")
    .data([filteredData])
    .join("path")
    .attr("class","line")
    .attr("d", d => lineFunction(d))
    .attr("fill","none")
    .attr("stroke", d => colorScale(d.type)) //"black", I could not get it to change colors
    .transition()
    .duration(1000)
    

  const areaFunction = d3.area() //showed filled in area underneath line
     .x(d => xScale(d.year))
     .y0(yScale(0))
     .y1(d => yScale(d.total))

  svg.selectAll(".area")
      .data([filteredData])
      .join("path")
      .attr("class",'area')
      .attr("fill",d => colorScale(d.type)) //I could not get the fill to change colors
      .attr("opacity", 0.2)
      .transition()
      .duration(1000)
      .attr("d", d => areaFunction(d))
}
