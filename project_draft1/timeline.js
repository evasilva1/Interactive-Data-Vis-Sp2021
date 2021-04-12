// CONSTANTS ? ARE THEY STILL INCLUDED
const width = d3.select('#timeline').node().getBoundingClientRect().width;
console.log("width",width);
const height = d3.select('#timeline').node().getBoundingClientRect().height;
console.log("height",height);
radius = 4;


// LOAD DATA
d3.csv('../project_draft1/data/DummyPermitRev.csv', (d) => {
    return{
        totalt: +d.A1,
        totdm: +d.DM,
        totnb: +d.NB,
        year: new Date(d.Year,01,01) // (year, month, day)
    }
})
    .then(data => {
        console.log("loaded data:", data);
    
// SCALES
        const xScale = d3.scaleTime()
            .domain(d3.extent(data, d => d.year))
            .range([0,width])
        
        const yScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d.total))
            .range([height, 0])  

        colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// AXIS
        const xAxis = d3.axisBottom(xScale)
        const yAxis = d3.axisLeft(yScale)

// LINES
        nLine = d3.line() // first line, nb
            .x(d => xScale(d.year))
            .y(d => yScale(d.totnb))
        
        dLine = d3.line() // second line, dm
            .x(d => xScale(d.year))
            .y(d => yScale(d.totdm))

        aLine = d3.line() // third line, alt
            .x(d => xScale(d.year))
            .y(d => yScale(d.totalt))

// SVG
        svg = d3.select('#timeline')
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .style('background-color', 'lightgrey')
            .append("transform","translate(" + 20 +"," + 20 + ")");
// LINES
        svg.append("path")
            .data(data)
            .attr("class","line")
            .style("stroke","red")
            .attr("d", nLine);

        svg.append("path")
            .data(data)
            .attr("class","line")
            .style("stroke","blue")
            .attr("d", dLine);

        svg.append("path")
            .data(data)
            .attr("class","line")
            .style("stroke","green")
            .attr("d", aLine);
        

        

    });