import { Application, json, urlencoded } from 'express';
import cookieSession from 'cookie-session';
import compression from 'compression';

import { config } from 'config';

export default function standardMiddleware(app: Application) {
  app.use(
    cookieSession({
      name: 'session',
      keys: [config.secretKeyOne, config.secretKeyTwo],
      maxAge: 24 * 7 * 3600000,
      secure: config.env !== 'development'
    })
  );
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.use(compression());
}
