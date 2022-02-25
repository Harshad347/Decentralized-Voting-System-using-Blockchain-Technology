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
        .candidateCreated(
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
    var candidateContent = $("#candidateContent");

    loader.show();
    candidateContent.hide();

    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    App.contracts.Election.deployed()
      .then(function (instance) {
        electionInstance = instance;
        return electionInstance.candidateCount();
      })
      .then(function (candidateCount) {
        var candidateRegistered = $("#candidateRegistered");
        candidateRegistered.empty();

        for (var i = 1; i <= candidateCount; i++) {
          electionInstance.candidates(i).then(function (candidate) {
            var name = candidate[0];
            var party = candidate[1];

            var candidateTemplate =
              "<tr><td>" + name + "</td><td>" + party + "</td></tr>";
            candidateRegistered.append(candidateTemplate);
          });
        }
        return electionInstance.candidates(App.account);
      });
    loader.hide();
    candidateContent.show();
  },

  registerCandidate: function () {
    var name = $("#input-name").val();
    var party = $("#input-party").val();
    App.contracts.Election.deployed()
      .then(function (instance) {
        return instance.registerCandidate(name, party, { from: App.account });
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
