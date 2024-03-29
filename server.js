require('dotenv').config();

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const logger = require('morgan');

const cors = require('cors')

const mongoose = require('mongoose')
mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/exercise-track' )

require('./models');

app.use(cors())
app.use(logger('dev'));

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const api = require('./routes');
app.use('/api', api);


app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    
    errCode = 400 
    const keys = Object.keys(err.errors)
    
    errMessage = err.errors[keys[0]].message
  } else {
    
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})