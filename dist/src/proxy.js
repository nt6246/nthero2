const axios = require('axios');
const pick = require('lodash').pick;
const shouldCompress = require('./shouldCompress');
const redirect = require('./redirect');
const compress = require('./compress');
const bypass = require('./bypass');
const copyHeaders = require('./copyHeaders');

async function fetchWithHttpsFallback(url, config = {}) {
  try {
    return await axios.get(url, config);
  } catch (error) {
    if (!error.response) throw error;

    const isHttp = /^http:\/\//;
    const isHttps = /^https:\/\//;
    let url2 = url;

    if (isHttp.test(url)) {
      url2 = url.replace(/^http:\/\//, 'https://');
    } else if (isHttps.test(url)) {
      url2 = url.replace(/^https:\/\//, 'http://');
    }

    return await axios.get(url2, config);
  }
}

async function proxy(req, res) {
  try {
    const response = await fetchWithHttpsFallback(req.params.url,
    {
      headers: {...pick(req.headers, ['user-agent', 'cookie', 'dnt', 'referer'])},
      // timeout: 10000,
      timeout: 50000,
      // maxRedirects: 5,
      responseType: 'arraybuffer',
      maxRedirects: 3
    });

    copyHeaders(response, res);
    res.setHeader('content-encoding', 'identity');
    req.params.originType = response.headers['content-type'] || '';
    req.params.originSize = response.data.length;

    if (shouldCompress(req)) {
      compress(req, res, response.data);
    } else {
      bypass(req, res, response.data);
    }
  } catch (error) {
    // console.error('Error:', error.message);
    return redirect(req, res);
  }
}

module.exports = proxy;
