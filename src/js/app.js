window.addEventListener('load', async () => {
// Modern dapp browsers...
  if (window.ethereum) {

    window.web3 = new Web3(ethereum);
    try {
      // Request account access if needed
      await ethereum.enable();
      console.log("injected");
      App.initAccount();


    } catch (error) {
      console.log("Please enable access to Metamask");
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    window.web3 = new Web3(web3.currentProvider);
    // Acccounts always exposed
    App.initAccount();

  }
  // Non-dapp browsers...
  else {
    console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
  }
});

App = {
  Web3Provider: null,
  contracts: {},

  initAccount: function() {

    App.web3Provider = web3.currentProvider;
    // Display current wallet
    console.log("initAccount called");

    web3.eth.getAccounts().then(function(result){

      return result[0];
      
    }).then(function(account) {
      

      document.getElementById("account").innerHTML = account;

      // Display current wallet ETH balance
      var accountWeiBalance = web3.eth.getBalance(account, function(error, result) {
        if (!error) {
          console.log(JSON.stringify(result));

          var accountBalance = web3.utils.fromWei(result, "ether");
          document.getElementById("account_balance").innerHTML = accountBalance;

        } else {
          console.log(error);
        }
      });
    })
    return App.initContract();
  },

   initContract: function() {
    $.getJSON('dividendToken.json', function(data) {
      //Get the necessary contract artifact file and instantiate it with truffle-contract
      var DividendTokenArtifact = data;
      App.contracts.DividendToken = TruffleContract(DividendTokenArtifact);

      // Set the provider for this contracts
      App.contracts.DividendToken.setProvider(App.web3Provider);


      return App.getTokenSupply();
    });

    return App.bindEvents();

  },

  bindEvents: function() {
    $(document).on('click', '.btn-mint-tokens', App.handleMintTokens);

  },

  handleMintTokens: function(event) {

    var dividendTokenInstance;

    web3.eth.getAccounts().then(function(accounts) {

      account = accounts[0];

      App.contracts.DividendToken.deployed().then(function(instance) {
        dividendTokenInstance = instance;

        return dividendTokenInstance.mint($("#mint-token-address").val(), $("#mint-token-amount").val(), {from: account});
      }).catch(function(err) {
        console.log(err.message);
      });
    });


  },

  getTokenSupply: function(tokenSupply) {

    var dividendTokenInstance;

    App.contracts.DividendToken.deployed().then(function(instance) {
      dividendTokenInstance = instance;

      return dividendTokenInstance.totalSupply();
    }).then(function(tokenSupply) {
      console.log("Token supply: " + tokenSupply);
      document.getElementById("token-supply").innerHTML = tokenSupply;
    }).catch(function(err){
      console.log(err.message);
    });

    return App.getUserTokenCount();
  },

  getUserTokenCount: function(userTokenCount) {
    var dividendTokenInstance;

    web3.eth.getAccounts().then(function(accounts) {
      account = accounts[0];
      App.contracts.DividendToken.deployed().then(function(instance) {
        dividendTokenInstance = instance;

        return dividendTokenInstance.balanceOf(account);
      }).then(function(userTokenCount) {
        console.log("Tokens held in this wallet: " + userTokenCount);
        document.getElementById("user-token-count").innerHTML = userTokenCount;
      }).catch(function(err){
        console.log(err.message);
      });

    });

    return App.getMinterDashboard();

  },

  getMinterDashboard: function(address) {
    var dividendTokenInstance;
  
    var mintButton = document.getElementById("btn-mint-tokens");
    mintButton.addEventListener("click", function() {
      return App.handleMintTokens();
    });

  }

};