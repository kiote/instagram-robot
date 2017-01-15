const request = require('request');
const login_url = 'https://www.instagram.com/accounts/login/ajax/';

const getCookies = (resp) => {
  return resp.headers['set-cookie'];
}

const getCsrfToken = (cookie) => {
  return cookie[1].split(';')[0].split('=')[1];
}

const getMidCookie = (cookie) => {
  return cookie[2].split(';')[0].split('=')[1];
}

/**
 * Logs in into the instagram with given login and password
 * they should be set with env vars
 */
const login = (resp, callback) => {
  let cookie = getCookies(resp);
  let csrftoken = getCsrfToken(cookie);
  let mid = getMidCookie(cookie);

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
  }, callback);
}

// const getPosts

module.exports = {
  login: login,
};
