const request = require('request');
const instagram = require('./instagram');

const url = 'https://www.instagram.com';

request.get(url, (e, resp, body) => {
  instagram.autoLike(resp);
})
