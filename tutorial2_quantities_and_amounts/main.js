d3.csv('../data/squirrelActivities.csv', d3.autoType)
.then(data => {
    console.log("data", data)

//constants
const width = window.innerWidth*.8;
const height =  window.innerHeight/3;
const margins = { top: 10, bottom: 25, left: 10, right: 10}
//1.15
    
//SCALES
//xscale - categorical, activity
const xScale = d3.scaleBand()
    .domain(data.map(d=> d.activity)) // get all the activity values
    .range([margins.left, width-margins.right])
    .paddingInner(.2)
//yscale - linear, count
const yScale = d3.scaleLinear()
    .domain([0, d3.max(data,d=> d.count)])
    .range([height-margins.bottom, margins.top])
//color
let colors = d3.scaleSequential()
    .domain([0,d3.max(data,d=> d.count)])
    .range(d3.schemeBlues)
    .interpolator(d3.interpolatorBlues)
//svg
const svg = d3.select("#barchart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

//bars
svg.selectAll("rect")
    .data(data)
    .join("rect")
    .attr("width",xScale.bandwidth())
    .attr("height",d=>height-margins.bottom-yScale(d.count))
    .attr("fill", "orange")
    .attr("x",d=>xScale(d.activity))
    .attr("y",d=>yScale(d.count))

//bottom text
svg.selectAll("text.activity")
    .data(data)
    .join("text")
    .attr("class",'activity')
    .attr("x",d=> xScale(d.activity)+(xScale.bandwidth()/2))
    .attr("y",height-margins.bottom)
    .attr("dy","1em")
    .attr("text-anchor", 'middle')
    .text(d=> d.activity)

//top text
svg.selectAll("text.count")
    .data(data)
    .join("text")
    .attr("class",'count')
    .attr("x", d => xScale(d.activity)+(xScale.bandwidth()/2))
    .attr("y",d=> yScale(d.count))
    .attr("dy","1em")
    .attr("text-anchor",'middle')
    .text(d=> d3.format(",")(d.count))
})
