const { ironOptions } = require('../../util/ironOptions');
import { withIronSessionApiRoute } from 'iron-session/next';
const { generateBearerTokenFromCreds } = require('skyflow-node');
import { readFileSync } from 'fs';
import path from 'path';

export default withIronSessionApiRoute(
  async function handler(req, res) {
    const file = path.join(process.cwd(), 'credentials', 'client-side-sdk.json');
    const credentialsJsonAsString = readFileSync(file, 'utf8');

    let authToken = await generateBearerTokenFromCreds(credentialsJsonAsString);

    res.send({ accessToken: authToken.accessToken }); 

    // res.send({auth: stringified});
  }, ironOptions,
);