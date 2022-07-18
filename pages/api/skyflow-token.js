const { ironOptions } = require('../../util/ironOptions');
import { withIronSessionApiRoute } from 'iron-session/next';
const { generateBearerTokenFromCreds } = require('skyflow-node');

const {
  SERVICE_ACCOUNT_KEY
} = require('../../util/config');

export default withIronSessionApiRoute(
  async function handler(req, res) {
    let authToken = await generateBearerTokenFromCreds(SERVICE_ACCOUNT_KEY);

    res.send({ accessToken: authToken.accessToken });
  }, ironOptions,
);