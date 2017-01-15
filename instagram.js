const request = require('request');
const login_url = 'https://www.instagram.com/accounts/login/ajax/';

const cookies = {
  cookie: (resp) => {
    return resp.headers['set-cookie'];
  },
  getCsrfToken: (cookie) => {
    return cookie[1].split(';')[0].split('=')[1];
  },
  getMid: (cookie) => {
    return cookie[2].split(';')[0].split('=')[1];
  }
}

/**
 * Logs in into the instagram with given login and password
 * they should be set with env vars
 */
const login = (resp) => {
  let cookie = cookies.cookie(resp);
  let csrftoken = cookies.getCsrfToken(cookie);
  let mid = cookies.getMid(cookie);

  request.post(login_url,
  {
    form: { username: process.env.USERNAME,
            password: process.env.PASSWORD
          },
    headers: {
      'cookie': `fbm_124024574287414=base_domain=.instagram.com; mid=${mid}; s_network=""; ig_pr=2; ig_vw=1148; csrftoken=${csrftoken}`,
      'referer': 'https://www.instagram.com/',
      'x-csrftoken': csrftoken,
    }
  }, (err, resp, body) => {
    getUserLanding(resp, body);
  });
}

const getUserLanding = (resp, body) => {
    cookie = resp.headers['set-cookie'];
    console.log(cookie);
}

module.exports = {
  login: login
};
