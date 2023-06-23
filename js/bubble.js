// JSON data
const static_jsonData = {
  "name": "your name",
  "phone": "your phone",
  "email": "you email @ your.domain",
  "summary": "your summary",
  "objective": "your objective",
  "experience": [
       {
       "company": "company1",
       "location": "location, province or state",
       "title": "title for position #1",
       "dates": "start and end date e.g. Apr'2022-Feb'2023",
       "responsibilities": [
         "one responsibility",
         "second responsibility",
       ]
     },
       {
       "company": "company2",
       "location": "location, province or state",
       "title": "position #2",
       "dates": "start and end date e.g. Apr'2022-Feb'2023",
       "responsibilities": [
         "one responsibility",
         "second responsibility",
       ]
     },
       {
       "company": "company3",
       "location": "location, province or state",
       "title": "position #3",
       "dates": "start and end date e.g. Apr'2022-Feb'2023",
       "responsibilities": [
         "one responsibility",
         "second responsibility",
       ]
     }
  ]
};

const Application = function (jsondata) {

  function getJsonData() {
    if (jsondata == null) {
      return static_jsonData
    } else {
      return jsondata
    }
  }
  const jsonData = getJsonData()
  // Set up the SVG container
  const svg = d3.select('#chart');
  const width = +svg.attr('width');
  const height = +svg.attr('height');
  const centerX = width / 2;
  const centerY = height / 2;

  // Get window dimensions
  function getWindowDimensions() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    return {
      width: width,
      height: height,
    };
  }

  const windowDimensions = getWindowDimensions();
  const offsetX = windowDimensions.width / 4;
  const offsetY = windowDimensions.height / 4;

  // Parse the dates and convert them to appropriate date objects
  const parseDate = d3.timeParse("%b'%y");
  const formatDate = d3.timeFormat("%b'%y");
  const data = jsonData.experience.map((exp, index) => ({
    name: exp.title,
    value: exp.dates.length * 5,
    description: exp.description,
    startDate: parseDate(exp.dates.split('-')[0]),
    endDate: exp.dates.endsWith('-') ? new Date() : parseDate(exp.dates.split('-')[1]),
  }));

  // Randomly position nodes within the viewport
  data.forEach(node => {
    node.x = Math.random() * width;
    node.y = Math.random() * height;
  });

  // Create a force simulation with force towards the center
  const simulation = d3.forceSimulation(data)
    .force('charge', d3.forceManyBody().strength(0.01))
    .force('center', d3.forceCenter(centerX, centerY))
    .force('collision', d3.forceCollide().radius(d => d.value))
    .force('towardsCenter', () => {
      for (const node of data) {
        node.vx += (centerX - node.x) * 0.001 + offsetX;
        node.vy += (centerY - node.y) * 0.001 + offsetY;
      }
    });

  // Run the simulation to stabilize the bubble positions
  for (let i = 0; i < 300; i++) {
    simulation.tick();
  }

  function runSimulation() {
    simulation.tick();
    window.setTimeout(() => {
      runSimulation();
    }, 10);
  }

  runSimulation();

    var radiusScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)]) // Assuming 'value' is the property for bubble size
      .range([5, 30]); // Adjust the range as per your desired minimum and maximum radius

  // Create bubble elements based on the data
  const bubbles = svg.selectAll('.bubble')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'bubble')
    .attr('r', d => radiusScale(d.value * 2.5))
    .style('fill', 'steelblue')
    .style('opacity', 0.7)
    .attr('cx', d => d.x)
    .attr('cy', d => d.y);

  // Add labels to the bubbles
  const labels = svg.selectAll('.label')
    .data(data)
    .enter()
    .append('text')
    .attr('class', 'label')
    .attr('x', d => d.x)
    .attr('y', d => d.y)
    .text(d => d.name)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle');

  // Create x-scale for the time axis
  const xScale = d3.scaleTime()
    .domain([d3.min(data, d => d.startDate), d3.max(data, d => d.endDate)])
    .range([0, width]);
    function resize() {
      // Update the dimensions based on the container or viewport size
      const containerWidth = d3.select("#chart").node().clientWidth;
      const containerHeight = d3.select("#chart").node().clientHeight;
      const newWidth = containerWidth //- margin.left - margin.right;
      const newHeight = containerHeight //- margin.top - margin.bottom;

      // Update the element's size
      svg.attr("width", newWidth)
         .attr("height", newHeight);

      // Update any scales or other elements that depend on the dimensions
      // ...
    }

  window.addEventListener("resize", resize);

  return {

    onload: function () {
      console.log("Loading resume.")
      return this
    }
  }
}


