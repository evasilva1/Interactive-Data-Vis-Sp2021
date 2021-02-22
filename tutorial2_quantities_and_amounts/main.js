d3.csv('../data/squirrelActivities.csv', d3.autoType)
.then(data => {
    console.log("data", data)

//constants
const width = window.innerWidth*.8;
const height =  window.innerHeight*.75;
const margins = { top: 15, bottom: 15, left: 60, right: 60}
const color = d3.scaleSequential()
    .domain([0, d3.max(data, d => d.count)])
    .interpolator(d3.interpolateBlues)

//1.15
    
//SCALES
//xscale - linear, count
const xScale = d3.scaleLinear()
    .domain([0, d3.max(data,d=> d.count)])
    .range([0, width-margins.right])
//yscale - categorical, activity
const yScale = d3.scaleBand()
.domain(data.map(d=> d.activity)) // get all the activity values
.range([height-margins.bottom,margins.top])
.paddingInner(.2)

//svg
const svg = d3.select("#barchart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

//bars
svg.selectAll("rect")
    .data(data)
    .join("rect")
    .attr("width",d=> xScale(d.count)-margins.right)
    .attr("height",yScale.bandwidth())
    .attr("fill", d=>color(d.count))
    .attr("x",margins.right)
    .attr("y",d=>yScale(d.activity))
 
//left text
svg.selectAll("text.activity")
    .data(data)
    .join("text")
    .attr("class",'activity')
    .attr("y",d=> yScale(d.activity)+(yScale.bandwidth()/2))
    .attr("x",0,d=> xScale(d.count))
    .attr("dx",".1em")
    .attr("text-anchor",'left')
    .text(d=> d.activity)

//right text
svg.selectAll("text.count")
    .data(data)
    .join("text")
    .attr("class",'count')
    .attr("y",d => yScale(d.activity)+(yScale.bandwidth()/2))
    .attr("x",d=> xScale(d.count))
    .attr("dx","1.2em")
    .attr("text-anchor",'middle')
    .text(d => d3.format(",")(d.count))
})
