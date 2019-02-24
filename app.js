const Koa = require('koa');

const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');

const index = require('./routes/index');
const users = require('./routes/users');
const doctors = require('./routes/doctors');
const diseases = require('./routes/diseases');
const falcuties = require('./routes/falcuties');
const appointments = require('./routes/appointments');
const mongoose = require('mongoose');
const cors = require('@koa/cors');

const app = new Koa();

mongoose.connect('mongodb://localhost/edoctor');

// error handler
onerror(app);

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}));
app.use(json());
app.use(logger());
app.use(require('koa-static')(`${__dirname}/public`));
app.use(cors());
app.use(views(`${__dirname}/views`, {
  extension: 'pug'
}));

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());
app.use(appointments.routes(), appointments.allowedMethods());
app.use(doctors.routes(), doctors.allowedMethods());
app.use(diseases.routes(), diseases.allowedMethods());
app.use(falcuties.routes(), falcuties.allowedMethods());
// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

module.exports = app;
