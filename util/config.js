// Constants for making Skyflow API calls
const SKYFLOW_VAULT_URL = process.env.VAULT_URL;
const SKYFLOW_VAULT_ID = process.env.VAULT_ID;
const SKYFLOW_VAULT_API_URL = SKYFLOW_VAULT_URL + '/v1/vaults/' + SKYFLOW_VAULT_ID;
const SERVICE_ACCOUNT_KEY = process.env.SERVICE_ACCOUNT_KEY;

// Salt for hashing passwords before storing
const SALT = '78360d2453c2c27278b03ce7c2777a8e';

// Cookie configuration for iron-session
const COOKIE_NAME = 'data_residency_demo';
const COOKIE_PASSWORD = 'AYPd0WTUuXAhD0f4M8fgdDEXooQQKdiw';

module.exports = {
  SKYFLOW_VAULT_API_URL,
  SERVICE_ACCOUNT_KEY,
  SALT,
  COOKIE_NAME,
  COOKIE_PASSWORD
};