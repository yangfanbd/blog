import * as session from 'express-session';
export const sessionConfig = session({
  secret: 'yangfan',
  name: 'yf.session',
  rolling: true,
  cookie: { maxAge: null },
});
