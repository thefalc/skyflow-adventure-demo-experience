const {skyflowUtil} = require('../../util/skyflowUtil');
const {ironOptions} = require('../../util/ironOptions');
import { withIronSessionApiRoute } from 'iron-session/next';

const {
  SERVICE_ACCOUNT_FILE
} = require('../../util/config');

export default withIronSessionApiRoute(
  async function customersRoute(req, res) {
    console.log('here here here');
    const country = req.query.country;
    const redact = req.query.redact;

    let query = 'select skyflow_id, redaction(name, \'PLAIN_TEXT\'), redaction(phone_number, \'REDACT\'), redaction(date_of_birth, \'MASK\'), redaction(email, \'MASK\') from persons where country = \'' + country + '\' order by counter desc';
    if(redact === 'false') {
      query = 'select skyflow_id, redaction(name, \'PLAIN_TEXT\'), redaction(phone_number, \'PLAIN_TEXT\'), redaction(date_of_birth, \'PLAIN_TEXT\'), redaction(email, \'PLAIN_TEXT\') from persons where country = \'' + country + '\'  order by counter desc';
    }
    
    let persons = await skyflowUtil.executeQuery(query, []);

    res.send({ persons: persons });
  }, ironOptions,
);