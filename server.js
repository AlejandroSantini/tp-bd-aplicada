require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const mainRoutes = require('./routes/mainRoutes');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hora
}));

app.use('/', mainRoutes);

app.use((req, res, next) => {
    res.status(404).send("Lo siento, no se pudo encontrar esa página!");
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});