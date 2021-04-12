// CONSTANTS ? ARE THEY STILL INCLUDED
const width = d3.select('#timeline').node().getBoundingClientRect().width;
console.log("width",width);
const height = d3.select('#timeline').node().getBoundingClientRect().height;
console.log("height",height);
radius = 4;

// VARIABLES
let svg;
let xScale;
let yScale;
let yAxis;
let xAxisGroup;
let yAxisGroup;

// APPLICATION STATE
let state = {
    data: [],
    selectedPermit: "New Building",
};

// LOAD DATA
d3.csv('../project_draft1/data/DummyPermit.csv', (d) => {
    return{
        type: d.PermitType,
        total: +d.Total,
        year: new Date(d.Year,01,01) // (year, month, day)
    }
})
    .then(data => {
        console.log("loaded data:", data);
        state.data = data;
        init();
    });

// INIT FUNCTIONS
function init(){
    // SCALES
        xScale = d3.scaleTime()
            .domain(d3.extent(state.data, d => d.year))
            .range([0,width])
        
        yScale = d3.scaleLinear()
            .domain(d3.extent(state.data, d => d.total))
            .range([height, 0])
        
        colorScale = d3.scaleOrdinal(d3.schemePaired)
    
    // AXES
        const xAxis = d3.axisBottom(xScale)
        yAxist = d3.axisLeft(yScale)

    // SVG
        svg = d3.select('#timeline')
            .append("svg")
            .attr("width", width)
            .attr("height", height)
    
    // CALL AXES
        const xAxisGroup = svg.append("g")
            .attr("class","xAxis")
            .attr("transform",`translate(${0},${height})`)
            .call(xAxis)

        xAxisGroup.append("text")
            .attr("class", 'axis-title')
            .attr("x", width/2)
            .attr("y",40)
            .attr("text-anchor", "middle")
            .attr("font-size", "12")
            .attr("fill", "black")
            .text("Year")
        
        yAxisGroup = svg.append("g")
            .attr("class", "yAxis")
            .attr("transform", `translate(${0},${0})`)
            .call(yAxis)

        yAxisGroup.append("text")
            .attr("class", 'axis-title')
            .attr("x", -50)
            .attr("y", height/2)
            .attr("writing-mode", "vertical-lr")
            .attr("text-anchor", "middle")
            .attr("fill", "black")
            .attr("font-size", "12")
            .text("Total Number of Permits Issued")

    // UI ELEMENT SETUP
        const dropdown = d3.select("#dropdown")

        dropdown.selectAll("options")
        .data(
            Array.from(new Set(state.data.map(d => d.type)))
        )
        .join("option")
        .attr("value", d => d)
        .text(d => d)

    // SET SELECT ELEMENT's DEFAULT VALUE
            dropdown.on("change", event => {
                console.log("dropdown changed to", event.target.value)
                state.selectPermit = event.target.value
                console.log("new state is", state)
                draw();
            })
            draw();

    // DRAW FUNCTION
        function draw() {
            console.log("in the drawing function")

        // FILTER DATA
        const filteredData = state.data
        .filter(d => d.type === state.selectedPermit)

        // UPDATE SCALE(S), if needed
        yScale.domain([0, d3.max(filteredData, d => d.total)])

        // UPDATE AXIS/AXES, if needed
        yAxisGroup
            .transition()
            .duration(1000)
            .call(yAxis.scale(yScale))

        // DRAW CIRCLES 
        const dots = svg
            .selectAll(".dot")
            .data(filteredDate, d => d.year)
            .join(
                enter => enter.append("g")
                    .attr("class", )
            )
        }
}
   
