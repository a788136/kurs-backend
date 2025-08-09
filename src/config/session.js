import MongoStore from 'connect-mongo';

export const sessionMiddleware = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  proxy: true,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: {
    httpOnly: true,
    secure: true, // для кросс-доменной cookie на HTTPS
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 дней
  }
};