import * as d3 from "d3";
import CongressApi from "./scripts/congress_api_util"
import FundraisingApi from "./scripts/fundraising_api_util"
console.log("asdf")

// setting up boundaries for each chart

const width = 900;
const height = 900;
const margin = { top: 200, bottom: 200, left: 200, right: 200 };
const store = {}
let partySelection = "A";
let currentSession;
// const svg = d3.select('#d3-container')
//   .append('svg')
//   .attr('width', width - margin.left - margin.right)
//   .attr('height', height - margin.top - margin.bottom)
//   .attr('viewBox', [0, 0, width, height])

// graph for senators with highest rate of party-aligned vote

const renderHighestGraph = function(data) {

  let svg1 = d3.select('#d3-container')
    .append('svg')
    .attr('width', (width - margin.left - margin.right) / 2)
    .attr('height', (height - margin.top - margin.bottom) / 2)
    .attr('viewBox', [0, 0, width, height])
  
  const x1 = d3.scaleLinear()
  .domain([95, 100])
  .range([500, width - margin.right]); //was margin.left
  
  const y1 = d3.scaleBand()
  .domain(d3.range(data.length))
  .range([0, height - margin.bottom])
  .padding(0.1);
  
  const highestGraph = svg1
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
    .attr('font-size', '20px')
  }
  
  svg1.append('g').call(yAxis)
  svg1.append('g').call(xAxis)
  svg1.node();
}


// graph for senators with lowest party-aligned vote

const renderLowestGraph = function (data) {

  let svg2 = d3.select('#d3-container')
    .append('svg')
    .attr('width', (width - margin.left - margin.right) / 2)
    .attr('height', (height - margin.top - margin.bottom) / 2)
    .attr('viewBox', [0, 0, width, height])

  const x2 = d3.scaleLinear()
    .domain([100, 50])
    .range([100, 0]);

  const y2 = d3.scaleBand()
    .domain(d3.range(data.length))
    .range([0, height - margin.bottom])
    .padding(0.1);

  const lowestGraph = svg2
    .append('g')
    .attr('transform', `translate(200, ${margin.top})`)
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
    g.attr('transform', `translate(100, ${margin.top})`)
      .call(d3.axisTop(x2).ticks(null, data.format))
      .attr('font-size', '20px')
  }

  function yAxis2(g) {
    g.attr('transform', `translate(${margin.left}, ${margin.top})`)
      .call(d3.axisRight(y2).tickFormat(i => data[i].name))
      .attr('font-size', '20px')
  }

  svg2.append('g').call(yAxis2)
  svg2.append('g').call(xAxis2)
  svg2.node();
}

//pull data once!!
// const mousePos = []

// function updateYear = 

function updateYear(event) {
  const sliderYear = event.target.value;
  const senateClass = {
    2008: 111,
    2010: 112,
    2012: 113,
    2014: 114, 
    2016: 115, 
    2018: 116,
    2020: 117,
  }
  return renderData(CongressApi, senateClass[sliderYear])
}




const yearSlider = document.getElementById('year-slider')

yearSlider.addEventListener("change", updateYear)


const politicalParty = document.getElementById('political_party')

politicalParty.addEventListener("change", (event) => {
  event.preventDefault();
  partySelection = event.target.value 
  renderData(CongressApi, currentSession)
})

function parseData(data) {
  let allSenators = data.results[0].members;
  allSenators = allSenators.filter(senator => partySelection === 'A' || senator.party === partySelection)
  allSenators = allSenators.sort((a, b) => a.votes_with_party_pct - b.votes_with_party_pct)
  const highestSenators = allSenators.slice(allSenators.length - 20).map(senator => {
    const name = senator.last_name + ", " + senator.first_name;
    const adjustedVotePercent = (senator.votes_with_party_pct) % 5
    const score = adjustedVotePercent
    return { name, score }
  })
  const lowestSenators = allSenators.slice(0, 20).map(senator => {
    const name = senator.last_name + ", " + senator.first_name;
    const adjustedVotePercent = (senator.votes_with_party_pct)
    const score = adjustedVotePercent
    return { name, score }
  })
  document.getElementById('d3-container').innerHTML = ""
  renderLowestGraph(lowestSenators);
  renderHighestGraph(highestSenators);
}

function renderData(api, yr=117) {
  currentSession = yr;
  if (store[yr]) {
    return parseData(store[yr])
  } 
  api.getData(yr)
    .then(data => {
      store[yr] = data
      parseData(data)
    })  
}

renderData(CongressApi);