const data = [
  { name: 'Simon', score: 80 },
  { name: 'Mary', score: 90 },
  { name: 'John', score: 60 },
  { name: 'Peter', score: 89 }
];

const width = 600;
const height = 600;
const margin = { top: 100, bottom: 100, left: 100, right: 100};

const svg = d3.select('#d3-container')
  .append('svg')
  .attr('width', width - margin.left - margin.right)
  .attr('height', height - margin.top - margin.bottom)  
  .attr('viewBox', [0, 0, width, height])


const x = d3.scaleLinear()
  .domain([0, 100])
  .range([margin.left, width - margin.right]);

const y = d3.scaleBand()
  .domain(d3.range(data.length))
  .range([0, height - margin.bottom])
  .padding(0.1);

svg
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)
  .attr('fill', 'royalBlue')
  .selectAll('rect')
  .data(data.sort((a, b) => d3.descending(a.score, b.score)))
  .join('rect')
    .attr('x', 0)
    .attr('y', (d, i) => y(i))
    .attr('height', y.bandwidth())
    .attr('width', d => x(d.score) - x(0))
    .attr('class', 'rect')

function xAxis(g) {
  g.attr('transform', `translate(0, ${margin.top})`)
  .call(d3.axisTop(x).ticks(null, data.format))
  .attr('font-size', '20px')
}

function yAxis(g) {
  g.attr('transform', `translate(${margin.left}, ${margin.top})`)
  .call(d3.axisLeft(y).tickFormat(i => data[i].name))
  .attr('font-size', '20px')
}

svg.append('g').call(yAxis)
svg.append('g').call(xAxis)
svg.node();