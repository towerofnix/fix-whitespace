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
        ${"Early insert!"} (Begin content x1..)${content}(..end content; begin content x2..)${content}(..end content!)
        ${"And back down."}
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

```html
<!DOCTYPE html>
<html>
  <head>
    (Begin head..)<title>Hello, world!</title>(..End head)
    <meta charset='utf-8'>
  </head>
  <body>
    <div id='content'>
      Early insert! (Begin content x1..)<ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
      </ul>
        <!-- Further indent at end! -->(..end content; begin content x2..)<ul>
          <li>1</li>
          <li>2</li>
          <li>3</li>
        </ul>
          <!-- Further indent at end! -->(..end content!)
      And back down.
    </div>
  </body>
</html>
```

## Documentation

[Read the code!](fix-whitespace.js)
