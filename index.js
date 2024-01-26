const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const homeRoutes = require('./routes/home')
const cardRoutes = require('./routes/card')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')
const User = require('./models/user')

const app = express()

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    runtimeOptions: {
        allowProtoMethodsByDefault: true,
        allowProtoPropertiesByDefault: true,
    }
})

app.use(async (req, res, next) => {
    try {
    const user = await User.findById('65b1d4aa6184aa5667d04ebb') 
    req.user = user
    next()
    } catch (e) {
        console.log(e)
    }
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardRoutes)

const PORT = process.env.PORT || 3000

async function start() {
    try {
        const url = `mongodb+srv://@cluster0.ja66aen.mongodb.net/shop`
        await mongoose.connect(url)
        const candidate = await User.findOne()
        if (!candidate) {
            const user = new User({
                email: 'Kirill@mail.ru',
                name: 'Kirill',
                cart: {items: []}
            })
            await user.save()
        }
    } catch (e) {
        console.log (e)
    }
    
}

start()

app.listen(PORT, () => {
    console.log(`Сервер запущен на порте ${PORT}`)
})
