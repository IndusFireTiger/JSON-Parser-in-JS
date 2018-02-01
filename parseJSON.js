var file = process.argv[2]
var fs = require('fs')
fs.readFile(file, 'utf-8', function read(error, str) {
  if (error) throw error
  console.log('STRING : \n', str);
  let result = parseValue(str)
  console.log('\nFINAL RESULT : ', result);
});

const parseNull = function(data) {
  return (data.startsWith('null')) ? [null, data.slice(4)] : null
}
const parseBool = function(data) {
  if (data.startsWith('true'))
    return [true, data.slice(4)]
  else if (data.startsWith('false'))
    return [false, data.slice(5)]
  else
    return null
}
const parseNumber = function(data) {
  var match = data.match(/[\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d+)?/)
  if (match != null && match[0] != -1) {
    if (match.index != 0) return null
    data = data.slice(match[0].length)
    return [match[0], data]
  }
  return null
}
const parseString = function(data) {
  if (data.startsWith('"')) {
    var match = data.match(/"[^"]*"/)
    if (match != null && match[0] != -1) {
      data = data.slice(match[0].length)
      return [match[0].substr(1, match[0].length - 2), data]
    }
  }
  return null
}
const parseSpace = function(data) {
  return (((/^(\s)*/).test(data)) ? ([' ', data.replace(/^(\s)*/, '')]) : null)
}
const parseComma = function(data) {
  return (data.startsWith(',')) ? [',', data.slice(1)] : null
}
const parseColon = function(data) {
  return (data.startsWith(':')) ? [':', data.slice(1)] : null
}
const parseArray = function(data) {
  if (!data.startsWith('[')) return null
  let array = [],spaceTrimedStr, element, commaTrimedString

  data = data.slice(1)
  while (!data.startsWith(']')) {
    data = ((spaceTrimedStr = parseSpace(data)) == null) ? data : spaceTrimedStr[1]
    // get one element at a time
    element = parseValue(data)
    if (element == null) break // if no/no more element found then end here
    else array.push(element[0]) // if element found then add to a resultant array

    // remove spaces and comma btw the elements
    data = ((spaceTrimedStr = parseSpace(element[1])) == null) ? element[1] : spaceTrimedStr[1]
    data = ((commaTrimedString = parseComma(data)) == null) ? data : commaTrimedString[1]
    data = ((spaceTrimedStr = parseSpace(data)) == null) ? data : spaceTrimedStr[1]

  }
  console.log('ARRAY: \n', array);
  return [array, data.slice(1)]
}
const parseObject = function(data) {
  // console.log('parseObj - data:', data)
  if (data.startsWith('{')) {
    var obj = {}, key, value, colonTrimedRest, moreProperty, spaceTrimedStr
    data = data.slice(1)
    while (!data.startsWith('}')) {
      key = ((spaceTrimedStr = parseSpace(data)) == null) ? parseValue(data) : parseValue(spaceTrimedStr[1])
      if(key == null) break
      console.log('\nkey', key[0]);
      data = ((spaceTrimedStr = parseSpace(key[1])) == null) ? key[1] : spaceTrimedStr[1]
      data = ((colonTrimedRest = parseColon(data)) == null) ? data : colonTrimedRest[1]
      data = ((spaceTrimedStr = parseSpace(data)) == null) ? data : spaceTrimedStr[1]
      value = parseValue(data)
      if (value == null) break
      console.log('value', value[0]);
      obj[key[0]] = value[0] // add key-value pair to object

      // remove spaces and comma btw the properties
      data = ((spaceTrimedStr = parseSpace(value[1])) == null ) ? value[1] : spaceTrimedStr[1]
      data = ((moreProperty = parseComma(data)) == null) ? data : moreProperty[1]
      data = ((spaceTrimedStr = parseSpace(data)) == null ) ? data : spaceTrimedStr[1]
    }
  }
  return [obj, data.slice(1)]
}

const tryDifferentParsers = function(...parsers) {
  return function(data) {
    for (let p = 0; p < parsers.length; p++) {
      let ele = parsers[p](data)
      if (ele !== null) {
        return ele
      }
    }
    return null
  }
}

const parseValue = tryDifferentParsers(parseNull, parseBool, parseString, parseNumber, parseArray, parseObject)
