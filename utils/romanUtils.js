
const fs = require('fs')
const romanize = require('romanize')
function romanToNumeric(romanToConvert) {
    const romanValues = {
      I: 1,
      IV: 4,
      V: 5,
      IX: 9,
      X: 10,
      XL: 40,
      L: 50,
      XC: 90,
      C: 100,
      CD: 400,
      D: 500,
      CM: 900,
      M: 1000
    }
  
    let numericValue = 0
    let i = 0
  
    while (i < romanToConvert.length) {
      if (i + 1 < romanToConvert.length && romanValues[romanToConvert.substring(i, i + 2)]) {
        numericValue += romanValues[romanToConvert.substring(i, i + 2)]
        i += 2
      } else {
        numericValue += romanValues[romanToConvert[i]]
        i++
      }
    }
    return numericValue
}
function getHighestRoman(directoryPath, prefix) {
// read dir using node built in file system's readdirSync. This blocks code from running 
// until all contents are read and processed
  const currentFiles = fs.readdirSync(directoryPath)
  const currentNumerals = currentFiles
    .filter((fileName) => fileName.startsWith(prefix))
    .map((fileName) => { // process array
    const match = fileName.match(new RegExp(`${prefix}-(.?).pdf`)) // regex (regular expression) pattern to match filenames
    return match ? match[1] : null // match attempts to match regex pattern
    })
    .filter((numeral) => numeral !== null)
    .map((numeral) => {
    return { numeral,
    numericValue: romanToNumeric(numeral)}
    })
  if (currentNumerals.length === 0) {
      return 'VIII' // Start from VIII if no existing files
  }

  console.log('Current Numerals:', currentNumerals)
  const highestNumeral = currentNumerals
      sort((a,b) => b.numericValue - a.numericValue)[0].numeral // was trying to sort strings lol
  return highestNumeral // Return the highest numeral as-is
}


function generateNextRomanNumeral(directoryPath, prefix){
    const highestNumeral = getHighestRoman(directoryPath, prefix)
    const numericValue = romanToNumeric(highestNumeral)
    const nextNumericValue = numericValue + 1
    const nextRomanNumeral = romanize(nextNumericValue)
    return nextRomanNumeral
}
module.exports = {
    generateNextRomanNumeral
  }