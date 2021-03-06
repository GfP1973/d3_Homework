// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

function applyToolTip(circlesGroup) {
    
    
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`State: ${d.abbr}<br>Poverty Level: ${d.poverty}<br>Health Care: ${d.healthcare}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      circlesGroup.on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    return circlesGroup;
    };

// Import Data
d3.csv("data.csv", function(err, healthData) {
  if (err) throw err;
  console.log(healthData);
    healthData.forEach(function(data) {
        data.abbr = +data.abbr;
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;    
        
      });



var xLinearScale = d3.scaleLinear()
    .domain([0, d3.max(healthData, d => d.healthcare)])
    .range([0, width]);

var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(healthData, d => d.poverty)])
    .range([height, 0]);

var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.healthcare))
        .attr("cy", d => yLinearScale(d.poverty))
        .attr("r", "15")
        .attr("fill", "blue")
        .attr("opacity", ".5");
  
      
    var circlesGroup = applyToolTip(circlesGroup);
         
      // Create axes labels
      chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Poverty Level");
  
      chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Health Coverage");
    });
  