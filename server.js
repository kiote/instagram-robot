const request = require('request').defaults({jar: true});

const login_url = 'https://www.instagram.com/accounts/login/ajax/';
const url = 'https://www.instagram.com'

request.get(url, (e, resp, body) => {
  let cookie = resp.headers['set-cookie'];
  let csrftoken = cookie[1].split(';')[0].split('=')[1];
  let mid = cookie[2].split(';')[0].split('=')[1];
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
    },
    (err, resp, body) => {
      cookie = resp.headers['set-cookie'];
      console.log(cookie);
    });
})
