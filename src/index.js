import * as d3 from "d3";
import CongressApi from "./scripts/congress_api_util"
import FundraisingApi from "./scripts/fundraising_api_util"
console.log("adfdsfdf")
console.log("store")
//test push
// reset main.js
// setting up boundaries for each chart


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

  const margin = { top: 20, bottom: 30, left: 110, right: 30 };

  const width = 460 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  let svg1 = d3.select('#top-senate-container')
    .append('svg')
    .attr('width', (width + margin.left + margin.right))
    .attr('height', (height + margin.top + margin.bottom))
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  const x1 = d3.scaleLinear()
    .domain([90, 100]) //was 92
    .range([0, width]); //was margin.left

  svg1.append('g')
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x1).ticks(6))
    .selectAll("text")
      .attr("transform", "translate(5, 0)")
      .style("text-anchor", "end")
  
  const y1 = d3.scaleBand()
    .domain(d3.range(data.length))
    .range([0, height])
    .padding(0.1);

  svg1.append("g")
    .call(d3.axisLeft(y1).tickFormat(i => data[i].name))
  
  svg1.selectAll('rect')
    .data(data.sort((a, b) => d3.ascending(a.score, b.score)))
    .enter()
    .append('rect')
    .attr('fill', (d, i) => data[i].party === "R" ? "crimson" : "royalblue")
    .attr('opacity', '0.9')
    .attr('x', 0) //was 0
    .attr('y', (d, i) => y1(i))
    .attr('height', y1.bandwidth())
    .attr('width', d => x1(d.score))
    .attr('class', 'rect')

  // const xGrid = d3.axisBottom(x1)
  //   .scale(y1)
  //   .ticks(5)
  //   .tickSizeInner(-width + margin.left + margin.right)

  // svg1.append('g')
  //   .attr('class', 'x-grid')
  //   // .attr('transform', `translate(${margin.left})`)
  //   .call(xGrid)
  
  svg1.node();
}


const renderLowestGraph = function(data) {

  const margin = { top: 20, bottom: 30, left: 110, right: 30 };

  const width = 460 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  let svg1 = d3.select('#top-senate-container')
    .append('svg')
    .attr('width', (width + margin.left + margin.right))
    .attr('height', (height + margin.top + margin.bottom))
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  const x1 = d3.scaleLinear()
    .domain([50, 100])
    .range([0, width]); //was margin.left

  svg1.append('g')
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x1).ticks(6))
    .selectAll("text")
    .attr("transform", "translate(5, 0)")
    .style("text-anchor", "end")

  const y1 = d3.scaleBand()
    .domain(d3.range(data.length))
    .range([height, 0])
    .padding(0.1);

  svg1.append("g")
    .call(d3.axisLeft(y1).tickFormat(i => data[i].name))

  svg1.selectAll('rect')
    .data(data.sort((a, b) => d3.ascending(a.score, b.score)))
    .enter()
    .append('rect')
    .attr('fill', (d, i) => data[i].party === "R" ? "crimson" : "royalblue")
    .attr('opacity', '0.9')
    .attr('x', 0) //was 0
    .attr('y', (d, i) => y1(i))
    .attr('height', y1.bandwidth())
    .attr('width', d => x1(d.score))
    .attr('class', 'rect')

  svg1.node();
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
  allSenators.length < 30 ? (senatorCount = (allSenators.length / 2)): senatorCount = 15;

  console.log(senatorCount);
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

  const avgScore = scoreAverager(highestSenators, lowestSenators)
  document.getElementById('top-senate-container').innerHTML = "";
  document.getElementById('bottom-senate-container').innerHTML = "";
  document.getElementById('average-score').innerHTML = `${avgScore}%`
  renderHighestGraph(highestSenators);
  renderLowestGraph(lowestSenators);
}


function scoreAverager(topSenators, bottomSenators) {
  let sum = 0;
  for (let i = 0; i < topSenators.length; i++) {
    sum += topSenators[i].score
  }
  for (let i = 0; i < bottomSenators.length; i++) {
    sum += bottomSenators[i].score
  }
  let avg = Math.floor(sum / (topSenators.length + bottomSenators.length));
  return avg ? avg : "No data for "
}

function retrieveAllData(api, yrs) {
  for (let i = 0; i < yrs.length; i++) {
    const yr = yrs[i];
    api.getData(yr)
      .then(data => {
        store[yr] = data
        parseData(data)
      })
  }
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

retrieveAllData(CongressApi, [111, 112, 113, 114, 115, 116, 117])
renderData(CongressApi);
updateYearDisplay(2020)
