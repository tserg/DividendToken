window.addEventListener('load', async () => {
// Modern dapp browsers...
  if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
          // Request account access if needed
          await ethereum.enable();
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
    var account = web3.eth.getAccounts[0];

    var accountInterval = setInterval(function() {
      if (web3.eth.getAccounts[0] !== account) {
        account = web3.eth.getAccounts[0];
        window.location.reload(true);
      }
    }, 100);

    document.getElementById("account").innerHTML = account;

    // Display current wallet ETH balance
    var accountWeiBalance = web3.eth.getBalance(account, function(error, result) {
      if (!error) {
        console.log(JSON.stringify(result));

        var accountBalance = web3.fromWei(result.toNumber(), "ether");
        document.getElementById("account_balance").innerHTML = accountBalance;

      } else {
        console.log(error);
      }
    });

    // Display status of current wallet i.e. admin privileges

    return App.initContract();
  },


  initContract: function() {
    $.getJSON('DividendToken.json', function(data) {
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

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.DividendToken.deployed().then(function(instance) {
        dividendTokenInstance = instance;

        return dividendTokenInstance.mint($("#mint-token-address").val(), $("#mint-token-amount").val());
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

    return App.getMinterDashboard();
  },


  getMinterDashboard: function(address) {
    var dividendTokenInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.DividendToken.deployed().then(function(instance) {
        dividendTokenInstance = instance;

        return dividendTokenInstance.owner.call();
      }).then(function(address) {

        if (account == address) {
          var minterDashboard = document.getElementById("minter-dashboard");
          minterDashboard.style.display = "block";

          // create title for contractOwnerDashboardAddAdmin

          var minterDashboardTitle = document.createElement("h3");
          minterDashboardTitle.innerHTML = "MInter Dashboard";

          minterDashboard.appendChild(minterDashboardTitle);

          // create div for inputting mint token function

          var minterDashboardMintToken = document.createElement("div");
          minterDashboardMintToken.class = "sub-dashboard";
          var minterDashboardMintTokenTitle = document.createElement("h4");
          minterDashboardMintTokenTitle.innerHTML = "Mint tokens";

          // create span for address field

          var minterDashboardMintTokenAddressArea = document.createElement("span");
          minterDashboardMintTokenAddressArea.innerHTML = "Address to mint: ";
          var minterDashboardMintTokenAddress= document.createElement("input");
          minterDashboardMintTokenAddress.type = "text";
          minterDashboardMintTokenAddress.size = "50";
          minterDashboardMintTokenAddress.setAttribute("id", "mint-token-address");

          // create span for tokens field

          var minterDashboardMintTokenNumberArea = document.createElement("span");
          minterDashboardMintTokenNumberArea.innerHTML = "Number of tokens to mint: ";
          var minterDashboardMintTokenNumber = document.createElement("input");
          minterDashboardMintTokenNumber.type = "text";
          minterDashboardMintTokenNumber.size = "50";
          minterDashboardMintTokenNumber.setAttribute("id", "mint-token-amount");

          // create span for button to mint tokens
          var minterDashboardMintTokenButtonPlaceholder = document.createElement("span");
          var minterDashboardMintTokenButton = document.createElement("button");
          minterDashboardMintTokenButton.type = "button";
          minterDashboardMintTokenButton.class = "btn-mint-tokens";
          minterDashboardMintTokenButton.innerHTML = "Mint";
          minterDashboardMintTokenButton.addEventListener("click", function() {
            return App.handleMintTokens();
          });



          // to append elements

          minterDashboardMintToken.appendChild(minterDashboardMintTokenTitle);

          minterDashboardMintTokenAddressArea.appendChild(minterDashboardMintTokenAddress);

          minterDashboardMintTokenNumberArea.appendChild(minterDashboardMintTokenNumber);

          minterDashboardMintTokenButtonPlaceholder.appendChild(minterDashboardMintTokenButton);

          minterDashboardMintToken.appendChild(minterDashboardMintTokenAddressArea);
          minterDashboardMintToken.appendChild(minterDashboardMintTokenNumberArea);
          minterDashboardMintToken.appendChild(minterDashboardMintTokenButtonPlaceholder);

                    
        }

      }).catch(function(err) {
        console.log(err.message);
      });
    });

  },


};