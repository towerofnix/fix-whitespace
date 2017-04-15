# fix-whitespace

A tiny library that fixes whitespace in JavaScript template strings.

```js
const items = [1, 2, 3]

const generateSitePage = (head, content) => fixWhitespace`
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
  fixWhitespace`
    <title>Hello, world!</title>
  `,

  fixWhitespace`
    <ul>${items.map(x => `<li>${x}</li>`).join('\n')}</ul>
  `
))
```

## Documentation

[Read the code!](fix-whitespace.js)
