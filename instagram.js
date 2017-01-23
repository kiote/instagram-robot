const request = require('request');
const cheerio = require('cheerio')

const main_page_url = 'https://www.instagram.com/';
const login_url = `${main_page_url}accounts/login/ajax/`;

const fbm = 'fbm_124024574287414';

const cookies = {
  cookie: (resp) => {
    return resp.headers['set-cookie'];
  },
  getToken: (cookie, position=1) => {
    return cookie[position].split(';')[0].split('=')[1];
  },
  getDsUserId: (sessionId) => {
    return sessionId.match(/auth_user_id%22%3A(\d+)/g)[0].slice(18,29)
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
    let cookie = cookies.cookie(resp);
    let csrftoken = cookies.getToken(cookie, 0);
    let sessionId = cookies.getToken(cookie, 1);
    let dsUserId = cookies.getDsUserId(sessionId);
    // console.log('cookie: ' + cookie);
    console.log('csrftoken: ' + csrftoken);
    console.log('sessionId: ' + sessionId);
    console.log('ds_user_id: ' + dsUserId);
    console.log('mid: ' + mid);

    request.get(main_page_url, {
      headers: {
        'cookie': 'cookie:fbm_124024574287414=base_domain=.instagram.com; mid=WBtkgQAEAAEf2AiyIhRubtq5C0RU; sessionid=IGSCc16606a4b0cf6d76b0a1793d1181aa8a76555b43c68976b3a5535d64551ba4d7%3ATLtx9DxgdAbaMJvhPNRIGIWqbxnWWBOe%3A%7B%22last_refreshed%22%3A1485104109.6280184%2C%22_auth_user_hash%22%3A%22%22%2C%22_auth_user_backend%22%3A%22accounts.backends.CaseInsensitiveModelBackend%22%2C%22_auth_user_id%22%3A7992144%2C%22_token%22%3A%227992144%3AC141uOGAkCtHbGHKp9CO95Kq2xtQTqRt%3Afe20673f94d8758ddc71d87079f08257ba1aede2fa9cdb22d6b72f625471ded8%22%2C%22_platform%22%3A4%2C%22_token_ver%22%3A2%2C%22asns%22%3A%7B%22time%22%3A1485104105%2C%2246.158.155.129%22%3A12389%7D%7D; s_network=""; ds_user_id=7992144; csrftoken=xh2j31OpaFcTlwVxLJ0tVea2E5qIgCac; ig_pr=2; ig_vw=1267'
      }
    }, (err, resp, body) => {
      console.log(body);
    })
}

module.exports = {
  login: login
};
