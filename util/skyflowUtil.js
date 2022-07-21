const axios = require('axios');
const Qs = require('qs');

// Setup for the Skyflow Vault
const { Skyflow, generateBearerTokenFromCreds } = require('skyflow-node');

const {
  SKYFLOW_VAULT_API_URL,
  SERVICE_ACCOUNT_KEY
} = require('./config');

const skyflowUtil = {
  /**
   * Executes the passed in query against the Skyflow vault.
   * @param {string} query Valid Skyflow SQL query.
   * @param {array} params Request parameters.
   * @returns List of matching records.
   */
  executeQuery: async function(query, params) {
    if(typeof params === 'undefined') {
      params = [];
    }

    let queryURI = SKYFLOW_VAULT_API_URL + '/query';
    const response = await axios.post(queryURI, { query: query, params: params },
      { headers: await getRequestHeaders() });

    return response.data.records;
  },

  getTokens: async function(skyflowId) { 
    let customersURI = SKYFLOW_VAULT_API_URL + '/persons';

    try {
      let response = await axios.get(customersURI, {
        headers: await getRequestHeaders(),
        params: {
          tokenization: true,
          skyflow_ids: skyflowId
        }
      });

      response.data.records[0].fields.skyflow_id = skyflowId;
  
      return response.data.records;
    } catch(e) {
      console.log(e);
    }
    
  },

  listTokens: async function() { 
    let customersURI = SKYFLOW_VAULT_API_URL + '/persons';

    try {
      let response = await axios.get(customersURI, {
        headers: await getRequestHeaders(),
        params: {
          tokenization: false,
          fields: 'skyflow_id'
        }
      });

      let records = response.data.records;
      let skyfowIds = [];
      for(let i = 0; i < records.length; i++) {
        skyfowIds.push(records[i].fields.skyflow_id);
      }

      response = await axios.get(customersURI, {
        headers: await getRequestHeaders(),
        params: {
          tokenization: true,
          skyflow_ids: skyfowIds
        },
        paramsSerializer: function(params) {
          return Qs.stringify(params, { arrayFormat: 'repeat' });
        },
      });

      return response.data.records;
    } catch(e) {
      console.log(e.response);
    }
  },
}

/**
 * Generates standard request headers for API calls.
 * @returns Object structure for a valid API request header.
 */
async function getRequestHeaders() {
  let authToken = await generateBearerTokenFromCreds(SERVICE_ACCOUNT_KEY);
  let authBearerToken = authToken.accessToken;

  return {
    'Authorization': 'Bearer ' + authBearerToken,
    'Content-Type': 'application/json'
  };
}

module.exports = { skyflowUtil };