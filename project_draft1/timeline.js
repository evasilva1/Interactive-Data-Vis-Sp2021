// CONSTANTS ? ARE THEY STILL INCLUDED
const width3 = d3.select('#timeline').node().getBoundingClientRect().width;
//const width = resizeTo(d3.select("#timeline"));
console.log("width3",width3);
const height3 = d3.select('#timeline').node().getBoundingClientRect().height;
console.log("height3",height3);
margin = {top: 40, right:20, bottom:60, left:60}


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
            .range([margin.left, width3 - margin.right])
        console.log("x", xScale(2020));

        const yScale = d3.scaleLinear()
            .domain([d3.min(data, d => Math.min(d.totalt, d.totnb, d.totdm)),  d3.max(data, d => Math.max(d.totalt, d.totnb, d.totdm))]) // d3 max of the col, d3 max of all same for min
            .range([height3 - margin.bottom, margin.top])
        console.log("y", yScale(25000));

        a = d3.max(data, d => Math.max(d.totalt, d.totnb, d.totdm));
        console.log("max", a);

        //colorScale = d3.scaleOrdinal(d3.schemeCategory10);

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
            .attr("width", width3)
            .attr("height", height3)
            .style('background-color', 'lightgrey');
            //.append("transform","translate(" + 20 +"," + 20 + ")");
// LINES
        svg.selectAll("path.n")
            .data([data])
            .join("path")
            .attr("class","line n")
            .style("stroke","red")
            .attr("fill","none")
            .attr("d", nLine);

        svg.selectAll("path.d")
            .data([data])
            .join("path")
            .attr("class","line d")
            .style("stroke","blue")
            .attr("fill","none")
            .attr("d", dLine);

        svg.selectAll("path.a")
            .data([data])
            .join("path")
            .attr("class","line a")
            .style("stroke","green")
            .attr("fill","none")
            .attr("d", aLine);
           
// CALL AXES
        const xAxisGroup = svg.append("g")
            .attr("class", 'xAxis') 
            .attr("transform", `translate(${0}, ${height3 - margin.bottom})`) // move to the bottom
            .call(xAxis)
           
        const yAxisGroup = svg.append("g")
           .attr("class", 'yAxis')
           .attr("transform", `translate(${margin.left}, ${0})`) // align with left margin
           .call(yAxis)
           
        // add labels - xAxis
        xAxisGroup.append("text")
           .attr("class", 'axis-title')
           .attr("x", (width3/2))
           .attr("y", 40)
           .attr("text-anchor", "end")
           //.style("font-size", "14px")
           .style("fill", "black")
           .text("Year")
           
        // add labels - yAxis
        yAxisGroup.append("text")
           .attr("class", 'axis-title')
           .attr("x", -50)
           .attr("y", height3 / 2)
           .attr("writing-mode", "vertical-lr")
           .attr("text-anchor", "middle")
           .style("fill", "black")
           .text("Permits Issued")
                     
        // Title
        svg.append("text")
            .attr("x", (width3/2))
            .attr("y", 20)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .text("Permits Issued")
            
    });