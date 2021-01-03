import ThisModule from './data';

const loadData = (url, callback) => {
  console.log(`loading data ${url}...`);
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.send(null);

  xhr.onreadystatechange = function () {
    var DONE = 4; // readyState 4 means the request is done.
    var OK = 200; // status 200 is a successful return.
    try{
      if (xhr.readyState === DONE) {
        if (xhr.status === OK) {
          console.log(`...data was loaded!`);
          //- the response is just text, so parse it into a JSON object
          var gameData = JSON.parse(xhr.responseText);
          callback(gameData);
        } else {
          console.error(`Error loading data from ${url}. Perhaps the file is not found?: `, xhr.status); // An error occurred during the request.
        }
      }
    }catch(e){
      console.error(`Error loading data from ${url}. Perhaps the JSON is malformed?`, e);
    }
  };
}

export default {
  loadData: loadData
};
