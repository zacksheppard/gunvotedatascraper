var currentCongress = require('./currentCongress.js');
var propublicaData = require('./propublicaData.js');
var bradyRating2009 = require('./bradyRating2009.js');
var bradyRating2014 = require('./bradyRating2014.js');
var nraContributions2014 = require('./nraContributions2014.js');
var bradyNoMoneyTaken2014 = require('./bradyNoMoneyTaken2014.js');

var cleanCongressData = function(currentCongress) {
  var newData = [];

  for(i=0; currentCongress.length > i; i++) {
    var ccRep = currentCongress[i];
    if(ccRep.role_type === 'senator' 
      || ccRep.role_type === 'representative') {

      var rep = {};
      rep.description = ccRep.description;
      rep.contact_form = ccRep.contact_form;
      rep.party = ccRep.party;
      rep.bioguideid = ccRep.person.bioguideid;
      rep.firstname = ccRep.person.firstname;
      rep.lastname = ccRep.person.lastname;
      rep.middlename = ccRep.person.middlename;
      rep.name = ccRep.person.name;
      rep.phone = ccRep.phone;
      rep.role_type = ccRep.role_type;
      rep.role_type_label = ccRep.role_type_label;
      rep.state = ccRep.state;
      rep.title = ccRep.title;
      rep.title_long = ccRep.title_long;
      rep.gunMetrics = {};

      newData.push(rep);

    }
  }
  // console.log('Total current congress: ' + newData.length);
  return newData;
}

var insertPropublicaData = function(congress, ppData) {
  var representativeCount = 0;
  var bradyRatingCount2003 = 0;
  var nraRatingCount2013 = 0;
  var nraContributions2012Count = 0
  for(i=0; congress.length > i; i++) {
    var ccRep = congress[i];

    for(j=0; ppData.length > j; j++) {
      var ppRep = ppData[j];
      if(ppRep.bioguide_id === ccRep.bioguideid) {
        representativeCount++;

        if(ppRep.brady_rating !== undefined ) {
          bradyRatingCount2003++;
          ccRep.gunMetrics['bradyRating2003'] = ppRep.brady_rating;
          
        }
        if(ppRep.nra_rating !== undefined ) {
          nraRatingCount2013++;
          ccRep.gunMetrics['nraRating2013'] = ppRep.nra_rating;
        }
        if(ppRep.contributions !== undefined ) {
          nraContributions2012Count++;
          ccRep.gunMetrics['nraContributions2012'] = ppRep.contributions;
        }
      }
    }
  }
  // console.log('Propublica representative match: ' + representativeCount);
  // console.log('bradyRatingCount2003 representative match: ' + bradyRatingCount2003);
  // console.log('nraRatingCount2013 representative match: ' + nraRatingCount2013);
  // console.log('nraContributions2012Count representative match: ' + nraContributions2012Count);
  return congress;
}

