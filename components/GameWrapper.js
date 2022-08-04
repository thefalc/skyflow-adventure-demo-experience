import Layout from "./Layout";
import React, { Component } from "react";
import Terminal from '/react-console-emulator/Terminal';
import FadeIn from 'react-fade-in';
import 'bootstrap/dist/css/bootstrap.css';
import Constants from '/defs/Constants.js';
import Skyflow from 'skyflow-js';

async function getBearerToken() {
  return new Promise(async function(resolve, reject) {
    console.log('calling skyflow-token');
    const res = await fetch('/api/skyflow-token', {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'GET'
      }
    );
    
    const result = await res.json();

    resolve(result.accessToken);
  });
};

let skyflowClient = false;

// Various game states
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
      sharedWithName: '',
      contactEmail: ''
    }

    this.commands = {
      c: {
        description: 'Continues the game. Prompts to upgrade R2',
        fn: async () => {
          if(this.state.gameState === GAME_STATE_START) {
            this.setState({ gameState: GAME_STATE_UPGRADE });
            return Constants.R2_UPGRADE_PROMPT;
          }
          else if(this.state.gameState === GAME_STATE_SHARE_VIEW) {
            this.showCongratsMessage();
          }
        }
      },
      name: {
        description: 'Name passed as string.',
        usage: 'name <string>',
        fn: function () {
          this.setState({ playerName: `${Array.from(arguments).join(' ')}`, gameState: GAME_STATE_GALACTIC_ID });

          return Constants.R2_GREETING_PROMPT;
        }
      },
      id: {
        description: 'ID passed as string.',
        usage: 'ID <string>',
        fn: function () {
          this.setState({ galacticId: `${Array.from(arguments).join(' ')}`, gameState: GAME_STATE_DEATH_STAR });
          console.log(`ID: ${Array.from(arguments).join(' ')}`);

          return Constants.DEATH_STAR_LOCATION_PROMPT;
        }
      },
      email: {
        description: 'Email passed as string.',
        usage: 'email <string>',
        fn: async function () {
          await this.setState({ contactEmail: `${Array.from(arguments).join(' ')}`, gameState: GAME_STATE_SHARE_VIEW });

          this.saveContactInformation();

          return Constants.THANK_YOU_FOR_SHARING_PROMPT;
        }
      },
      1: {
        description: 'Selection of Alderaan System or Luke Skywalker.',
        fn: async function () {
          if(this.state.gameState === GAME_STATE_DEATH_STAR) {
            this.setState({ deathStarLocation: 'Alderaan System', gameState: GAME_STATE_UPLOAD });

            return Constants.R2_READY_PROMPT;
          }
          else { // Share with Luke
            await this.setState({ gameState: GAME_STATE_TRANSMISSION_SENT, sharedWithName: 'Luke Skywalker' });
            this.saveShare();
            this.sendTransmission();
          }
        }
      },
      2: {
        description: 'Selection of Taroon System or Princess Leia.',
        fn: async function () {
          if(this.state.gameState === GAME_STATE_DEATH_STAR) {
            this.setState({ deathStarLocation: 'Taroon System', gameState: GAME_STATE_UPLOAD });

            return Constants.R2_READY_PROMPT;
          }
          else { // Share with Leia
            await this.setState({ gameState: GAME_STATE_TRANSMISSION_SENT, sharedWithName: 'Princess Leia' });
            this.saveShare();
            this.sendTransmission();
          }
        }
      },
      3: {
        description: 'Selection of Hoth System or Darth Vadar.',
        fn: async function () {
          if(this.state.gameState === GAME_STATE_DEATH_STAR) {
            this.setState({ deathStarLocation: 'Hoth System', gameState: GAME_STATE_UPLOAD });

            return Constants.R2_READY_PROMPT;
          }
          else { // Share with Darth Vadar
            await this.setState({ gameState: GAME_STATE_TRANSMISSION_SENT, sharedWithName: 'Darth Vadar' });
            this.saveShare();
            this.sendTransmission();
          }
        }
      },
      4: {
        description: 'Selection of Endor System or Jar Jar.',
        fn: async function () {
          if(this.state.gameState === GAME_STATE_DEATH_STAR) {
            this.setState({ deathStarLocation: 'Endor System', gameState: GAME_STATE_UPLOAD });

            return Constants.R2_READY_PROMPT;
          }
          else { // Share with Jar Jar
            await this.setState({ gameState: GAME_STATE_TRANSMISSION_SENT, sharedWithName: 'Jar Jar Binks' });
            this.saveShare();
            this.sendTransmission();
          }
        }
      },
      u: {
        description: 'Displays upgrade/upload counter.',
        fn: () => {
          if(this.state.gameState === GAME_STATE_UPGRADE) {
            // upgrade R2
            this.saveUpgrade();
            this.setState({ gameState: GAME_STATE_NAME });
            this.upgradeR2();
          }
          else {
            // upload
            this.saveMessageToVault();
            this.setState({ gameState: GAME_STATE_SEND_TRANSMISSION });
            this.uploadToR2();
          }

          return ''
        },
      },
      y: {
        description: 'View message as character.',
        fn: async () => {
          const terminal = this.terminal.current;
          this.setState({ gameState: GAME_STATE_SHARE_VIEW });

          let record = await skyflowClient.getById({
            records: [
              {
                ids: [this.tokens.skyflow_id],
                table: 'messages',
                redaction: Skyflow.RedactionType.DEFAULT,
              }
            ],
          });

          if(this.state.sharedWithName === 'Luke Skywalker') {
            let maskedGalacticId = record.records[0].fields.galactic_id;
            let maskedName = record.records[0].fields.name;

            let text = Constants.VIEW_AS_LUKE_PROMPT.replace('%s', this.state.deathStarLocation).replace('%s', maskedName).replace('%n', maskedGalacticId);
            terminal.pushToStdout(text);
          }
          else if(this.state.sharedWithName === 'Princess Leia') {
            let maskedGalacticId = record.records[0].fields.galactic_id;
            let maskedName = record.records[0].fields.name;
            
            let text = Constants.VIEW_AS_LEIA_PROMPT.replace('%s', this.state.deathStarLocation).replace('%s', maskedName).replace('%n', maskedGalacticId);

            terminal.pushToStdout(text);
          }
          else if(this.state.sharedWithName === 'Darth Vadar') {
            let tokens = JSON.stringify(this.tokens, null, 2).replaceAll(' ', '&nbsp;');
            let text = Constants.VIEW_AS_DARTH_VADAR_PROMPT.replace('%s', tokens);

            terminal.pushToStdout(text);
          }
          else if(this.state.sharedWithName === 'Jar Jar Binks') {
            terminal.pushToStdout(Constants.VIEW_AS_JAR_JAR_PROMPT);
          }
        }
      },
      n: {
        description: 'Show Luke congrats message.',
        fn: () => {
          this.showCongratsMessage();

          return '';
        }
      },
      s: {
        description: 'Prompt to share again.',
        fn: () => {
          this.setState({ gameState: GAME_STATE_SEND_TRANSMISSION });
          const terminal = this.terminal.current;
          terminal.pushToStdout(Constants.SHARE_AGAIN_PROMPT);

          return '';
        }
      },
      r: {
        description: 'Returns game to the start.',
        fn: async () => {
          this.setState({ gameState: GAME_STATE_START, priorText: '',
            progressState: 'Encryption',
            playerName: '',
            galacticId: '',
            deathStarLocation: '',
            sharedWithName: '' });

          const terminal = this.terminal.current;
          await terminal.clearStdout();
          terminal.showWelcomeMessage();
        }
      }
    };
  }

  componentDidMount() {
    this.initVaultDetails();
  }

  async initVaultDetails() {
    const response = await fetch('/api/vault-details');
    const result = await response.json();

    this.vaultId = result.vaultId;
    this.vaultUrl = result.vaultUrl;

    skyflowClient = Skyflow.init({
      vaultID: this.vaultId,
      vaultURL: this.vaultUrl,
      getBearerToken: getBearerToken,
      options: {
        env: Skyflow.Env.DEV
      }
    });
  }

  showCongratsMessage() {
    const terminal = this.terminal.current;
    this.setState({ gameState: GAME_STATE_COMPLETE });
    let congratsMessage = '';
    if(this.state.sharedWithName === 'Luke Skywalker') {
      congratsMessage = Constants.CONGRATS_AS_LUKE_PROMPT;
    }
    else if(this.state.sharedWithName === 'Princess Leia') {
      congratsMessage = Constants.CONGRATS_AS_LEIA_PROMPT;
    }
    else if(this.state.sharedWithName === 'Darth Vadar') {
      congratsMessage = Constants.CONGRATS_AS_DARTH_VADAR_PROMPT;
    }
    else if(this.state.sharedWithName === 'Jar Jar Binks') {
      congratsMessage = Constants.CONGRATS_AS_JAR_JAR_PROMPT;
    }

    if(this.state.contactEmail.length > 0) {
      congratsMessage = congratsMessage.replace('email &lt;your email&gt;<br/>', '');
    }
    
    terminal.pushToStdout(congratsMessage);
  }

  sendTransmission() {
    this.setState({ isProgressing: true, progressState: 'Sending' }, () => {
      const terminal = this.terminal.current

      const interval = setInterval(() => {
        if (this.state.progress === 100) { // Stop at 100%
          clearInterval(interval);

          terminal.clearInput();
          terminal.scrollToBottom();
          terminal.focusTerminal();

          let priorText = `<br/>${this.state.progressState}: ${this.state.progress}% <span style="color: #3ED631">√</span><br/>`;
          this.setState({ progress: 0, progressState: '', progressText: '', priorText: priorText },
            () => terminal.pushToStdout(`${this.state.priorText}`));
          this.setState({ isProgressing: false, progress: 0, progressText: '', progressState: '', priorText: '' },
            () => {
              let text = Constants.VIEW_MESSAGE_PROMPT.replace('%s', this.state.sharedWithName);
              terminal.pushToStdout(text);

              terminal.clearInput();
              terminal.scrollToBottom();
              terminal.focusTerminal();
            });
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

          terminal.clearInput();
          terminal.scrollToBottom();
          terminal.focusTerminal();

          let priorText = `<br/>${this.state.progressState}: ${this.state.progress}% <span style="color: #3ED631">√</span><br/>`;
          this.setState({ progress: 0, progressState: '', progressText: '', priorText: priorText },
            () => {
              terminal.pushToStdout(`${this.state.priorText}`);

              terminal.clearInput();
              terminal.scrollToBottom();
              terminal.focusTerminal();
          });

          this.setState({ isProgressing: false, progress: 0, progressText: '', progressState: '', priorText: '' },
            () => {
              terminal.pushToStdout(Constants.R2_UPGRADED_SEND_TRANSMISSION_PROMPT);

              terminal.clearInput();
              terminal.scrollToBottom();
              terminal.focusTerminal();
            });
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

      terminal.scrollToBottom();

      const interval = setInterval(() => {
        if (this.state.progress === 100) { // Stop at 100%
          terminal.clearInput();
          terminal.scrollToBottom();
          terminal.focusTerminal();

          if(this.state.progressState === 'Vault APIs') {
            clearInterval(interval);

            let priorText = this.state.priorText + `${this.state.progressState}: ${this.state.progress}% <span style="color: #3ED631">√</span><br/>`;
            this.setState({ progress: 0, progressState: '', progressText: '', priorText: priorText },
              () => terminal.pushToStdout(`${this.state.priorText}`));

            this.setState({ isProgressing: false, progress: 0, progressText: '', progressState: '', priorText: '' },
              () => {
                terminal.pushToStdout(Constants.R2_UPGRADED_PROVIDE_NAME_PROMPT);

                terminal.clearInput();
                terminal.scrollToBottom();
                terminal.focusTerminal();
              });
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

  /**
   * Custom error handler for the terminal component. Need to factor in the game state when
   * deciding if a command should exist or not.
   * @param {string} command The entered command by a user.
   * @param {string} gameState The current state of the game.
    * @param {array} args The arguments for a command passed by a user.
   * @returns 
   */
  errorHandler(command, state, args) {
    const gameState = state.gameState;

    if(gameState === GAME_STATE_START) {
      if(command !== 'c') {
        return 'Please enter the letter c to begin your adventure.';
      }
      return false;
    }
    else if(gameState === GAME_STATE_SHARE_VIEW) {
      if(!['c', 's'].includes(command)) {
        return 'Please enter the letter c to continue your adventure or s to share again.';
      }
      return false;
    }
    else if(gameState === GAME_STATE_UPGRADE) {
        if(command !== 'u') {
          return 'Please enter the letter u to upgrade R2.';
        }
        return false;
    }
    else if(gameState === GAME_STATE_UPLOAD) {
        if(command !== 'u') {
          return 'Please enter the letter u to upload your transmission.';
        }
        return false;
    }
    else if(gameState === GAME_STATE_NAME) {
      if(args !== undefined) {
        let args = [];
        let counter = 0;
        for (let prop in arguments) {
          if(counter++ > 1) args.push(arguments[prop]);
        }

        if(args.length !== 2 || command.toLocaleLowerCase() !== 'name') {
          return 'Sorry, please enter name &lt;first_name last_name&gt;. For example: name Joe Smith';
        }
        return false;
      }
      else {
        return 'Sorry, please enter name &lt;first_name last_name&gt;. For example: name Joe Smith';
      }
    }
    else if(gameState === GAME_STATE_GALACTIC_ID) {
      if(args !== undefined) {
        let args = [];
        let counter = 0;
        for (let prop in arguments) {
          if(counter++ > 1) args.push(arguments[prop]);
        }

        if(args.length !== 1 || args[0].length < 8 || !(/^\d+$/.test(args[0]))
          || command.toLocaleLowerCase() !== 'id') {
          return 'Sorry, please enter ID &lt;your 8 digit id&gt;. For example: ID 12345678';
        }
        return false; 
      }
      else {
        return 'Sorry, please enter ID &lt;your 8 digit id&gt;. For example: ID 12345678';
      }
    }
    else if(gameState === GAME_STATE_DEATH_STAR) {
      if(!['1', '2', '3', '4'].includes(command)) {
        return 'Please choose either 1, 2, 3, or 4 to select the location of the Death Star.';
      }
      return false;
    }
    else if(gameState === GAME_STATE_SEND_TRANSMISSION) {
      if(!['1', '2', '3', '4'].includes(command)) {
        return 'Please choose either 1, 2, 3, or 4 to select who to transmit the message to.';
      }
      return false;
    }
    else if(gameState === GAME_STATE_TRANSMISSION_SENT) {
      if(!['y', 'n'].includes(command.toLocaleLowerCase())) {
        return 'Please enter y for yes to view the message or n for no to continue.';
      }
      return false;
    }
    else if(command.toLocaleLowerCase() === 's') {
      if(state.playerName.length === 0 || state.galacticId.length === 0
        || state.deathStarLocation.length === 0) {
        return 'Sorry, but this is an invalid command.';
      }
      return false;
    }
    else if(command.toLocaleLowerCase() === 'email') {
      if(args !== undefined) {
        let args = [];
        let counter = 0;
        for (let prop in arguments) {
          if(counter++ > 1) args.push(arguments[prop]);
        }

        if(args.length !== 1 || !(/^$|^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,})$/.test(args[0]))) {
          return 'Sorry, please enter email &lt;your email&gt;. For example: email joe@email.com';
        }
        return false; 
      }
      else {
        return 'Sorry, please enter email &lt;your email&gt;. For example: email joe@email.com';
      }
    }

    return false;
  }

  async saveMessageToVault() {
    let createdDate = new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString().split('.')[0];

    let response = await skyflowClient.insert({
      records: [
        {
          fields: {
            name: this.state.playerName,
            galactic_id: this.state.galacticId,
            death_star_location: this.state.deathStarLocation,
            created_date: createdDate
          },
          table: 'messages'
        }
      ]
    }, { tokens: true });

    this.tokens = response.records[0].fields;
  }

  async saveContactInformation() {
    let createdDate = new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString().split('.')[0];

    let response = await skyflowClient.insert({
      records: [
        {
          fields: {
            email: this.state.contactEmail,
            messages_skyflow_id: this.tokens.skyflow_id,
            created_date: createdDate
          },
          table: 'contacts'
        }
      ]
    });

    console.log(response);
  }

  async saveUpgrade() {
    let createdDate = new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString().split('.')[0];

    let response = await skyflowClient.insert({
      records: [
        {
          fields: {
            upgrade_date: createdDate
          },
          table: 'upgrades'
        }
      ]
    });
  }

  async saveShare() {
    let createdDate = new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString().split('.')[0];

    let response = await skyflowClient.insert({
      records: [
        {
          fields: {
            messages_skyflow_id: this.tokens.skyflow_id,
            shared_with_name: this.state.sharedWithName,
            created_date: createdDate
          },
          table: 'shares'
        }
      ]
    });
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
      '<div style="width: 50%; width: 50%; border: 1px dashed #fff; padding: 10px;">c - continue</div>'
  ];

    return (
      <Layout title="Rise of the Data Privacy Vault">
        <div className="container-fluid">
          <div class="row">
            <div class="col-md-12">
              <div class="stars"></div>
              <div class="twinkling"></div> 
              <div class="clouds"></div>
              <FadeIn transitionDuration="1500" delay="200">
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
                    viewState={this.state}
                    errorHandler={this.errorHandler}
                    autoFocus='true'
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