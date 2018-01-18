import React, { Component } from 'react'
// import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import DocumentVerification from '../build/contracts/ProofOfExistence4.json'
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
      verified: false,
      checked: false,
      verify_text:'',
      check_text:'',
      accounts: null,
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.
    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })
      // Instantiate contract once web3 provided.
      this.instantiateContract(this.updateTruffleInstance.bind(this))
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract(updateTruffleInstance) {
    const contract = require('truffle-contract')
    const documentVerification = contract(DocumentVerification)
    documentVerification.setProvider(this.state.web3.currentProvider);
    var documentVerificationInstance;
    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      documentVerification.deployed().then((instance) => {
        documentVerificationInstance = instance;
        updateTruffleInstance(instance, accounts);
        // Validate document.
        var response = documentVerificationInstance.notarize('s2addsd', {from: accounts[0]})
                        .then((resp)=>{
                          console.log("response of verify Document call", resp);
                        })
        return response
      }).then((result) => {
        // Get the value from the contract to prove it worked.
        var test = documentVerificationInstance.checkDocument('s3adsd').then((result)=>{
            console.log("response", result);
          })
        return test
      }).catch((error)=>{
        console.log("ERROR", error);
      })
    })
  }

  updateTruffleInstance(truffleInstance, accounts){
    this.setState({
      truffleInstance: truffleInstance,
      accounts: accounts
    });
  }

  checkDocument(){
    this.state.truffleInstance.checkDocument(this.state.check_text).then((response)=>{
      console.log("resdponse", response);
    })
  }

  verifyDocument(){
    this.state.truffleInstance.notarize(this.state.verify_text,{from: this.state.accounts[0]}).then((response)=>{
      console.log("resdponse", response);
    })
  }

  handleChange(event){
    this.setState({[event.target.name]: event.target.value})
  }

  renderResponseMessage(name){
    if(this.state[name] && this.state[event.target.name]){
      return null
    } else{
      console.log("SDSD")
      return null
    }
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
              <div className="pure-u-1-1" style={{marginTop: 30}}>
                <TextField
                  name="verify_text"
                  floatingLabelText="Verify Document"
                  floatingLabelStyle={{color: orange500}}
                  floatingLabelFocusStyle={{color:blue500}}
                  onChange={this.handleChange.bind(this)}
                />
                <RaisedButton label="Verify" style={{marginLeft:10}} onClick={this.verifyDocument.bind(this)} />
              </div>
              {this.renderResponseMessage('verified')}
              <div className="pure-u-1-1" style={{marginTop: 30}}>
                <TextField
                  name='check_text'
                  floatingLabelText="Check Verified Document"
                  floatingLabelStyle={{color: orange500}}
                  floatingLabelFocusStyle={{color:blue500}}
                  onChange={this.handleChange.bind(this)}
                />
                <RaisedButton label="Check" style={{margin: 5}} onClick={this.checkDocument.bind(this)} />
              </div>
              {this.renderResponseMessage('checked')}
            </div>
          </main>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App
