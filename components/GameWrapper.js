import Layout from "./Layout";
import React, { Component } from "react";
import Terminal from '/react-console-emulator/Terminal';
import FadeIn from 'react-fade-in';
import 'bootstrap/dist/css/bootstrap.css';
import Constants from '/defs/Constants.js'

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
      sharedWithName: ''
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
      1: {
        description: 'Selection of Alderaan System or Luke Skywalker.',
        fn: function () {
          if(this.state.gameState === GAME_STATE_DEATH_STAR) {
            this.setState({ deathStarLocation: 'Alderaan System', gameState: GAME_STATE_UPLOAD });

            return Constants.R2_READY_PROMPT;
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

            return Constants.R2_READY_PROMPT;
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

            return Constants.R2_READY_PROMPT;
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

            return Constants.R2_READY_PROMPT;
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
            let text = Constants.VIEW_AS_LUKE_PROMPT.replace('%s', this.state.deathStarLocation).replace('%n', last4);
            terminal.pushToStdout(text);
          }
          else if(this.state.sharedWithName === 'Princess Leia') {
            let last4 = this.state.galacticId.substring(this.state.galacticId.length - 4);
            let text = Constants.VIEW_AS_LEIA_PROMPT.replace('%s', this.state.deathStarLocation).replace('%n', last4);
            terminal.pushToStdout(text);
          }
          else if(this.state.sharedWithName === 'Darth Vadar') {
            terminal.pushToStdout(Constants.VIEW_AS_DARTH_VADAR_PROMPT);
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

  showCongratsMessage() {
    const terminal = this.terminal.current;
    this.setState({ gameState: GAME_STATE_COMPLETE });
    if(this.state.sharedWithName === 'Luke Skywalker') {
      terminal.pushToStdout(Constants.CONGRATS_AS_LUKE_PROMPT);
    }
    else if(this.state.sharedWithName === 'Princess Leia') {
      terminal.pushToStdout(Constants.CONGRATS_AS_LEIA_PROMPT);
    }
    else if(this.state.sharedWithName === 'Darth Vadar') {
      terminal.pushToStdout(Constants.CONGRATS_AS_DARTH_VADAR_PROMPT);
    }
    else if(this.state.sharedWithName === 'Jar Jar Binks') {
      terminal.pushToStdout(Constants.CONGRATS_AS_JAR_JAR_PROMPT);
    } 
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

          let text = Constants.VIEW_MESSAGE_PROMPT.replace('%s', this.state.sharedWithName);
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
          terminal.pushToStdout(Constants.R2_UPGRADED_SEND_TRANSMISSION_PROMPT);
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
          if(this.state.progressState === 'Vault APIs') {
            clearInterval(interval);

            let priorText = this.state.priorText + `${this.state.progressState}: ${this.state.progress}% <span style="color: #3ED631">√</span><br/>`;
            this.setState({ progress: 0, progressState: '', progressText: '', priorText: priorText },
              () => terminal.pushToStdout(`${this.state.priorText}`));

            this.setState({ isProgressing: false, progress: 0, progressText: '', progressState: '', priorText: '' },
              () => terminal.pushToStdout(Constants.R2_UPGRADED_PROVIDE_NAME_PROMPT));
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
          return 'Sorry, please enter name &lt;first_name last_name&gt;.';
        }
        return false;
      }
      else {
        return 'Sorry, please enter name &lt;first_name last_name&gt;.';
      }
    }
    else if(gameState === GAME_STATE_GALACTIC_ID) {
      if(args !== undefined) {
        let args = [];
        let counter = 0;
        for (let prop in arguments) {
          if(counter++ > 1) args.push(arguments[prop]);
        }

        if(args.length !== 1 || args[0].length < 8 || command.toLocaleLowerCase() !== 'id') {
          return 'Sorry, please enter ID &lt;your 8 digit id&gt;.';
        }
        return false; 
      }
      else {
        return 'Sorry, please enter ID &lt;your 8 digit id&gt;.';
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

    return false;
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