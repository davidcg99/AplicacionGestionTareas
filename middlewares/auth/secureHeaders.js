const helmet = require('helmet');
const crypto = require('crypto');

const secureHeaders = [
  (req, res, next) => {
    const nonce = crypto.randomBytes(16).toString('base64');
    res.locals.nonce = nonce;
    next();
  },

  (req, res, next) => {
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "default-src": ["'self'"],
          "script-src": [
            "'self'",
            `'nonce-${res.locals.nonce}'`
          ],
          "style-src": [
            "'self'",
            "'unsafe-inline'",
            'https://cdn.jsdelivr.net',
            'https://cdnjs.cloudflare.com',
            'https://fonts.googleapis.com'
          ],
          "style-src-elem": [
            "'self'",
            "'unsafe-inline'",
            'https://cdn.jsdelivr.net',
            'https://cdnjs.cloudflare.com',
            'https://fonts.googleapis.com'
          ],
          "font-src": [
            "'self'",
            'https://fonts.gstatic.com',
            'https://cdnjs.cloudflare.com'
          ],
          "img-src": ["'self'", 'data:', ''],
          "connect-src": ["'self'"],
          "object-src": ["'none'"],
          "base-uri": ["'self'"],
          "form-action": ["'self'"],
          "frame-ancestors": ["'self'"],
        }
      },
      xFrameOptions: { action: 'deny' },
      referrerPolicy: { policy: 'no-referrer' },
      xContentTypeOptions: true,
      permissionsPolicy: {
        features: {
          geolocation: [],
          microphone: [],
          camera: [],
        }
      }
    })(req, res, next);
  }
];

module.exports = secureHeaders;
