const {skyflowUtil} = require('../../util/skyflowUtil');
const {ironOptions} = require('../../util/ironOptions');
import { withIronSessionApiRoute } from 'iron-session/next';

const {
  SERVICE_ACCOUNT_FILE
} = require('../../util/config');

export default withIronSessionApiRoute(
  async function customerRoute(req, res) {
    const skyflowId = req.query.skyflowId;

    let query = 'select skyflow_id, redaction(name, \'PLAIN_TEXT\'), redaction(phone_number, \'REDACT\'), redaction(date_of_birth, \'MASK\'), redaction(email, \'MASK\') from persons where skyflow_id = \'' + skyflowId + '\'';

    let persons = await skyflowUtil.executeQuery(query, []);

    res.send({ person: persons[0] });
  }, ironOptions,
);