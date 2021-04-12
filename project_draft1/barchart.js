// LOAD DATA
d3.csv('../project_draft1/data/OLT_HPD.csv', d3.autoType)
.then(data => {
    console.log("data", data)

// CONSTANTS ? ARE THEY STILL INCLUDED
const width = d3.select('#barchart').node().getBoundingClientRect().width;
console.log("width",width);
const height = d3.select('#barchart').node().getBoundingClientRect().height;
console.log("height",height);

const nest = d3.rollup(data, v => v.length, d => d.Boro)
console.log("nest",nest);

// SCALES
// xscale - categorical, borough name
const xScale = d3.scaleBand()     /* Need to figure out how to make it read 4 lables*/
    .domain(data.map(d => d.Boro))
    .range([0, width])
    .paddingInner(.2)

// yscale - linear, count
const yScale = d3.scaleLinear()
    .domain([0, d3.max(nest, d => d.value)])
    .range([height, 0])

// SVG
const svg = d3.select("#barchart")
    .append("svg")
    .attr("width", 250)
    .attr("height", 250)

// BARS
svg.selectAll("rect")
    .data(data)
    .join("rect")
    .attr("width", xScale.bandwidth())
    .attr("height", d => yScale(d.value))
    .attr("x", d=> xScale(d.Boro))
    .attr("y", d=> yScale(d.value))
})