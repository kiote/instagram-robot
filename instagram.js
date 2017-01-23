const request = require('request');
const cheerio = require('cheerio');

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

    request.get(main_page_url + process.env.TARGET, {
      headers: {
        'cookie': `cookie:${fbm}=base_domain=.instagram.com; mid=${mid}; sessionid=${sessionId}; s_network=""; ds_user_id=${dsUserId}; csrftoken=${csrftoken}; ig_pr=2; ig_vw=1267`
      }
    }, (err, resp, body) => {
      const content = body.match(/window._sharedData = .*<\/script>/g);
      let shared_data = content[0].slice(21, 1000000);
      const json_end = ';'
      shared_data = shared_data.slice(0, shared_data.indexOf(json_end));
      console.log(shared_data);
    })
}

module.exports = {
  login: login
};
