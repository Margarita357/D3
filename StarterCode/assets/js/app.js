
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
var svg = d3.select('.scatter')
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight);

var chartGroup = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv('statedata.csv').then(function(data) {

  // Step 1: Parse Data/Cast as numbers
  // ==============================
  data.forEach(function(d) {
    d.poverty = +d.poverty;
    d.healthcare = +d.healthcare;
  });

//   Step 2: Create scale functions
//   ==============================
  var xLinearScale = d3.scaleLinear()
    .domain([7, d3.max(data, d => d.poverty) + 1])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.healthcare) + 2])
    .range([height, 0]);

  // Step 3: Create axis functions
  // ==============================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Step 4: Append Axes to the chart
  // ==============================
  chartGroup.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append('g')
    .call(leftAxis);

  // Step 5: Create Circles
  // ==============================
  var circlesGroup = chartGroup.selectAll('circle')
  .data(data)
  .enter()
  .append('circle')
  .attr('class', 'stateCircle')
  .attr('cx', d => xLinearScale(d.poverty))
  .attr('cy', d => yLinearScale(d.healthcare))
  .attr('r', '15')
  .attr('fill', 'lightBlue')
  .attr('opacity', '.90');

//   .attr() this will be for circlr text d => d.abbr
// circleGroup.append("text").text(d => d.abbr)
var textGroup = chartGroup.selectAll('text.stateText')
.data(data)
.enter()
.append("text").text(function(d){
    return d.abbr;
})
.attr('class', 'stateText')
.attr("x", d => xLinearScale(d.poverty) + 1)
.attr("y", d => yLinearScale(d.healthcare) + 2);

  // Step 6: Initialize tool tip
  // ==============================
  var toolTip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([10, -10])
    .html(function(d) {
      return (`${d.state}<br>In Poverty: ${d.poverty}<br>Lack of Healthcare: ${d.healthcare}`);
    });

//   Step 7: Create tooltip in the chart
//   ==============================
  chartGroup.call(toolTip);

  // Step 8: Create event listeners to display and hide the tooltip
  // ==============================
  circlesGroup.on('mouseover', toolTip.show);
  circlesGroup.on('mouseout', toolTip.hide);

  // Create axes labels
  chartGroup.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margin.left + 40)
    .attr('x', 0 - (height / 2))
    .attr('dy', '1em')
    .attr('class', 'aText')
    .text('Lacks Healthcare (%)');

  chartGroup.append('text')
    .attr('transform', `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr('class', 'aText')
    .text('In Poverty (%)');
});