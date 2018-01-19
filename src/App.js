import React, { Component } from 'react'
// import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import DocumentVerification from '../build/contracts/DocumentVerification.json'
import getWeb3 from './utils/getWeb3'
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {orange500, blue500} from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      truffleInstance: null,
      web3: null,
      verify: false,
      check: false,
      verify_text:'',
      check_text:'',
      accounts: null,
      already_verified: false,
    }
  }

  componentWillMount() {
    /* Get network provider and web3 instance. */
    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })
      /* Instantiate contract once web3 provided. */
      this.instantiateContract(this.updateState.bind(this))
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract(setTruffleInstanceAndAccounts) {
    const contract = require('truffle-contract')
    const documentVerification = contract(DocumentVerification)
    documentVerification.setProvider(this.state.web3.currentProvider);

    // Get accounts and truffleInstance.
    this.state.web3.eth.getAccounts((error, accounts) => {
      documentVerification.deployed().then((instance) => {
        setTruffleInstanceAndAccounts({
          truffleInstance: instance,
          accounts: accounts
        })
      }).catch((error)=>{
        console.log("ERROR ", error);
      })
    })
  }

  updateState(data: Object){
    this.setState(data);
  }

  handleDocumentVerification(){
    var updateVerifacationStatus = this.updateState.bind(this);
    this.state.truffleInstance
      .verifyDocument(this.state.verify_text, {from: this.state.accounts[0]})
      .then((response) => {
        if(response.tx){
          updateVerifacationStatus({verify: true})
        }
      }).catch((err)=>{
        console.log("Error while verifing Document");
      })
  }

  handleDocumentChecking(updateState: Function = this.updateState.bind(this)){
    var updateDocumentStatus = this.updateState.bind(this);
    this.state.truffleInstance
      .checkDocument(this.state.check_text)
      .then((response) => {
        updateDocumentStatus({
          already_verified:response,
          check: true
        })
      })
      .catch(err => {
        console.log("Error while checking document");
      });
  }

  handleChange(event){
    var message_state =  event.target.name.substring(0, event.target.name.length-5)
    this.setState({
      [event.target.name]: event.target.value,
      [message_state]: false
    })
  }

  renderResponseMessage(name){
    var message;
    if(name === 'verify'){
      message = this.state.verify
                  ? "The Document Verified Successfully."
                  : "Unable to verify the Document.";
    }else{
      message = this.state.already_verified
                 ? "The Document is verified."
                 : "The Document need to be verified.";
    }

    if(this.state[name]){
      return(
        <div className="pure-u-1-1" style={{marginTop: 30}}>
          <h2 style={{marginLeft:10}}> {message} </h2>
        </div>
      )
    } else{
      return null
    }
  }

  renderTextInputAndButton(data: Object){
    return(
      <div className="pure-u-1-1" style={{marginTop: 30}}>
        <TextField
          name={data.name}
          floatingLabelText={data.text_input_label}
          floatingLabelStyle={{color: orange500}}
          floatingLabelFocusStyle={{color: blue500}}
          inputStyle={{color: blue500}}
          onChange={this.handleChange.bind(this)}
        />
        <RaisedButton label={data.button_label} style={{marginLeft:10}} onClick={this[data.onButtonClick].bind(this)} />
      </div>
    )
  }

  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Document Verification</a>
          </nav>
          <main className="container">
            <div className="pure-g row">
              {this.renderTextInputAndButton({
                button_label:'Verify',
                name:'verify_text',
                onButtonClick:'handleDocumentVerification'
                text_input_label:'Verify Document',
              })}
              {this.renderResponseMessage('verify')}
              {this.renderTextInputAndButton({
                button_label:'Check',
                name:'check_text',
                onButtonClick:'handleDocumentChecking'
                text_input_label:'Check Verified Document'
              })}
              {this.renderResponseMessage('check')}
            </div>
          </main>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App
