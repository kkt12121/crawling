const express = require('express');
const bodyParser = require('body-parser')
const path = require("path");
const app = express();

const { sequelize } = require('./models')
sequelize.sync({ alter: true })

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.set('port', process.env.PORT || 8000);

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.render('index', {
        //search: null,
        //data: null,
        result: null
    })
})
app.use('/', require('./routes'))

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중')
})

//const crawling = require('./crawling')

//crawling.budong()