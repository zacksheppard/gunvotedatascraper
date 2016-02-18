// https://github.com/lapwinglabs/x-ray
var xray = require('x-ray'); 
var x = xray();

// also available: https://github.com/lapwinglabs/x-ray-phantom
// var phantom = require('x-ray-phantom'); 


var url1 = "https://www.opensecrets.org/orgs/recips.php?id=D000000082&cycle=2014&state=&party=&chamber=&sort=A&page=1";
var url2 = "https://www.opensecrets.org/orgs/recips.php?id=D000000082&cycle=2014&state=&party=&chamber=&sort=A&page=2";
var url3 = "https://www.opensecrets.org/orgs/recips.php?id=D000000082&cycle=2014&state=&party=&chamber=&sort=A&page=3";

x(url1, 'tr',
  [{
    name: 'td:nth-child(1)',
    office: 'td:nth-child(2)',
    contributions: 'td:nth-child(3)'
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

x(url2, 'tr',
  [{
    name: 'td:nth-child(1)',
    office: 'td:nth-child(2)',
    contributions: 'td:nth-child(3)'
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

x(url3, 'tr',
  [{
    name: 'td:nth-child(1)',
    office: 'td:nth-child(2)',
    contributions: 'td:nth-child(3)'
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