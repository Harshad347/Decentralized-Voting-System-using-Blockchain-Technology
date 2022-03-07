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
      return App.render();
    });
  },

  render: function () {
    var electionInstance;

    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    App.contracts.Election.deployed()
      .then(function (instance) {
        electionInstance = instance;
        return electionInstance;
      })
      .then(function () {
        electionInstance.candidateCount().then(function (candidateCount) {
          var candidateRegistered = $("#candidateRegistered");
          candidateRegistered.empty();

          for (var i = 1; i <= candidateCount; i++) {
            electionInstance.candidates(i).then(function (candidate) {
              var name = candidate[0];
              var party = candidate[1];
              var voteCount = candidate[2];

              var candidateTemplate =
                "<tr><td>" +
                name +
                "</td><td>" +
                party +
                "</td><td>" +
                voteCount +
                "</td></tr>";
              candidateRegistered.append(candidateTemplate);
            });
          }
          return electionInstance.candidates(App.account);
        });
        electionInstance.voterCount().then(function (voterCount) {
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
      });
  },

  registerVoter: function () {
    var vName = $("#input-vName").val();
    var voterId = $("#input-voterId").val();
    App.contracts.Election.deployed().then(function (instance) {
      return instance.registerVoter(vName, voterId, { from: App.account });
    });
  },

  registerCandidate: function () {
    var cName = $("#input-cName").val();
    var party = $("#input-party").val();
    App.contracts.Election.deployed().then(function (instance) {
      return instance.registerCandidate(cName, party, { from: App.account });
    });
  },

  vote: function () {
    var vVoterId = $("#input-vVoterId").val();
    var candidateId = $("#input-candidateId").val();
    App.contracts.Election.deployed().then(function (instance) {
      return instance.vote(vVoterId, candidateId, { from: App.account });
    });
  },
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
