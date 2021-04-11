// LOAD DATA
d3.csv('../project_draft1/data/OLT_HPD.csv', d3.autoType)
.then(data => {
    console.log("data", data)
})

// CONSTANTS ? ARE THEY STILL INCLUDED
group = d3.rollup(data, v => v.length, d => d.Boro)
console.log("group", group)


// SCALES
// xscale - categorical, borough name
const xScale = d3.scaleBand()
    .domain(data.map(d => d.Boro))
    .range([0, width])
    .paddingInner(.2)

// yscle - linear, count
const yScale = d3.scaleLinear()
    .domain[0, d3.max(data, d => d.count)]