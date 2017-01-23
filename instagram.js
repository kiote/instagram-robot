const request = require('request');
const cheerio = require('cheerio')

const login_url = 'https://www.instagram.com/accounts/login/ajax/';

const fbm = 'fbm_124024574287414';
const dsUserId = '7992144';


const cookies = {
  cookie: (resp) => {
    return resp.headers['set-cookie'];
  },
  getToken: (cookie, position=1) => {
    return cookie[position].split(';')[0].split('=')[1];
  }
}

/**
 * Logs in into the instagram with given login and password
 * they should be set with env vars
 */
const login = (resp) => {
  let cookie = cookies.cookie(resp);
  let csrftoken = cookies.getToken(cookie, 1);
  let mid = cookies.getToken(cookie, 2);

  request.post(login_url,
  {
    form: { username: process.env.USERNAME,
            password: process.env.PASSWORD
          },
    headers: {
      'cookie': `${fbm}=base_domain=.instagram.com; mid=${mid}; s_network=""; ig_pr=2; ig_vw=1148; csrftoken=${csrftoken}`,
      'referer': 'https://www.instagram.com/',
      'x-csrftoken': csrftoken,
    }
  }, (err, resp, body) => {
    // callback
    saveLoginCookie(resp, body, mid);
  });
}

const saveLoginCookie = (resp, body, mid) => {
    cookie = cookies.cookie(resp);
    csrftoken = cookies.getToken(cookie, 0);
    sessionId = cookies.getToken(cookie, 1);
    console.log(cookie);
}

module.exports = {
  login: login
};
