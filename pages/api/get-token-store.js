const {skyflowUtil} = require('../../util/skyflowUtil');
const {ironOptions} = require('../../util/ironOptions');
import { withIronSessionApiRoute } from 'iron-session/next';

const {
  SERVICE_ACCOUNT_FILE
} = require('../../util/config');

export default withIronSessionApiRoute(
  async function customersRoute(req, res) {
    let tokens = await skyflowUtil.listTokens();

    res.send({ tokens: tokens });
  }, ironOptions,
);