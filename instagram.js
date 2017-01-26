const request = require('request');

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
};

/**
 * Logs in into the instagram with given login and password
 * they should be set with env vars
 */
const autoLike = (resp) => {
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
    saveLoginCookie(resp, body, mid, (body, credentials) => setLike(body, credentials));
  });
};

const saveLoginCookie = (resp, body, mid, callback) => {
    let cookie = cookies.cookie(resp);
    const credentials = {
      csrftoken: cookies.getToken(cookie, 0),
      sessionId: cookies.getToken(cookie, 1),
      dsUserId: cookies.getDsUserId(cookies.getToken(cookie, 1)),
      mid: mid
    };

    request.get(main_page_url + process.env.TARGET, {
      headers: {
        'cookie': `cookie:${fbm}=base_domain=.instagram.com; mid=${mid}; sessionid=${credentials.sessionId}; s_network=""; ds_user_id=${credentials.dsUserId}; csrftoken=${credentials.csrftoken}; ig_pr=2; ig_vw=1267`
      }
    }, (err, resp, body) => {
      callback(body, credentials);
    })
};

const setLike = (body, credentials) => {
  parseJSONfromTargetPage(body, (json_) => {
    for (let i=0; l=json_.length, i < l; i++) {
      request.post(`https://www.instagram.com/web/likes/${json_[i]['id']}/like/`, {
        headers: {
          'cookie': `cookie:${fbm}=base_domain=.instagram.com; mid=${credentials.mid}; sessionid=${credentials.sessionId}; s_network=""; ds_user_id=${credentials.dsUserId}; csrftoken=${credentials.csrftoken}; ig_pr=2; ig_vw=1267`,
          'referer': 'https://www.instagram.com/',
          'x-csrftoken': credentials.csrftoken,
        }
      }, (err, resp, body) => {
        console.log(body)
      });
    }
  });
};

const parseJSONfromTargetPage = (body, callback) => {
  const re = /window._sharedData = (.*);<\/script>/g
  const content = re.exec(body);
  const shared_data = content[1];
  json_ = JSON.parse(shared_data);
  callback(json_['entry_data']['ProfilePage'][0]['user']['media']['nodes']);
};

module.exports = {
  autoLike: autoLike
};
