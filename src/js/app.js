App = {
  web3Provider: null,
  contracts: {},
  account: "0x0",
  hasVoted: false,

  init: function () {
    return App.initWeb3();
  },

  initWeb3: function () {
    if (typeof web3 !== "undefined") {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new Web3.providers.HttpProvider(
        "http://localhost:7545"
      );
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function () {
    $.getJSON("Election.json", function (election) {
      App.contracts.Election = TruffleContract(election);
      App.contracts.Election.setProvider(App.web3Provider);
      App.listenForEvents();
      return App.render();
    });
  },

  listenForEvents: function () {
    App.contracts.Election.deployed().then(function (instance) {
      instance
        .voterCreated(
          {},
          {
            fromBlock: 0,
            toBlock: "latest",
          }
        )
        .watch(function (error, event) {
          console.log("event triggered", event);
          App.render();
        });
    });
  },

  render: function () {
    var electionInstance;
    var loader = $("#loader");
    var voterContent = $("#voterContent");

    loader.show();
    voterContent.hide();

    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    App.contracts.Election.deployed()
      .then(function (instance) {
        electionInstance = instance;
        return electionInstance.voterCount();
      })
      .then(function (voterCount) {
        var voterRegistered = $("#voterRegistered");
        voterRegistered.empty();

        for (var i = 1; i <= voterCount; i++) {
          electionInstance.voters(i).then(function (voter) {
            var name = voter[0];
            var voterId = voter[1];
            var accountAddress = voter[2];

            var voterTemplate =
              "<tr><td>" +
              name +
              "</td><td>" +
              voterId +
              "</td><td>" +
              accountAddress +
              "</td></tr>";
            voterRegistered.append(voterTemplate);
          });
        }
        return electionInstance.voters(App.account);
      });
    loader.hide();
    voterContent.show();
  },

  registerVoter: function () {
    var name = $("#input-name").val();
    var voterId = $("#input-voterId").val();
    App.contracts.Election.deployed()
      .then(function (instance) {
        return instance.registerVoter(name, voterId, { from: App.account });
      })
      .catch(function (err) {
        console.error(err);
      });
  },
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
