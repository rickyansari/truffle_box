import React, { Component } from 'react'
// import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import ProofOfExistance from '../build/contracts/ProofOfExistence4.json'
import getWeb3 from './utils/getWeb3'
import RaisedButton from 'material-ui/RaisedButton';
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
      storageValue: 0,
      web3: null
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.
    console.log("asidja")
    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract(this.updateInstance.bind(this))
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract(update) {
    const contract = require('truffle-contract')
    const proofOfExistance = contract(ProofOfExistance)
    proofOfExistance.setProvider(this.state.web3.currentProvider);
    var proofOfExistanceInstance;
    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      proofOfExistance.deployed().then((instance) => {
        proofOfExistanceInstance = instance;
        update(proofOfExistanceInstance);
        // Validate document.
        return proofOfExistanceInstance.notarize('s2adsd', {from: accounts[0]})
      }).then((result) => {
        // Get the value from the contract to prove it worked.
        var test = proofOfExistanceInstance.checkDocument('s3adsd').then((result)=>{
            console.log("response", result);
          })
        return test
      }).catch((error)=>{
        console.log("ERROR", error);
      })
    })
  }

  updateInstance(truffleInstance){
    this.setState({
      truffleInstance: truffleInstance
    });
  }

  test(){
    this.state.truffleInstance.checkDocument('s3adsd').then((response)=>{
      console.log("resdponse", response);
    })
  }

  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <nav className="navbar pure-menu pure-menu-horizontal">
              <a href="#" className="pure-menu-heading pure-menu-link">Truffle Box</a>
          </nav>
          <main className="container">
            <div className="pure-g">
              <div className="pure-u-1-1">
                <RaisedButton label="Default" style={{margin: 12}} onClick={this.test.bind(this)} />
                <h1>Good to Go!</h1>
                <p>Your Truffle Box is installed and ready.</p>
                <h2>Smart Contract Example</h2>
                <p>If your contracts compiled and migrated successfully, below will show a stored value of 5 (by default).</p>
                <p>Try changing the value stored on <strong>line 59</strong> of App.js.</p>
                <p>The stored value is: {this.state.storageValue}</p>
              </div>
            </div>
          </main>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App
