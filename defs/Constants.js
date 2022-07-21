// Game prompts
const WELCOME_MESSAGE = 'Welcome to the REBEL ALLIANCE.<br/><br/>' +
  'The last several attempts to share the location of the Death Star were intercepted by the Empire ' +
  'when their agents hacked a Rebel droid. As the new Chief Communications Engineer for the REBEL ' +
  'ALLIANCE, it\'s now up to you to securely transmit the location of the Death Star so the rebel ' +
  'forces can mobilize and the Empire can be stopped once and for all.<br/><br/>' +
  '<div style="width: 50%; width: 50%; border: 1px dashed #fff; padding: 10px;">c - continue</div>';

const R2_UPGRADE_PROMPT = 'To prevent the Empire from compromising your transmission, you must first upgrade ' +
  'R2D2 with a new technology: the data privacy vault. The vault was developed by the rebel sympathizers Skyflow. ' +
  'It isolates and protects sensitive data, de-scoping your existing systems from the responsibilities of data ' +
  'security and compliance. In fact, it can even protect against the prying eyes of the Empire.<br/>' +
  '<img src="/static/images/r2d2.png" /><br/>' +
  '<div style="width: 50%; border: 1px dashed #fff; padding: 10px;">' +
  'u - upgrade now' +
  '</div>';

const R2_UPGRADED_PROVIDE_NAME_PROMPT = '<br/>R2 is now equipped with the latest data privacy vault from Skyflow. ' +
  'You\'re ready to inform the rebels about the location of the Death Star.<br/><br/>To begin, introduce yourself to ' +
  'R2 with the following command.<br/><br/>' +
  '<div style="width: 50%; border: 1px dashed #fff; padding: 10px;">' +
  'name &lt;first_name last_name&gt;' +
  '</div>';

const R2_GREETING_PROMPT = 'R2 says, “BeeYoop BeeDeepBoom Weeop DEEpaEEya”, which means, “Nice to meet you ' +
  'and thanks for the data privacy vault upgrade!"<br/><br/>' +
  'The REBEL ALLIANCE will need to verify that the message is actually coming from you.<br/><br/>Please share your ' +
  '8 digit Galactic ID with R2. R2 will secure your ID within the vault, and then even your friends within the ' +
  'REBEL ALLIANCE will only be able to see the last few digits—a partially redacted version.<br/><br/>' +
  '<div style="width: 50%; border: 1px dashed #fff; padding: 10px;">' +
  'ID &lt;your 8 digit ID&gt;' +
  '</div>';

const DEATH_STAR_LOCATION_PROMPT = 'Choosing from the menu below, which star system the Death Star is located in?<br/><br/>' +
  '<div style="width: 50%; border: 1px dashed #fff; padding: 10px;">' +
  '1 - The Alderaan System<br/>' +
  '2 - The Taroon System<br/>' +
  '3 - The Hoth System<br/>' +
  '4 - The Endor System<br/>' +
  '</div>';

const R2_READY_PROMPT = 'Ok, R2 is ready to securely upload the location of the Death Star to the vault.<br/><br/>' +
  '<div style="width: 50%; border: 1px dashed #fff; padding: 10px;">' +
  'u - upload now' +
  '</div>';

const R2_UPGRADED_SEND_TRANSMISSION_PROMPT = '<br/>Your data is now safe within the vault. ' +
  'R2 is ready to share tokenized forms of this data (the Death Star\'s location) with whoever you choose. ' +
  'Tokenization swaps sensitive data for non-sensitive tokens. Even if the Empire intercepts the tokens, ' +
  'they can\'t do anything with them without access to the vault.<br/><br/>' +
  'Who will you send your transmission to?<br/><br/>' +
  '<div style="width: 50%; border: 1px dashed #fff; padding: 10px;">' +
  '1 - Luke Skywalker<br/>' +
  '2 - Princess Leia Organa<br/>' +
  '3 - Darth Vadar<br/>' +
  '4 - Jar Jar Binks<br/>' +
  '</div>';

const VIEW_MESSAGE_PROMPT = '<br/>Would you like to view the message as %s will see it?<br/><br/>' +
  '<div style="width: 50%; border: 1px dashed #fff; padding: 10px;">' +
  'y - yes<br/>' +
  'n - no<br/>' +
  '</div>';

const VIEW_AS_LUKE_PROMPT = 'Luke, the Death Star is located within %s.<br/><br/>' +
  'Secure transmission from Sean F****r, Galactic ID: XXXX XXXX %n.<br/><br/>' +
  '<div style="width: 50%; border: 1px dashed #fff; padding: 10px;">' +
  'c - continue<br/>' +
  's - share again<br/>' +
  '</div>';

const VIEW_AS_LEIA_PROMPT = 'Princess, the Death Star is located within %s.<br/><br/>' +
  'Secure transmission from Sean F****r, Galactic ID: XXXX XXXX %n.<br/><br/>' +
  '<div style="width: 50%; border: 1px dashed #fff; padding: 10px;">' +
  'c - continue<br/>' +
  's - share again<br/>' +
  '</div>';

const VIEW_AS_DARTH_VADAR_PROMPT = 'Message transmission:<br/><br/>' +
  '{<br/>' +
  '&nbsp;&nbsp;&nbsp;&nbsp;"tokens": [<br/>' +
  '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ "token": "7afd3186-369f-4898-ac93-3a4e732ebf7c" },<br/>' +
  '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ "token": "c9f8676b-e4f4-4b40-bd20-3b3e640d4c9a" },<br/>' +
  '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ "token": "9a6e2a46-bafd-472c-a63b-400f64931dd1" }<br/>' +
  '&nbsp;&nbsp;&nbsp;&nbsp;]<br/>' +
  '}<br/><br/>' +
  'Nice try Vadar, even the Force won\'t work this time!<br/><br/>' +
  '<div style="width: 50%; border: 1px dashed #fff; padding: 10px;">' +
  'c - continue<br/>' +
  's - share again<br/>' +
  '</div>';

