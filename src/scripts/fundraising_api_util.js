console.log("test");

const FundraisingApi = { 
  getData: function (cycle = 2020) {
    return fetch(`https://api.propublica.org/campaign-finance/v1/2020/candidates/P60007168.json`, {
      method: 'GET',
      headers: {
        'X-API-Key': 'wXPrbVCOU1JfbFMmDr5WUTZqj6MrqH3XSnoLMQ4P'
      }
    }).then((response) => {
      return response.json()
    }).then((fundraisingData) => {
      console.log(fundraisingData)
      return fundraisingData
    }).catch((error) => {
      console.error('Unable to retrieve data from network')
    })
  }
}


//   if (!response.okay) {
//     throw new Error('Unable to retrieve data from network')
//   }

//   const congressData = response.json();
//   return congressData;

export default FundraisingApi;


// first name, last name, 
// missed votes