
// https://github.com/lapwinglabs/x-ray
var xray = require('x-ray'); 
var x = xray();

// also available: https://github.com/lapwinglabs/x-ray-phantom
// var phantom = require('x-ray-phantom'); 

var url = "https://votesmart.org/interest-group/122/rating/5070#.VrIFPmQrK2x";

x(url, 'table', [{
  name: 'td:nth-child(4)',
  score: 'td:nth-child(6)'
}])(function(err, td) {
  if(err) {
    console.log('Error' + err)
  } else {
  console.log(td);
  //console.log('TEST');
  }
});