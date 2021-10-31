console.log("test");

const CongressApi = {
  getData: function(session = 108) {
    return fetch(`https://api.propublica.org/congress/v1/${session}/senate/members.json`, {
      method: 'GET',
      headers: {
        'X-API-Key': 'ThmN2WsGZ9CGGFX54ZlznXCtCsqE3eJMzqKkeqxw'
      }
    }).then(function(response) {
      return response.json()
    }).then(function(congressData) {
      console.log(congressData)
      return congressData
    }).catch(function(error) {
      console.error('Unable to retrieve data from network')
    })

  }
}
  //   if (!response.okay) {
  //     throw new Error('Unable to retrieve data from network')
  //   }

  //   const congressData = response.json();
  //   return congressData;

export default CongressApi;


// first name, last name, 
// missed votes
