// JSON data
const jsonData = {
  "name": "James Hayes",
  "phone": "416-575-7301",
  "email": "james.hayes@neolation.com",
  "summary": "Experienced professional computer software developer with the confidence to take on any technological challenge and ensure successful execution. Combining technical experience with interpersonal and teamwork skills has proven to provide effective and scaled task definition and execution. Repeated commendation has been received for high self-initiative and delivery into enterprise.",
  "objective": "My goal is to join a team that collaborates, develops and maintains computer processes with emphasis on quality, security, and cross-platform discipline. I am looking for a company that is seeking help to get things done by leveraging container and cloud technology.",
  "experience": [
    {
      "title": "Freelance Developer",
      "company": "LaserStyle.me",
      "dates": "Apr’23-",
      "description": "Application of full stack technology supporting web services including appointment booking using MongoDB, node.js, express.js, Nginx, Docker CE, GitHub Pages, HTML, CSS, and Javascript. JWT with nodemail.js verification. Utilizing various public CDN resources, open-source components, and a low-cost high-availability architecture."
    },
    {
      "title": "Lead, DevOps Engineering",
      "company": "Datapassports",
      "dates": "Feb'22-Jan’23",
      "description": "Lead team in regard to deployed technologies involving up to seven analysts in DevOps, QA, and Operations. Azure and AWS deployment of Spark/Yarn/Hadoop with REST, Kafka, Postgresql, Spring Boot, and Node (NextJs). Responsible for development support and maintenance of the product delivery pipeline and microservices (Helm-like). Business plan product definition and high-level architecture was translated into requirements and disseminated (APIM). Involved with design and prototyping of a proprietary OAuth2 securing Kafka channel; PKI, x.509, TLS/SSL. Technologies: Jenkins, Maven, Java 8, JDBC, BASH, PowerShell, Python, Scala, Javascript, Git, Jira, Artifactory. Docker CE and swarm network using RHEL UBI containers, using Kubernetes investigated e.g. OpenShift, AKS."
    },
    {
      "title": "DevOps/Software Developer",
      "company": "Datapassports (formerly Schedule1 Inc.)",
      "dates": "May'18-Feb’22",
      "description": "Implemented a continuous automated unattended software delivery system using BASH and Python in a Terraform equivalent approach and using Ansible. Used standard Git workflow in practicing an Agile software change process. Created a packaging framework on AWS enabling the delivery of various components in various custom configurations. Deliver from the pipeline based on building in a container including escrow image retention and third-party verification. Developed and tested REST API with low latency, high concurrency, and scaled performance e.g. 150 req/sec. Integrated hardware cryptography security module using Opencryptoki (C/C++) and z/OS (HSM) as a key vault. Created automated configuration using AWS/EC2 supporting TLS/SSL for all component communication channels. Developed a format preserving encryption (FPE) module in Scala/Java using open-source libraries."
    },
    {
      "title": "Full Stack Developer (contract with Datapassports)",
      "company": "Neolation.com Corp",
      "dates": "May'17-May’18",
      "description": "Designed and developed a data acquisition and aggregation component supporting product."
    }
  ]
};

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

// Create bubble elements based on the data
const bubbles = svg.selectAll('.bubble')
  .data(data)
  .enter()
  .append('circle')
  .attr('class', 'bubble')
  .attr('r', d => d.value)
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

// Add x-axis
const xAxis = d3.axisBottom(xScale)
  .tickFormat(formatDate);

svg.append('g')
  .attr('class', 'x-axis')
  .attr('transform', `translate(0, ${height})`)
  .call(xAxis);
