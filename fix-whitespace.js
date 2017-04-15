'use strict'

function tag(literals, ...values) {
  // Tag function used with template strings that applies various convenient
  // modifications to multiline strings, including:
  //
  // * Joins literals and embedded values of a template string while keeping
  //   the indentation from the literals (see joinTemplateString)
  //
  // * Removes the greatest amount of indentation from the beginning of each
  //   line, such that the indentation differences between each line are kept
  //   (see whitespaceAtBeginningMultiline)
  //
  // * Removes whitespace-only lines at the beginning and end of the string
  //   (see removeInitialWhitespaceLines and removeLeadingWhitespaceLines)

  let resultLines = joinTemplateString(literals, ...values).split('\n')

  // Reduce whitespace from beginning of lines
  const minWhitespace = whitespaceAtBeginningMultiline(literals.join(''))
  resultLines = resultLines.map(line => line.slice(minWhitespace))

  // Remove whitespace lines at beginning and end
  let result = resultLines.join('\n')
  result = removeInitialWhitespaceLines(result)
  result = removeLeadingWhitespaceLines(result)

  return result
}

function joinTemplateString(literals, ...values) {
  // Joins the literals and values of a template string while maintaining
  // indentation passed from literals. For example, using this template:
  //
  // `
  // <ul>
  //   ${items.map(item => `<li>${item}</li>`)}
  // </ul>
  // `
  //
  // ..and given the array ['A', 'B', 'C'] for items, this result would be
  // gotten:
  //
  // `
  // <ul>
  //   <li>A</li>
  //   <li>B</li>
  //   <li>C</li>
  // </ul>
  // `

  let resultLines = []

  for (let literalI = 0; literalI < literals.length; literalI++) {
    const literal = literals[literalI]
    const literalLines = literal.split('\n')

    let curResultLines = literalLines.slice(0)

    const value = values[literalI]
    if (value) {
      const lastLiteralLine = literalLines[literalLines.length - 1]

      const whitespaceAmount = whitespaceAtBeginning(lastLiteralLine)

      const [first, ...rest] = value.toString().split('\n')

      const modified = [first, ...rest.map(
        line => ' '.repeat(whitespaceAmount) + line
      )]

      curResultLines = squishArrays(curResultLines, modified)
    }

    resultLines = squishArrays(resultLines, curResultLines)
  }

  return resultLines.join('\n')
}

function removeInitialWhitespaceLines(lines) {
  // Removes whitespace-only lines from the beginning of a string.

  const result = lines.split('\n')

  while (result.length) {
    if (isOnlyWhitespace(result[0])) {
      result.shift()
    } else {
      break
    }
  }

  return result.join('\n')
}

function removeLeadingWhitespaceLines(lines) {
  // Removes whitespace-only lines from the ending of a string.

  const result = lines.split('\n')

  while (result.length) {
    if (isOnlyWhitespace(result[result.length - 1])) {
      result.pop()
    } else {
      break
    }
  }

  return result.join('\n')
}

function squishArrays(arr1, arr2) {
  // "Squishes" two string arrays together. Basically works like a concat, but
  // with the first item of arr2 being concatenated to the last item of arr1.

  const [first, ...rest] = arr2

  const result = arr1.slice(0, -1)

  const lastOfArr1 = arr1[arr1.length - 1]
 
  result.push((lastOfArr1 || '') + first)
  result.push(...rest)

  return result
}

function whitespaceAtBeginningMultiline(str) {
  // Gets the minimum number of whitespace characters at the beginning of each
  // of the lines of a multiline string. For example, in this string:
  //
  // `
  //   Hello
  //       World
  //  !!!!!
  // `
  //
  // The value 1 would be returned, for the one whitespace before "!!!!!".
  //
  // Note that this function ignores whitespace-only lines. Called on this
  // string, where each dot is a space, it will return the value 4:
  //
  // `
  // ....Hi
  // .......There
  // ..
  // ....Friendo!
  // `
  //
  // Though the amount of whitespace on the third line is 2, the function
  // ignores this line, since it has no non-whitespace characters.

  const minWhitespace = str.split('\n').reduce(
    (min, line) => {
      if (isOnlyWhitespace(line)) {
        return min
      } else {
        return Math.min(min, whitespaceAtBeginning(line))
      }
    },

    Infinity
  )

  if (minWhitespace === Infinity) {
    return 0
  } else {
    return minWhitespace
  }
}

function isOnlyWhitespace(str) {
  // Returns whether a passed string is composed solely of whitespace.
  // Works only on single-line strings, as newlines are not considered
  // whitespace.

  return whitespaceAtBeginning(str) === str.length
}

function whitespaceAtBeginning(str) {
  // Gets the number of whitespace characters at the beginning of a string.

  for (let i = 0; i < str.length; i++) {
    if (!isWhitespaceCharacter(str[i])) {
      return i
    }
  }

  return str.length
}

function isWhitespaceCharacter(char) {
  // Returns whether a passed character is a whitespace character or not.
  // May be expanded. Intentionally does not include line break characters.

  return [' '].includes(char)
}

if (require.main === module) {
  const items = [1, 2, 3]

  const generateSitePage = (head, content) => tag`
    <!DOCTYPE html>
    <html>
      <head>
        (Begin head..)${head}(..End head)
        <meta charset='utf-8'>
      </head>
      <body>
        <div id='content'>
          (Begin content..)${content}(..End content)
        </div>
      </body>
    </html>
  `

  console.log(generateSitePage(
    tag`
      <title>Hello, world!</title>
    `,

    tag`
      <ul>${items.map(x => `<li>${x}</li>`).join('\n')}</ul>
    `
  ))
}

if (typeof module === 'object' && typeof module.exports === 'object') {
  module.exports = tag
}
