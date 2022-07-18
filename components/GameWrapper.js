import Layout from "./Layout";
import React, { Component } from "react";
import Terminal from 'react-console-emulator';
import FadeIn from 'react-fade-in';
import 'bootstrap/dist/css/bootstrap.css';

const GAME_STATE_START = 'start';
const GAME_STATE_UPGRADE = 'upgrade';
const GAME_STATE_NAME = 'name';
const GAME_STATE_GALACTIC_ID = 'ID';
const GAME_STATE_DEATH_STAR = 'death star';
const GAME_STATE_UPLOAD = 'upload';
const GAME_STATE_SEND_TRANSMISSION = 'send';
const GAME_STATE_TRANSMISSION_SENT = 'sent';
const GAME_STATE_SHARE_VIEW = 'share view';
const GAME_STATE_COMPLETE = 'complete';

// Game prompts
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
  'name &lt;your name&gt;' +
  '</div>';

const R2_GREETING_PROMPT = 'R2 says, “BeeYoop BeeDeepBoom Weeop DEEpaEEya”, which means, “Nice to meet you ' +
  'and thanks for the data privacy vault upgrade!"<br/><br/>' +
  'The REBEL ALLIANCE will need to verify that the message is actually coming from you.<br/><br/>Please share your ' +
  '8 digit Galactic ID with R2. R2 will secure your ID within the vault, and then even your friends within the ' +
  'REBEL ALLIANCE will only be able to see the last few digits—a partially redacted version.<br/><br/>' +
  '<div style="width: 50%; border: 1px dashed #fff; padding: 10px;">' +
  'D &lt;your ID&gt;' +
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
  '<div style="width: 50%; border: 1px dashed #fff; padding: 10px;">' +
  'r - return to start<br/>' +
  's - share again<br/>' +
  '</div>';

const CONGRATS_AS_LEIA_PROMPT = 'Congratulations!<br/><br/>' +
  'Your brave and tireless efforts to securely share the location of the Death Star have been successful. ' +
  'Luke Skywalker and the rest of the REBEL ALLIANCE are on their way to destroy it and put a stop to the ' +
  'Empire once and for all.<br/><br/>' +
  '<img src="/static/images/death-star.png" /><br/><br/>' +
  '<div style="width: 50%; border: 1px dashed #fff; padding: 10px;">' +
  'r - return to start<br/>' +
  's - share again<br/>' +
  '</div>';

const CONGRATS_AS_DARTH_VADAR_PROMPT = 'Congratulations!<br/><br/>' +
  'Your brave and tireless efforts to securely share the location of the Death Star have been successful. ' +
  'Despite Darth Vadar\'s best attempts, even the force couldn\'t penetrate the security of R2\'s data privacy vault. ' +
  'The REBEL ALLIANCE are on their way to destroy the Death Star and put a stop to the ' +
  'Empire once and for all.<br/><br/>' +
  '<img src="/static/images/death-star.png" /><br/><br/>' +
  '<div style="width: 50%; border: 1px dashed #fff; padding: 10px;">' +
  'r - return to start<br/>' +
  's - share again<br/>' +
  '</div>';

const CONGRATS_AS_JAR_JAR_PROMPT = 'Congratulations!<br/><br/>' +
  'Your brave and tireless efforts to securely share the location of the Death Star have been successful. ' +
  'Even Jar Jar Bink\'s misguided and bumbling efforts to help didn\'t get in the way of your secure transmission. ' +
  'The REBEL ALLIANCE are on their way to destroy the Death Star and put a stop to the ' +
  'Empire once and for all.<br/><br/>' +
  '<img src="/static/images/death-star.png" /><br/><br/>' +
  '<div style="width: 50%; border: 1px dashed #fff; padding: 10px;">' +
  'r - return to start<br/>' +
  's - share again<br/>' +
  '</div>';

