var fs = require('fs')
  fs.readFile('test.json', 'utf-8', function read(err, str) {
    if (err) {
      console.log('error', err);
    }
    console.log('STRING here: \n', str);
    let result = parseArray(str)
    console.log('FINAL RESULT: ', result);
  });

function parseNull(data){
  return (data.startsWith('null'))? [null, data.slice(4)] : null
}

function parseBool(data){
  if(data.startsWith('true'))
    return [true, data.slice(4)]
  else if(data.startsWith('false'))
    return [false, data.slice(5)]
  else
    return null
}

function parseNumber(data) {
  var regEx = /[\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d+)?/
  var match = data.match(regEx)
  if (match != null && match[0] != -1) {
    if(match.index != 0) return null
    data = data.slice(match[0].length)
    return [match[0], data]
  }
  return null
}

function parseString(data) {
  if(!data.startsWith('"')) return null
  var btw_quotes = /"[^"]*"/
  var match = data.match(btw_quotes)
  if (match != null && match[0] != -1) {
    data = data.slice(match[0].length)
    return [match[0].substr(1,match[0].length-2), data]
  }
  return null
}

function parseSpace(data) {
  return (((/^(\s)*/).test(data)) ? ([' ', data.replace(/^(\s)*/, '')]) : null)
}


function parseComma(data) {
  return (data.startsWith(','))? [',',data.slice(1)]:null
}

function parseColon(data) {
  return (data.startsWith(':'))? [':',data.slice(1)]:null
}

function parseArray(data) {
  if(data.startsWith('[')){
    var array = []
    data = data.slice(1)
    while(!data.startsWith(']')){
      // get one element at a time
      let element = parseValue(data)
      if(element == null)
        break     // if no/no more element found the end here
      else
        array.push(element[0])  // if element found then add to a resultant array

      // remove comma btw the elements
      let commaTrimedString = parseComma(element[1])
      if(commaTrimedString == null){
        data = element[1]
      }else{
        data = commaTrimedString[1]
      }
    }

  }
  console.log('FINAL ARRAY: \n', array);
  return [array, data.slice(1)]
}

function parseValue(data){
  let extractedElement = []
  let spaceTrimedStr = parseSpace(data)
  if(spaceTrimedStr != null){// if no space found then pass string directly
    data = spaceTrimedStr[1]
  }
  extractedElement = parseNull(data) // check for null element
  if(extractedElement == null) extractedElement = parseBool(data)   // check for boolean element
  if(extractedElement == null) extractedElement = parseString(data) // check for string element
  if(extractedElement == null) extractedElement = parseNumber(data) // check for number element

  return extractedElement
}
