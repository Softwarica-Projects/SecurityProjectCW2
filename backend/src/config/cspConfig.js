
const defaultSrc = ["'self'"];
const scriptSrc = ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://cdnjs.cloudflare.com'];
const styleSrc = ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'];
const imgSrc = ["'self'", 'data:', 'https://res.cloudinary.com'];
const connectSrc = ["'self'", 'https://api.stripe.com'];

const cspConfig = {
  defaultSrc,
  scriptSrc,
  styleSrc,
  imgSrc,
  connectSrc,
  fontSrc: ["'self'", 'https://fonts.gstatic.com'],
  objectSrc: ["'none'"],
  frameAncestors: ["'none'"],
  upgradeInsecureRequests: [],
};

module.exports = { cspConfig };
