import * as d3 from "d3";
import CongressApi from "./scripts/congress_api_util"
import FundraisingApi from "./scripts/fundraising_api_util"
console.log("asdf")

// setting up boundaries for each chart

const width = 900;
const height = 900;
const margin = { top: 200, bottom: 200, left: 200, right: 200 };
const store = {}
let partySelection = "all";
let generationSelection = 'all';
let genderSelection = 'all';
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
    .attr('width', (width / 2))
    .attr('height', (height / 2))
    .attr('viewBox', [0, 0, width, height])
  
  const x1 = d3.scaleLinear()
  .domain([0, 100])
  .range([margin.left, (width / 2)]); //was margin.left
  
  const y1 = d3.scaleBand()
  .domain(d3.range(data.length))
  .range([0, (height / 2)])
  .padding(0.1);
  
  const highestGraph = svg1
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)
  .selectAll('rect')
  .data(data.sort((a, b) => d3.descending(a.score, b.score)))
  .join('rect')
  .attr('fill', (d, i) => data[i].party === "R" ? "crimson" : "royalblue")
  .attr('x', 0) //was 0
  .attr('y', (d, i) => y1(i))
  .attr('height', y1.bandwidth())
  .attr('width', d => x1(d.score))
  .attr('class', 'rect')
  
  function xAxis(g) {
    g.attr('transform', `translate(0, ${margin.top})`)
    .call(d3.axisTop(x1).ticks(5)) //was null, data.format
    .attr('font-size', '20px')
  }
  
  function yAxis(g) {
    g.attr('transform', `translate(${margin.left}, ${margin.top})`)
    .call(d3.axisLeft(y1).tickFormat(i => data[i].name))
    .attr('font-size', '20px')
  }
  
  svg1.append('g').call(yAxis)
  svg1.append('g').call(xAxis)
  svg1.node();
}


const renderLowestGraph = function(data) {
  // let svg1 = d3.select('#d3-container')
  //   .append('svg')
  //   .attr('width', (width - margin.left - margin.right) / 2)
  //   .attr('height', (height - margin.top - margin.bottom) / 2)
  //   .attr('viewBox', [0, 0, width, height])

  // const x1 = d3.scaleLinear()
  //   .domain([95, 100])
  //   .range([500, width - margin.right]); //was margin.left

  // const y1 = d3.scaleBand()
  //   .domain(d3.range(data.length))
  //   .range([0, height - margin.bottom])
  //   .padding(0.1);

  // const highestGraph = svg1
  //   .append('g')
  //   .attr('transform', `translate(${margin.left}, ${margin.top})`)
  //   .selectAll('rect')
  //   .data(data.sort((a, b) => d3.descending(a.score, b.score)))
  //   .join('rect')
  //   .attr('fill', (d, i) => data[i].party === "R" ? "crimson" : "royalblue")
  //   .attr('x', 300) //was 0
  //   .attr('y', (d, i) => y1(i))
  //   .attr('height', y1.bandwidth())
  //   .attr('width', d => x1(d.score) - x1(0))
  //   .attr('class', 'rect')

  // function xAxis(g) {
  //   g.attr('transform', `translate(0, ${margin.top})`)
  //     .call(d3.axisTop(x1).ticks(5)) //was null, data.format
  //     .attr('font-size', '20px')
  // }

  // function yAxis(g) {
  //   g.attr('transform', `translate(${margin.left + 300}, ${margin.top})`)
  //     .call(d3.axisLeft(y1).tickFormat(i => data[i].name))
  //     .attr('font-size', '20px')
  // }

  // svg1.append('g').call(yAxis)
  // svg1.append('g').call(xAxis)
  // svg1.node();
}



// Update year via slider:

const yearSlider = document.getElementById('year-slider')

yearSlider.addEventListener("change", updateYear)

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
  updateYearDisplay(sliderYear);
  return renderData(CongressApi, senateClass[sliderYear])
}

function updateYearDisplay(yr) {
  let yearDisplay = document.getElementById('year-display')
  yearDisplay.innerHTML = `<h2>${yr}</h2>`
}

// Update senator generation:
const generation = document.getElementById('generation')



generation.addEventListener("change", (event) => {
  event.preventDefault();
  generationSelection = event.target.value;
  renderData(CongressApi, currentSession)
})

function genCalculator(dateOfBirth) {
  const year = parseInt(dateOfBirth.substring(0, 4))
  if (year > 1924 && year < 1946) {
    return "silent"
  } else if (year >= 1946 && year < 1965) {
    return "boomer"
  } else if (year >= 1965) {
    return "x_millenial"
  } else {
    return "other"
  }
}

// Update senator political party:

const politicalParty = document.getElementById('political_party')

politicalParty.addEventListener("change", (event) => {
  event.preventDefault();
  partySelection = event.target.value;
  renderData(CongressApi, currentSession);
})

// Update senator gender:

const gender = document.getElementById('gender')

gender.addEventListener("change", (event) => {
  event.preventDefault();
  genderSelection = event.target.value;
  renderData(CongressApi, currentSession)
})


function parseData(data) {
  let allSenators = data.results[0].members;
  allSenators = allSenators.filter(senator => partySelection === 'all' || senator.party === partySelection);
  allSenators = allSenators.filter(senator => generationSelection === 'all' || genCalculator(senator.date_of_birth) === generationSelection);
  allSenators = allSenators.filter(senator => genderSelection === 'all' || senator.gender === genderSelection);
  allSenators = allSenators.sort((a, b) => a.votes_with_party_pct - b.votes_with_party_pct);

  let senatorCount;
  allSenators.length < 30 ? (senatorCount = allSenators.length) / 2 : senatorCount = 15;

  console.log(data);
  console.log(allSenators);

  const highestSenators = allSenators.slice(allSenators.length - senatorCount).map(senator => {
    const name = senator.last_name + ", " + senator.first_name;
    const adjustedVotePercent = (senator.votes_with_party_pct) //subtract 95 or 90
    const score = adjustedVotePercent
    const party = senator.party
    return { name, score, party}
  })
  


  const lowestSenators = allSenators.slice(0, senatorCount).map(senator => {
    const name = senator.last_name + ", " + senator.first_name;
    const adjustedVotePercent = (senator.votes_with_party_pct)
    const score = adjustedVotePercent
    const party = senator.party
    return { name, score, party }
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
updateYearDisplay(2020)