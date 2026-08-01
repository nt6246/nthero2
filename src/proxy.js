const axios = require('axios');
const pick = require('lodash').pick;
const shouldCompress = require('./shouldCompress');
const redirect = require('./redirect');
const compress = require('./compress');
const bypass = require('./bypass');
const copyHeaders = require('./copyHeaders');

async function fetchWithHttpsFallback(url, config = {}) {
  try {
    const response = await axios.get(url, config);
    return response;
  
  } catch (error) {
    // console.warn(`HTTPS request failed: ${error.message}. Trying HTTP...`);

    if (!error.response) {
      return redirect(req, res);

    } else {
      // if (error.response.status == 404) {}

      const isHttp = /^http:\/\//;
      const isHttps = /^https:\/\//;
      let url2 = url;

      if (isHttp.test(url)) {
        // console.log(url.replace(/^http:\/\//, 'https://'));
        url2 = url.replace(/^http:\/\//, 'https://');
      }
      else if (isHttps.test(url)) {
        // console.log(url.replace(/^https:\/\//, 'http://'));
        url2 = url.replace(/^https:\/\//, 'http://');
      }

      try {
        const response = await axios.get(url2, config);
        return response;
      
      } catch (error2) {
        // console.error(`HTTP fallback also failed: ${error2.message}`);
        // throw new Error('Both HTTPS and HTTP requests failed.');
        return redirect(req, res);
      }
    }
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
