const { generateBearerTokenFromCreds } = require('skyflow-node');
const {ironOptions} = require('../../util/ironOptions');
import { withIronSessionApiRoute } from 'iron-session/next';
const axios = require('axios');
const Qs = require('qs');
import { readFileSync } from 'fs';
import path from 'path';

const VAULT_URI = process.env.VAULT_URL + '/v1/vaults/' + process.env.VAULT_ID;

export default withIronSessionApiRoute(
  async function customersRoute(req, res) {
    const skyflowId = req.query.skyflowId;

    let shareCounts = await getShareCounts();
    let deathStarLocationCounts = await getDeathStarLocationCounts();
    let r2Upgrades = await getTotalR2Upgrades();
    let vaultRecord = false;
    
    if(skyflowId) {
      vaultRecord = await getRecordAsRebel(skyflowId);
    }

    res.send({ shareCounts: shareCounts, deathStarLocationCounts: deathStarLocationCounts,
      r2Upgrades: r2Upgrades, vaultRecord: vaultRecord });
  }, ironOptions,
);

async function getDeathStarLocationCounts() {
  let deathStarLocations = await listAllItems('messages', 'death_star_location');

  let deathStarLocationCounts = {
    'Alderaan System': 0,
    'Taroon System': 0,
    'Hoth System': 0,
    'Endor System': 0,
  }

  for(let i = 0; i < deathStarLocations.length; i++) {
    let deathStarLocation = deathStarLocations[i].fields.death_star_location;
    deathStarLocationCounts[deathStarLocation]++;
  }

  return deathStarLocationCounts;
}

async function getShareCounts() {
  let shares = await listAllItems('shares', 'shared_with_name');

  let shareCounts = {
    'Luke Skywalker': 0,
    'Princess Leia': 0,
    'Darth Vadar': 0,
    'Jar Jar Binks': 0,
  }

  for(let i = 0; i < shares.length; i++) {
    let shareName = shares[i].fields.shared_with_name;
    shareCounts[shareName]++;
  }

  return shareCounts;
}

async function listAllItems(tableName, columnName) {
  let items = await listItems(tableName, columnName, { limit: 25, offset: 0 });
  let offset = 25;

  let allItems = items;
  while(items.length > 0) {
    try {
      items = await listItems(tableName, columnName, { limit: 25, offset: offset });
    } catch(e) {
      items = [];
    }

    allItems = allItems.concat(items);

    offset += 25;
  }

  return allItems;
}

async function listItems(tableName, columnName, options) { 
  let itemsURI = VAULT_URI + '/' + tableName;

  const response = await axios.get(itemsURI, { headers: await getRequestHeaders(),
    params: {
      redaction: 'PLAIN_TEXT',
      limit: options.limit,
      offset: options.offset,
      fields: [columnName]
    },
    paramsSerializer: function(params) {
      return Qs.stringify(params, { arrayFormat: 'repeat' });
    },
  });

  return response.data.records;
}

async function getTotalR2Upgrades() {
  let query = 'select count(*) as r2upgrades from upgrades';

  let queryURI = VAULT_URI + '/query';
  const response = await axios.post(queryURI, { query: query },
    { headers: await getRequestHeaders() });

  return response.data.records[0].fields.r2upgrades;
}

async function getRecordAsRebel(skyflowId) {
  console.log('skyflowId: ' + skyflowId);
  let query = 'select skyflow_id, redaction(name, \'MASK\'), redaction(galactic_id, \'MASK\'), redaction(death_star_location, \'PLAIN_TEXT\') from messages where skyflow_id = \'' + skyflowId + '\'';

  let queryURI = VAULT_URI + '/query';
  const response = await axios.post(queryURI, { query: query },
    { headers: await getRequestHeaders() });
  
  return response.data.records[0];
}

async function getRequestHeaders() {
  const file = path.join(process.cwd(), 'credentials', 'analytics.json');
  const credentialsJsonAsString = readFileSync(file, 'utf8');
  let authToken = await generateBearerTokenFromCreds(credentialsJsonAsString);

  return {
    'Authorization': 'Bearer ' + authToken.accessToken,
    'Content-Type': 'application/json'
  };
}