var fs = require('fs')
  fs.readFile('test.json', 'utf-8', function read(err, data) {
    if (err) {
      console.log('error', err);
    }
    console.log('STRING : \n', data);
    let result = parseArray(data)
    console.log('FINAL RESULT: ', result);
  });

function parseNull(s){
  return (s.startsWith('null'))? [null, s.slice(4)] : null
}

function parseBool(s){
  if(s.startsWith('true'))
    return [true, s.slice(4)]
  else if(s.startsWith('false'))
    return [false, s.slice(5)]
  else
    return null
}

function parseNumber(s) {
  var regEx = /[\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d+)?/
  var match = s.match(regEx)
  if (match != null && match[0] != -1) {
    if(match.index != 0) return null
    s = s.slice(match[0].length)
    return [match[0], s]
  }
  return null
}

function parseString(s) {
  if(!s.startsWith('"')) return null
  var btw_quotes = /"[^"]*"/
  var match = s.match(btw_quotes)
  if (match != null && match[0] != -1) {
    s = s.slice(match[0].length)
    return [match[0].substr(1,match[0].length-2), s]
  }
  return null
}

function parseSpace(s) {
  return (((/^(\s)+/).test(s)) ? ([' ', s.replace(/^(\s)+/, '')]) : null)
}


function parseComma(s) {
  return (s.startsWith(','))? [',',s.slice(1)]:null
}



function parseArray(s) {
  if(s.startsWith('[')){
    var array = []
    s = s.slice(1)
    while(!s.startsWith(']')){
      // Remove space before element
      let spaceTrimedStr = parseSpace(s)

      // get one element at a time
      let extractedElement = []
      if(spaceTrimedStr != null){// if no space found then pass string directly
        s = spaceTrimedStr[1]
      }
      extractedElement = parseNull(s) // check for null element
      if(extractedElement == null) extractedElement = parseBool(s)   // check for boolean element
      if(extractedElement == null) extractedElement = parseString(s) // check for string element
      if(extractedElement == null) extractedElement = parseNumber(s) // check for number element
      if(extractedElement == null) return extractedElement // if no element found the end here
      else
        array.push(extractedElement[0])// if element found then add to a resultant array

      // remove comma btw the elements
      let commaTrimed = parseComma(extractedElement[1])
      if(commaTrimed == null){
        s = extractedElement[1]
      }else{
        s = commaTrimed[1]
      }
    }

  }
  console.log('FINAL ARRAY: \n', array);
  return [array, s.slice(1)]
}
