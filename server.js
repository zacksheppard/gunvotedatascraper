
// https://github.com/lapwinglabs/x-ray
var xray = require('x-ray'); 
var x = xray();

// also available: https://github.com/lapwinglabs/x-ray-phantom
// var phantom = require('x-ray-phantom'); 

var url = "https://votesmart.org/interest-group/122/rating/5070#.VrIFPmQrK2x";

x(url, 'tr',
  [{
    name: 'td:nth-child(4)',
    office: 'td:nth-child(2)',
    state: 'td:nth-child(1)',
    district: 'td:nth-child(3)',
    score: 'td:nth-child(6)'
  }]
)
.paginate('.next@href')
.limit(3)
(function(err, td) {
  if(err) {
    console.log('Error' + err)
    return;
  } 
  console.log(td);
});