const request = require('request');
const instagram = require('./instagram');

const url = 'https://www.instagram.com';

request.get(url, (e, resp, body) => {
  instagram.login(resp, (err, resp, body) => {
    cookie = resp.headers['set-cookie'];
    console.log(cookie);
  });
})
