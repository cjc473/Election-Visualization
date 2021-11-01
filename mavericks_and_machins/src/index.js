import * as d3 from "d3";
import CongressApi from "./scripts/congress_api_util"
import FundraisingApi from "./scripts/fundraising_api_util"
console.log("asdf")

// setting up boundaries for each chart

const width = 900;
const height = 900;
const margin = { top: 200, bottom: 200, left: 200, right: 200 };

const svg = d3.select('#d3-container')
  .append('svg')
  .attr('width', width - margin.left - margin.right)
  .attr('height', height - margin.top - margin.bottom)
  .attr('viewBox', [0, 0, width, height])

// graph for senators with highest rate of party-aligned vote

const renderHighestGraph = function(data) {
  
  const x1 = d3.scaleLinear()
  .domain([95, 100])
  .range([500, width - margin.right]); //was margin.left
  
  const y1 = d3.scaleBand()
  .domain(d3.range(data.length))
  .range([0, height - margin.bottom])
  .padding(0.1);
  
  const highestGraph = svg
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)
  .attr('fill', 'royalBlue')
  .selectAll('rect')
  .data(data.sort((a, b) => d3.descending(a.score, b.score)))
  .join('rect')
  .attr('x', 300) //was 0
  .attr('y', (d, i) => y1(i))
  .attr('height', y1.bandwidth())
  .attr('width', d => x1(d.score) - x1(0))
  .attr('class', 'rect')
  
  function xAxis(g) {
    g.attr('transform', `translate(0, ${margin.top})`)
    .call(d3.axisTop(x1).ticks(5)) //was null, data.format
    .attr('font-size', '20px')
  }
  
  function yAxis(g) {
    g.attr('transform', `translate(${margin.left + 300}, ${margin.top})`)
    .call(d3.axisLeft(y1).tickFormat(i => data[i].name))
    .attr('font-size', '14px')
  }
  
  svg.append('g').call(yAxis)
  svg.append('g').call(xAxis)
  svg.node();
}


// graph for senators with lowest party-aligned vote

const renderLowestGraph = function (data) {

  const x2 = d3.scaleLinear()
    .domain([100, 0])
    .range([100, 0]);

  const y2 = d3.scaleBand()
    .domain(d3.range(data.length))
    .range([0, height - margin.bottom])
    .padding(0.1);

  const lowestGraph = svg
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .attr('fill', 'green')
    .selectAll('rect')
    .data(data.sort((a, b) => d3.descending(a.score, b.score)))
    .join('rect')
    .attr('x', (d) => x2(d.score) - x2(100))
    .attr('y', (d, i) => y2(i))
    .attr('height', y2.bandwidth())
    .attr('width', d => x2(100) - x2(d.score))
    .attr('class', 'rect')

  function xAxis2(g) {
    g.attr('transform', `translate(0, ${margin.top})`)
      .call(d3.axisTop(x2).ticks(null, data.format))
      .attr('font-size', '20px')
  }

  function yAxis2(g) {
    g.attr('transform', `translate(${margin.left}, ${margin.top})`)
      .call(d3.axisRight(y2).tickFormat(i => data[i].name))
      .attr('font-size', '14px')
  }

  svg.append('g').call(yAxis2)
  svg.append('g').call(xAxis2)
  svg.node();
}



function renderData(api) {
  api.getData(116)
    .then(data => {
      let allSenators = data.results[0].members;
      allSenators = allSenators.sort((a, b) => a.votes_with_party_pct - b.votes_with_party_pct)
      const highestSenators = allSenators.slice(80).map(senator => {
        const name = senator.last_name + ", " + senator.first_name;
        const adjustedVotePercent = (senator.votes_with_party_pct) % 5
        const score = adjustedVotePercent
        return {name, score}
      })
      const lowestSenators = allSenators.slice(0, 20).map(senator => {
        const name = senator.last_name + ", " + senator.first_name;
        const adjustedVotePercent = (senator.votes_with_party_pct)
        const score = adjustedVotePercent
        return { name, score }
      })
      renderHighestGraph(highestSenators);
      renderLowestGraph(lowestSenators)
    })
}

renderData(CongressApi);