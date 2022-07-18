const {
  COOKIE_NAME,
  COOKIE_PASSWORD
} = require('./config');

export const ironOptions = {
  cookieName: COOKIE_NAME,
  password: COOKIE_PASSWORD,
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};