var insertVoteSmartData = function(metricLabel, congress, data) {
  var count = 0;
  for(i=0; congress.length > i; i++) {
    var ccRep = congress[i];

    for(j=0; data.length > j; j++) {
      var normalizedName = /^[a-zA-Zú\.é]*\s([a-zA-Z\']*)/
        .exec(data[j].name);
      // console.log(normalizedName);
      if(normalizedName[1] === ccRep.lastname && 
        ccRep.state === data[j].state) {
        count++;
        // console.log('Match ' + count);
        ccRep.gunMetrics[metricLabel] = data[j].score;
      } 
    }
  }
  // console.log(metricLabel + ' count: ' + count);

  return congress;
}

var insertOpenSecretsData = function(metricLabel, congress, data) {
  var count = 0;
  for(i=0; congress.length > i; i++) {
    var ccRep = congress[i];

    for(j=0; data.length > j; j++) {
      var normalizedName = /^([a-zA-Zú\.é\'\-\s]*),\s[a-zA-Zú\.é\']*/
        .exec(data[j].name);
      // console.log(normalizedName);
      if(normalizedName[1] === ccRep.lastname && 
        ccRep.state === data[j].state) {
        count++;
        // console.log('Match ' + count);
        ccRep.gunMetrics[metricLabel] = data[j].contributions;
      } 
    }
  }
  // console.log(metricLabel + ' count: ' + count);

  return congress;
}

var insertNoMoneyTaken = function(congress, data) {
  var count = 0;
  for(i=0; congress.length > i; i++) {
    var ccRep = congress[i];
    for(j=0; data.length > j; j++) {
      var normalizedName = /^([a-zA-Zú\.é\'\-]{2,})\s([A-Z]\.\s)?([a-zA-Zú\.é\']*)\s\([A-Z]-([A-Z]{2}).*\)$/i.exec(data[j].name);
      // normalizedName[1] First name
      // normalizedName[2] Middle initial 'A. '
      // normalizedName[3] Last Name
      // normalizedName[4] State abbreviation
      if(normalizedName[1] === ccRep.firstname 
        && normalizedName[3] === ccRep.lastname
        && normalizedName[4] === ccRep.state ) {
        count++;
        ccRep.gunMetrics['nraContributions2014'] = "$0";
      } 
    }
  }
  // console.log('insertNoMoneyTaken count: ' + count);
  return congress;
}

var metricsCount = function(data) {
  var countNoData = 0;
  for(i=0; data.length > i; i++) {
    var count = 0;
    if (data[i].gunMetrics.brady_rating2003 !== undefined) {
      count++;
    }
    if (data[i].gunMetrics.nra_rating2013 !== undefined) {
      count++;
    }
    if (data[i].gunMetrics.nra_contributions2012 !== undefined) {
      count++;
    }
    if (data[i].gunMetrics.bradyData2009 !== undefined) {
      count++;
    }
    if (data[i].gunMetrics.bradyData2014 !== undefined) {
      count++;
    }
    if (data[i].gunMetrics.nraContributions2014 !== undefined) {
      count++;
    }
    if(count === 0) {
      countNoData++;
    }
  }
  // console.log('Count with no data: ' + countNoData)
}

var sortByStateAndDistrict = function(congress) {
  var states = {
    "AL": {
     "name" : "Alabama",
     "senators" : [],
     "representatives" : []   
    },
    "AK": {
     "name" : "Alaska",
     "senators" : [],
     "representatives" : []   
    },
    "AS": {
     "name" : "American Samoa",
     "senators" : [],
     "representatives" : []   
    },
    "AZ": {
     "name" : "Arizona",
     "senators" : [],
     "representatives" : []   
    },
    "AR": {
     "name" : "Arkansas",
     "senators" : [],
     "representatives" : []   
    },
    "CA": {
     "name" : "California",
     "senators" : [],
     "representatives" : []   
    },
    "CO": {
     "name" : "Colorado",
     "senators" : [],
     "representatives" : []   
    },
    "CT": {
     "name" : "Connecticut",
     "senators" : [],
     "representatives" : []   
    },
    "DE": {
     "name" : "Delaware",
     "senators" : [],
     "representatives" : []   
    },
    "DC": {
     "name" : "District Of Columbia",
     "senators" : [],
     "representatives" : []   
    },
    "FM": {
     "name" : "Federated States Of Micronesia",
     "senators" : [],
     "representatives" : []   
    },
    "FL": {
     "name" : "Florida",
     "senators" : [],
     "representatives" : []   
    },
    "GA": {
     "name" : "Georgia",
     "senators" : [],
     "representatives" : []   
    },
    "GU": {
     "name" : "Guam",
     "senators" : [],
     "representatives" : []   
    },
    "HI": {
     "name" : "Hawaii",
     "senators" : [],
     "representatives" : []   
    },
    "ID": {
     "name" : "Idaho",
     "senators" : [],
     "representatives" : []   
    },
    "IL": {
     "name" : "Illinois",
     "senators" : [],
     "representatives" : []   
    },
    "IN": {
     "name" : "Indiana",
     "senators" : [],
     "representatives" : []   
    },
    "IA": {
     "name" : "Iowa",
     "senators" : [],
     "representatives" : []   
    },
    "KS": {
     "name" : "Kansas",
     "senators" : [],
     "representatives" : []   
    },
    "KY": {
     "name" : "Kentucky",
     "senators" : [],
     "representatives" : []   
    },
    "LA": {
     "name" : "Louisiana",
     "senators" : [],
     "representatives" : []   
    },
    "ME": {
     "name" : "Maine",
     "senators" : [],
     "representatives" : []   
    },
    "MH": {
     "name" : "Marshall Islands",
     "senators" : [],
     "representatives" : []   
    },
    "MD": {
     "name" : "Maryland",
     "senators" : [],
     "representatives" : []   
    },
    "MA": {
     "name" : "Massachusetts",
     "senators" : [],
     "representatives" : []   
    },
    "MI": {
     "name" : "Michigan",
     "senators" : [],
     "representatives" : []   
    },
    "MN": {
     "name" : "Minnesota",
     "senators" : [],
     "representatives" : []   
    },
    "MS": {
     "name" : "Mississippi",
     "senators" : [],
     "representatives" : []   
    },
    "MO": {
     "name" : "Missouri",
     "senators" : [],
     "representatives" : []   
    },
    "MT": {
     "name" : "Montana",
     "senators" : [],
     "representatives" : []   
    },
    "NE": {
     "name" : "Nebraska",
     "senators" : [],
     "representatives" : []   
    },
    "NV": {
     "name" : "Nevada",
     "senators" : [],
     "representatives" : []   
    },
    "NH": {
     "name" : "New Hampshire",
     "senators" : [],
     "representatives" : []   
    },
    "NJ": {
     "name" : "New Jersey",
     "senators" : [],
     "representatives" : []   
    },
    "NM": {
     "name" : "New Mexico",
     "senators" : [],
     "representatives" : []   
    },
    "NY": {
     "name" : "New York",
     "senators" : [],
     "representatives" : []   
    },
    "NC": {
     "name" : "North Carolina",
     "senators" : [],
     "representatives" : []   
    },
    "ND": {
     "name" : "North Dakota",
     "senators" : [],
     "representatives" : []   
    },
    "MP": {
     "name" : "Northern Mariana Islands",
     "senators" : [],
     "representatives" : []   
    },
    "OH": {
     "name" : "Ohio",
     "senators" : [],
     "representatives" : []   
    },
    "OK": {
     "name" : "Oklahoma",
     "senators" : [],
     "representatives" : []   
    },
    "OR": {
     "name" : "Oregon",
     "senators" : [],
     "representatives" : []   
    },
    "PW": {
     "name" : "Palau",
     "senators" : [],
     "representatives" : []   
    },
    "PA": {
     "name" : "Pennsylvania",
     "senators" : [],
     "representatives" : []   
    },
    "PR": {
     "name" : "Puerto Rico",
     "senators" : [],
     "representatives" : []   
    },
    "RI": {
     "name" : "Rhode Island",
     "senators" : [],
     "representatives" : []   
    },
    "SC": {
     "name" : "South Carolina",
     "senators" : [],
     "representatives" : []   
    },
    "SD": {
     "name" : "South Dakota",
     "senators" : [],
     "representatives" : []   
    },
    "TN": {
     "name" : "Tennessee",
     "senators" : [],
     "representatives" : []   
    },
    "TX": {
     "name" : "Texas",
     "senators" : [],
     "representatives" : []   
    },
    "UT": {
     "name" : "Utah",
     "senators" : [],
     "representatives" : []   
    },
    "VT": {
     "name" : "Vermont",
     "senators" : [],
     "representatives" : []   
    },
    "VI": {
     "name" : "Virgin Islands",
     "senators" : [],
     "representatives" : []   
    },
    "VA": {
     "name" : "Virginia",
     "senators" : [],
     "representatives" : []   
    },
    "WA": {
     "name" : "Washington",
     "senators" : [],
     "representatives" : []   
    },
    "WV": {
     "name" : "West Virginia",
     "senators" : [],
     "representatives" : []   
    },
    "WI": {
     "name" : "Wisconsin",
     "senators" : [],
     "representatives" : []   
    },
    "WY": {
     "name" : "Wyoming",
     "senators" : [],
     "representatives" : []   
    }
  };
  
  for(i=0;congress.length > i;i++) {
    if(congress[i].role_type === "senator") {
      states[congress[i].state]['senators'].push(congress[i]);
    }
    if(congress[i].role_type === "representative") {
      states[congress[i].state]['representatives'].push(congress[i]);
    }
  }
  return states;
}


var cleanedData = cleanCongressData(currentCongress);

var withPropublicaData = insertPropublicaData(cleanedData, propublicaData);

var withBradyData2009 = 
  insertVoteSmartData('bradyData2009', withPropublicaData, bradyRating2009);

var withBradyData2014 = 
  insertVoteSmartData('bradyData2014', withBradyData2009, bradyRating2014);

var withnraContributions2014 = 
  insertOpenSecretsData('nraContributions2014', withBradyData2014, nraContributions2014);

var withNoMoneyTaken2014 = insertNoMoneyTaken(withnraContributions2014, bradyNoMoneyTaken2014);

var congressmanSorted = sortByStateAndDistrict(withNoMoneyTaken2014);



console.log(JSON.stringify(congressmanSorted));
// metricsCount(withnraContributions2014);




