const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const port = 3000
const Tag = require('en-pos').Tag

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('hello world')
})

app.post('/parse', function (req, res) {
  console.log(req.body)
  var sentence = req.body.text
  var sentenceArray = sentence
    .replace(/\b[-.,()&$#;:!–\[\]{}"']+\B|\B[-.,()&$#!\[\]{}"']+\b/g, '')
    .replace(/(\r\n|\n|\r)/gm, '')
    .split(' ')
    .filter(Boolean)
  var tags = new Tag(sentenceArray)
    .initial() // initial dictionary and pattern based tagging
    .smooth() // further context based smoothing
    .tags
  var wordsWithTags = sentenceArray.map((word, i) => {
    return {
      token: word,
      tag: tags[i]
    }
  })
  res.json(wordsWithTags)
})

app.listen(process.env.PORT || port, () => console.log(`listening on port ${port}!`))
