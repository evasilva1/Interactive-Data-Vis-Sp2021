// LOAD DATA
d3.csv('../project_draft1/data/OLT_HPD_CT.csv', d3.autoType)
.then(data => {
    console.log("data", data)

// CONSTANTS ? ARE THEY STILL INCLUDED
const width = d3.select('#barchart').node().getBoundingClientRect().width;
console.log("width",width);
const height = d3.select('#barchart').node().getBoundingClientRect().height;
console.log("height",height);
margin = {top: 40, right:30, bottom:50, left:30}

//const nest = d3.rollup(data, v => v.length, d => d.Boro)
//console.log("nest",nest);

// SCALES
// xscale - categorical, borough name
const xScale = d3.scaleBand()     /* Need to figure out how to make it read 4 lables*/
    .domain(data.map(d => d.BOROUGH))
    .range([margin.left, width- margin.right])
    .paddingInner(.2)

// yscale - linear, count
const yScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.OLT), d3.max(data, d => d.OLT)])
    .range([height - margin.bottom, margin.top])

// SVG
const svg = d3.select("#barchart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style('background-color', 'lightgrey');

// BARS
svg.selectAll("rect")
    .data(data)
    .join("rect")
    .attr("width", xScale.bandwidth())
    .attr("height", d => height - margin.bottom - yScale(d.OLT))
    .attr("x", d=> xScale(d.BOROUGH))
    .attr("y", d=> yScale(d.OLT))
    .attr("fill","blue")
    //.attr('x', (d,i) => i*(width/data.length))
    //.attr('y', (d) => height-d*(height/100))
    //.attr('width', 0.8*(width/data.length))


 // + AXES
 const xAxis = d3.axisBottom(xScale)
 const yAxis = d3.axisLeft(yScale)

// CALL AXES
const xAxisGroup = svg.append("g")
    .attr("class", 'xAxis')
    .attr("transform", `translate(${0}, ${height - margin.bottom})`) // move to the bottom
    .call(xAxis)

const yAxisGroup = svg.append("g")
.attr("class", 'yAxis')
.attr("transform", `translate(${margin.left}, ${0})`) // align with left margin
.call(yAxis)

// add labels - xAxis
xAxisGroup.append("text")
.attr("class", 'axis-title')
.attr("x", width / 2)
.attr("y", 40)
.attr("text-anchor", "middle")
.text("Borough")

// add labels - yAxis
yAxisGroup.append("text")
.attr("class", 'axis-title')
.attr("x", -40)
.attr("y", height / 2)
.attr("writing-mode", "vertical-lr")
.attr("text-anchor", "middle")
.text("Environmental Score 2020")

// Titles
svg.append("text")
    .attr("x", (width/2))
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text("Old Law Tenements by Borough")



})