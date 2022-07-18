const {skyflowUtil} = require('../../util/skyflowUtil');
const {ironOptions} = require('../../util/ironOptions');
import { withIronSessionApiRoute } from 'iron-session/next';

const {
  SERVICE_ACCOUNT_FILE
} = require('../../util/config');

export default withIronSessionApiRoute(
  async function customersRoute(req, res) {
    const skyflowId = req.query.skyflowId;

    let tokens = await skyflowUtil.getTokens(skyflowId);

    res.send({ tokens: tokens });
  }, ironOptions,
);