const VIEW_AS_JAR_JAR_PROMPT = '**REDACTED**<br/><br/>No one trusts or likes you.<br/><br/>' +
  '<div style="width: 50%; border: 1px dashed #fff; padding: 10px;">' +
  'c - continue<br/>' +
  's - share again<br/>' +
  '</div>';

const SHARE_AGAIN_PROMPT = 'Who will you send your transmission to?<br/><br/>' +
  '<div style="width: 50%; border: 1px dashed #fff; padding: 10px;">' +
  '1 - Luke Skywalker<br/>' +
  '2 - Princess Leia Organa<br/>' +
  '3 - Darth Vadar<br/>' +
  '4 - Jar Jar Binks<br/>' +
  '</div>';

const CONGRATS_AS_LUKE_PROMPT = 'Congratulations!<br/><br/>' +
  'Your brave and tireless efforts to securely share the location of the Death Star have been successful. ' +
  'Luke Skywalker and the rest of the REBEL ALLIANCE are on their way to destroy it and put a stop to the ' +
  'Empire once and for all.<br/><br/>' +
  '<img src="/static/images/death-star.png" /><br/><br/>' +
  'If you enjoyed that experience, please share your email to learn more.<br/><br/>' +
  '<div style="width: 50%; border: 1px dashed #fff; padding: 10px;">' +
  'email &lt;your email&gt;<br/>' +
  'r - return to start<br/>' +
  's - share again<br/>' +
  '</div>';

const CONGRATS_AS_LEIA_PROMPT = 'Congratulations!<br/><br/>' +
  'Your brave and tireless efforts to securely share the location of the Death Star have been successful. ' +
  'Luke Skywalker and the rest of the REBEL ALLIANCE are on their way to destroy it and put a stop to the ' +
  'Empire once and for all.<br/><br/>' +
  '<img src="/static/images/death-star.png" /><br/><br/>' +
  'If you enjoyed that experience, please share your email to learn more.<br/><br/>' +
  '<div style="width: 50%; border: 1px dashed #fff; padding: 10px;">' +
  'email &lt;your email&gt;<br/>' +
  'r - return to start<br/>' +
  's - share again<br/>' +
  '</div>';

const CONGRATS_AS_DARTH_VADAR_PROMPT = 'Congratulations!<br/><br/>' +
  'Your brave and tireless efforts to securely share the location of the Death Star have been successful. ' +
  'Despite Darth Vadar\'s best attempts, even the force couldn\'t penetrate the security of R2\'s data privacy vault. ' +
  'The REBEL ALLIANCE are on their way to destroy the Death Star and put a stop to the ' +
  'Empire once and for all.<br/><br/>' +
  '<img src="/static/images/death-star.png" /><br/><br/>' +
  'If you enjoyed that experience, please share your email to learn more.<br/><br/>' +
  '<div style="width: 50%; border: 1px dashed #fff; padding: 10px;">' +
  'email &lt;your email&gt;<br/>' +
  'r - return to start<br/>' +
  's - share again<br/>' +
  '</div>';

const CONGRATS_AS_JAR_JAR_PROMPT = 'Congratulations!<br/><br/>' +
  'Your brave and tireless efforts to securely share the location of the Death Star have been successful. ' +
  'Even Jar Jar Bink\'s misguided and bumbling efforts to help didn\'t get in the way of your secure transmission. ' +
  'The REBEL ALLIANCE are on their way to destroy the Death Star and put a stop to the ' +
  'Empire once and for all.<br/><br/>' +
  '<img src="/static/images/death-star.png" /><br/><br/>' +
  'If you enjoyed that experience, please share your email to learn more.<br/><br/>' +
  '<div style="width: 50%; border: 1px dashed #fff; padding: 10px;">' +
  'email &lt;your email&gt;<br/>' +
  'r - return to start<br/>' +
  's - share again<br/>' +
  '</div>';

const THANK_YOU_FOR_SHARING_PROMPT = 'We\'re glad you enjoyed battling the Empire and learning ' +
  'about data privacy vaults.<br/><br/>' +
  'Thank your for sharing your email. We will send you more information about Skyflow. Don\'t worry ' +
  'these emails will only be occassional and you can unsubscribe at any point.<br/><br/>' +
  '<div style="width: 50%; border: 1px dashed #fff; padding: 10px;">' +
  'r - return to start<br/>' +
  's - share again<br/>' +
  '</div>';

  export default {
    R2_UPGRADE_PROMPT,
    R2_UPGRADED_PROVIDE_NAME_PROMPT,
    R2_GREETING_PROMPT,
    DEATH_STAR_LOCATION_PROMPT,
    R2_READY_PROMPT,
    R2_UPGRADED_SEND_TRANSMISSION_PROMPT,
    VIEW_MESSAGE_PROMPT,
    VIEW_AS_LUKE_PROMPT,
    VIEW_AS_LEIA_PROMPT,
    VIEW_AS_DARTH_VADAR_PROMPT,
    VIEW_AS_JAR_JAR_PROMPT,
    SHARE_AGAIN_PROMPT,
    CONGRATS_AS_LUKE_PROMPT,
    CONGRATS_AS_LEIA_PROMPT,
    CONGRATS_AS_DARTH_VADAR_PROMPT,
    CONGRATS_AS_JAR_JAR_PROMPT,
    THANK_YOU_FOR_SHARING_PROMPT
  }