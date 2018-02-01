var fs = require('fs')
  fs.readFile('test.json', 'utf-8', function read(err, str) {
    if (err) {
      console.log('error', err);
    }
    console.log('STRING here: \n', str);
    let result = parseObject(str)
    console.log('\nFINAL RESULT: ', result);
  });

function parseNull(data){
  let spaceTrimedStr = parseSpace(data)
  if(spaceTrimedStr != null){// if no space found then pass string directly
    data = spaceTrimedStr[1]
  }
  return (data.startsWith('null'))? [null, data.slice(4)] : null
}

function parseBool(data){
  let spaceTrimedStr = parseSpace(data)
  if(spaceTrimedStr != null){// if no space found then pass string directly
    data = spaceTrimedStr[1]
  }
  if(data.startsWith('true'))
    return [true, data.slice(4)]
  else if(data.startsWith('false'))
    return [false, data.slice(5)]
  else
    return null
}

function parseNumber(data) {
  let spaceTrimedStr = parseSpace(data)
  if(spaceTrimedStr != null){// if no space found then pass string directly
    data = spaceTrimedStr[1]
  }
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
  let spaceTrimedStr = parseSpace(data)
  if(spaceTrimedStr != null){// if no space found then pass string directly
    data = spaceTrimedStr[1]
  }
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
  let spaceTrimedStr = parseSpace(data)
  if(spaceTrimedStr != null){// if no space found then pass string directly
    data = spaceTrimedStr[1]
  }
  return (data.startsWith(','))? [',',data.slice(1)]:null
}

function parseColon(data) {
  // console.log('parseColon data:', data);
  let spaceTrimedStr = parseSpace(data)
  if(spaceTrimedStr != null){// if no space found then pass string directly
    data = spaceTrimedStr[1]
  }
  return (data.startsWith(':'))? [':',data.slice(1)]:null
}

function parseArray(data) {
  if(data.startsWith('[')){
    var array = []
    data = data.slice(1)
    while(!data.startsWith(']')){
      // get one element at a time
      let element = parseValue(data)
      if(element == null) break     // if no/no more element found the end here
      else array.push(element[0])  // if element found then add to a resultant array

      // remove comma btw the elements
      let commaTrimedString = parseComma(element[1])
      if(commaTrimedString == null) data = element[1]
      else data = commaTrimedString[1]
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

function parseObject(data){
  console.log('parseObj - data:', data)
  if(data.startsWith('{')){
    var obj = {}, keyPlusRest, valuePlusRest, key, value, colonTrimedRest, moreProperty
    data = data.slice(1)
    while(!data.startsWith(']')){

      keyPlusRest = parseValue(data) // extract key
      if(keyPlusRest == null) break
      else key = keyPlusRest[0]
      console.log('\nkey', key);

      colonTrimedRest = parseColon(keyPlusRest[1]) // remove colon
      if(colonTrimedRest == null) break
      else valuePlusRest = parseValue(colonTrimedRest[1]) // extract value
      if(valuePlusRest == null) break
      else value = valuePlusRest[0]
      console.log('value', value);

      obj[key] = value // add key-value pair to object
      console.log('obj', obj);

      moreProperty = parseComma(valuePlusRest[1]) //look for more such pairs
      if(moreProperty == null) break
      else data = moreProperty[1]
    }
  }
  return [obj, valuePlusRest[1]]
}