class GameWrapper extends Component {
  constructor(props) {
    super(props);

    this.terminal = React.createRef();
    this.progressTerminal = React.createRef();

    this.state = {
      gameState: GAME_STATE_START,
      locked: false,
      increment: 0,
      isProgressing: false,
      priorText: '',
      progress: 0,
      progressText: '',
      progressState: 'Encryption',
      playerName: '',
      galacticId: '',
      deathStarLocation: '',
      sharedWithName: ''
    }

    this.commands = {
      wait: {
        description: 'Waits one second and sends a message.',
        fn: () => {
          const terminal = this.terminal.current
          setTimeout(() => terminal.pushToStdout('Hello after 1 second!'), 1500)
          return 'Running, please wait...'
        }
      },
      danger: {
        description: 'This command returns HTML. It will only work with terminals that have danger mode enabled.',
        fn: () => 'I can<br/>use HTML in this<br/>and it will be parsed'
      },
      c: {
        description: 'Continues the game. Prompts to upgrade R2',
        fn: () => {
          if(this.state.gameState === GAME_STATE_START) {
            this.setState({ gameState: GAME_STATE_UPGRADE });
            return R2_UPGRADE_PROMPT;
          }
          else if(this.state.gameState === GAME_STATE_SHARE_VIEW) {
            const terminal = this.terminal.current;
            this.setState({ gameState: GAME_STATE_COMPLETE });
            if(this.state.sharedWithName === 'Luke Skywalker') {
              terminal.pushToStdout(CONGRATS_AS_LUKE_PROMPT);
            }
            else if(this.state.sharedWithName === 'Princess Leia') {
              terminal.pushToStdout(CONGRATS_AS_LEIA_PROMPT);
            }
            else if(this.state.sharedWithName === 'Darth Vadar') {
              terminal.pushToStdout(CONGRATS_AS_DARTH_VADAR_PROMPT);
            }
            else if(this.state.sharedWithName === 'Jar Jar Binks') {
              terminal.pushToStdout(CONGRATS_AS_JAR_JAR_PROMPT);
            } 
          }
        }
      },
      name: {
        description: 'Name passed as string.',
        usage: 'name <string>',
        fn: function () {
          this.setState({ playerName: `${Array.from(arguments).join(' ')}`, gameState: GAME_STATE_GALACTIC_ID });
          console.log(`name: ${Array.from(arguments).join(' ')}`);

          return R2_GREETING_PROMPT;
        }
      },
      id: {
        description: 'ID passed as string.',
        usage: 'ID <string>',
        fn: function () {
          this.setState({ galacticId: `${Array.from(arguments).join(' ')}`, gameState: GAME_STATE_DEATH_STAR });
          console.log(`ID: ${Array.from(arguments).join(' ')}`);

          return DEATH_STAR_LOCATION_PROMPT;
        }
      },
      1: {
        description: 'Selection of Alderaan System or Luke Skywalker.',
        fn: function () {
          if(this.state.gameState === GAME_STATE_DEATH_STAR) {
            this.setState({ deathStarLocation: 'Alderaan System', gameState: GAME_STATE_UPLOAD });

            return R2_READY_PROMPT;
          }
          else { // Share with Luke
            this.setState({ gameState: GAME_STATE_TRANSMISSION_SENT, sharedWithName: 'Luke Skywalker' });
            this.sendTransmission();
          }
        }
      },
      2: {
        description: 'Selection of Taroon System or Princess Leia.',
        fn: function () {
          if(this.state.gameState === GAME_STATE_DEATH_STAR) {
            this.setState({ deathStarLocation: 'Taroon System', gameState: GAME_STATE_UPLOAD });

            return R2_READY_PROMPT;
          }
          else { // Share with Leia
            this.setState({ gameState: GAME_STATE_TRANSMISSION_SENT, sharedWithName: 'Princess Leia' });
            this.sendTransmission();
          }
        }
      },
      3: {
        description: 'Selection of Hoth System or Darth Vadar.',
        fn: function () {
          if(this.state.gameState === GAME_STATE_DEATH_STAR) {
            this.setState({ deathStarLocation: 'Hoth System', gameState: GAME_STATE_UPLOAD });

            return R2_READY_PROMPT;
          }
          else { // Share with Darth Vadar
            this.setState({ gameState: GAME_STATE_TRANSMISSION_SENT, sharedWithName: 'Darth Vadar' });
            this.sendTransmission();
          }
        }
      },
      4: {
        description: 'Selection of Endor System or Jar Jar.',
        fn: function () {
          if(this.state.gameState === GAME_STATE_DEATH_STAR) {
            this.setState({ deathStarLocation: 'Endor System', gameState: GAME_STATE_UPLOAD });

            return R2_READY_PROMPT;
          }
          else { // Share with Jar Jar
            this.setState({ gameState: GAME_STATE_TRANSMISSION_SENT, sharedWithName: 'Jar Jar Binks' });
            this.sendTransmission();
          }
        }
      },
      async: {
        description: 'This command runs an asynchronous task.',
        fn: async () => {
          const asyncTask = async () => 'Hello from a promise!'
          const result = await asyncTask()
          return result
        }
      },
      delay: {
        description: 'Delays return of value by 1000 ms.',
        fn: () => {
          return new Promise(resolve => {
            setTimeout(() => resolve('Finished!'), 1000)
          })
        }
      },
      u: {
        description: 'Displays upgrade/upload counter.',
        fn: () => {
          if(this.state.gameState === GAME_STATE_UPGRADE) {
            this.setState({ gameState: GAME_STATE_NAME });
            this.upgradeR2();
          }
          else {
            // upload
            this.setState({ gameState: GAME_STATE_SEND_TRANSMISSION });
            this.uploadToR2();
          }

          return ''
        },
      },
      y: {
        description: 'View message as character.',
        fn: () => {
          const terminal = this.terminal.current;
          this.setState({ gameState: GAME_STATE_SHARE_VIEW });
          if(this.state.sharedWithName === 'Luke Skywalker') {
            let last4 = this.state.galacticId.substring(this.state.galacticId.length - 4);
            let text = VIEW_AS_LUKE_PROMPT.replace('%s', this.state.deathStarLocation).replace('%n', last4);
            terminal.pushToStdout(text);
          }
          else if(this.state.sharedWithName === 'Princess Leia') {
            let last4 = this.state.galacticId.substring(this.state.galacticId.length - 4);
            let text = VIEW_AS_LEIA_PROMPT.replace('%s', this.state.deathStarLocation).replace('%n', last4);
            terminal.pushToStdout(text);
          }
          else if(this.state.sharedWithName === 'Darth Vadar') {
            terminal.pushToStdout(VIEW_AS_DARTH_VADAR_PROMPT);
          }
          else if(this.state.sharedWithName === 'Jar Jar Binks') {
            terminal.pushToStdout(VIEW_AS_JAR_JAR_PROMPT);
          }
        }
      },
      s: {
        description: 'Prompt to share againt.',
        fn: () => {
          const terminal = this.terminal.current;
          terminal.pushToStdout(SHARE_AGAIN_PROMPT);

          return '';
        }
      }
    };
  }

