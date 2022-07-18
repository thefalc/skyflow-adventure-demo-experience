const { ironOptions } = require('../../util/ironOptions');
import { withIronSessionApiRoute } from 'iron-session/next';

export default withIronSessionApiRoute(
  async function handler(req, res) {
    res.send({ vaultId: process.env.VAULT_ID, vaultUrl: process.env.VAULT_PUBLIC_URL });
  }, ironOptions,
);