  sendTransmission() {
    this.setState({ isProgressing: true, progressState: 'Sending' }, () => {
      const terminal = this.terminal.current

      const interval = setInterval(() => {
        if (this.state.progress === 100) { // Stop at 100%
          clearInterval(interval);

          let priorText = `<br/>${this.state.progressState}: ${this.state.progress}% <span style="color: #3ED631">√</span><br/>`;
          this.setState({ progress: 0, progressState: '', progressText: '', priorText: priorText },
            () => terminal.pushToStdout(`${this.state.priorText}`));
          this.setState({ isProgressing: false, progress: 0, progressText: '', progressState: '', priorText: '' });

          let text = VIEW_MESSAGE_PROMPT.replace('%s', this.state.sharedWithName);
          terminal.pushToStdout(text);
        } 
        else {
          this.setState({ progress: this.state.progress + 1, progressText: this.state.progressText },
            () => terminal.pushToStdout(`<br/>${this.state.progressState}: ${this.state.progress}%`))
        }
      }, 15)
    });
  }

  uploadToR2() {
    this.setState({ isProgressing: true, progressState: 'Uploading' }, () => {
      const terminal = this.terminal.current

      const interval = setInterval(() => {
        if (this.state.progress === 100) { // Stop at 100%
          clearInterval(interval);

          let priorText = `<br/>${this.state.progressState}: ${this.state.progress}% <span style="color: #3ED631">√</span><br/>`;
          this.setState({ progress: 0, progressState: '', progressText: '', priorText: priorText },
            () => terminal.pushToStdout(`${this.state.priorText}`));

          this.setState({ isProgressing: false, progress: 0, progressText: '', progressState: '', priorText: '' });
          terminal.pushToStdout(R2_UPGRADED_SEND_TRANSMISSION_PROMPT);
        } 
        else {
          this.setState({ progress: this.state.progress + 1, progressText: this.state.progressText },
            () => terminal.pushToStdout(`<br/>${this.state.progressState}: ${this.state.progress}%`))
        }
      }, 15)
    });
  }

  upgradeR2() {
    this.setState({ isProgressing: true, priorText: '<br/>' }, () => {
      const terminal = this.terminal.current

      const interval = setInterval(() => {
        if (this.state.progress === 100) { // Stop at 100%
          if(this.state.progressState === 'Vault APIs') {
            clearInterval(interval);

            let priorText = this.state.priorText + `${this.state.progressState}: ${this.state.progress}% <span style="color: #3ED631">√</span><br/>`;
            this.setState({ progress: 0, progressState: '', progressText: '', priorText: priorText },
              () => terminal.pushToStdout(`${this.state.priorText}`));

            this.setState({ isProgressing: false, progress: 0, progressText: '', progressState: '', priorText: '' },
              () => terminal.pushToStdout(R2_UPGRADED_PROVIDE_NAME_PROMPT));
          }
          else if(this.state.progressState === 'Encryption') {
            let priorText = this.state.priorText + `${this.state.progressState}: ${this.state.progress}% <span style="color: #3ED631">√</span><br/>`;
            this.setState({ progress: 0, progressState: 'Tokenization', progressText: '', priorText: priorText });
          }
          else if(this.state.progressState === 'Tokenization') {
            let priorText = this.state.priorText + `${this.state.progressState}: ${this.state.progress}% <span style="color: #3ED631">√</span><br/>`;
            this.setState({ progress: 0, progressState: 'Data Masking', progressText: '', priorText: priorText });
          }
          else if(this.state.progressState === 'Data Masking') {
            let priorText = this.state.priorText + `${this.state.progressState}: ${this.state.progress}% <span style="color: #3ED631">√</span><br/>`;
            this.setState({ progress: 0, progressState: 'Data Governance', progressText: '', priorText: priorText });
          }
          else if(this.state.progressState === 'Data Governance') {
            let priorText = this.state.priorText + `${this.state.progressState}: ${this.state.progress}% <span style="color: #3ED631">√</span><br/>`;
            this.setState({ progress: 0, progressState: 'Secure Sharing', progressText: '', priorText: priorText });
          }
          else if(this.state.progressState === 'Secure Sharing') {
            let priorText = this.state.priorText + `${this.state.progressState}: ${this.state.progress}% <span style="color: #3ED631">√</span><br>`;
            this.setState({ progress: 0, progressState: 'Vault APIs', progressText: '', priorText: priorText });
          }
        } 
        else {
          this.setState({ progress: this.state.progress + 1, progressText: this.state.progressText },
            () => terminal.pushToStdout(`${this.state.priorText}${this.state.progressState}: ${this.state.progress}%`))
        }
      }, 15)
    })
  }

  componentDidMount() {
    
  }

  render() {
    let titleString = `
 ___ _         __ _            
/ __| |___  _ / _| |_____ __ __
\\__ \\ / / || |  _| / _ \\ V  V /
|___/_\\_\\\\_, |_| |_\\___/\\_/\\_/ 
        |__/                  
  `;

    let subTitleString = `RISE OF THE DATA PRIVACY VAULT`;
  
    let welcomeMessage = ['Welcome to the REBEL ALLIANCE.',
    '&nbsp;',
    'The last several attempts to share the location of the Death Star were intercepted by the Empire when their agents hacked a Rebel droid. As the new Chief Communications Engineer for the REBEL ALLIANCE, it\'s now up to you to securely transmit the location of the Death Star so the rebel forces can mobilize and the Empire can be stopped once and for all.',
    '&nbsp;',
    '<div style="width: 50%; width: 50%; border: 1px dashed #fff; padding: 10px;">c - continue</div>',
  ];

    return (
      <Layout title="Rise of the Data Privacy Vault">
        <div className="container-fluid">
          <div class="row">
            <div class="col-md-12">
              <div class="stars"></div>
              <div class="twinkling"></div> 
              <div class="clouds"></div>
              <FadeIn transitionDuration="1000">
                <div class="body">
                  <pre className="text-center" style={{margin: "0 auto"}}>{titleString}</pre>
                  <p className="text-center" style={{margin: 0, padding: 0}}>{subTitleString}</p>

                  <Terminal
                    ref={this.terminal}
                    commands={this.commands}
                    welcomeMessage={welcomeMessage}
                    promptLabel={'comms@:~$'} // green: #3ED631, blue: rgb(0, 235, 255) ✔️
                    hidePromptWhenDisabled
                    disableOnProcess
                    dangerMode
                    ignoreCommandCase
                    disabled={this.state.isProgressing}
                    locked={this.state.isProgressing}
                    style={{ backgroundColor: 'transparent' }}
                    messageStyle={{ lineHeight: '15px' }}
                    contentStyle={{ color: '#FFFFFF', padding: '20px 10px', background: 'transparent', fontSize: '11px', lineHeight: '16px' }} // Text colour
                    promptLabelStyle={{ color: 'rgb(255, 208, 52)' }} // Prompt label colour
                    inputTextStyle={{ color: 'rgb(255, 208, 52)', fontSize: '11px', lineHeight: '16px' }} // Prompt text colour
                  /> 
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default GameWrapper;