pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

contract Election {
    address adminAddress;
    modifier onlyOwner() {
        require(
            msg.sender == adminAddress,
            "You dont have rights to perform this operation !"
        );
        _;
    }

    struct Voter {
        string name;
        uint256 voterId;
        address accountAddress;
        bool authorized;
        bool voted;
        bool exists;
    }

    mapping(uint256 => Voter) public voters;
    uint256 public voterCount = 0;

    struct Candidate {
        string name;
        string party;
        uint256 noOfVotes;
        bool exists;
    }

    mapping(uint256 => Candidate) public candidates;
    uint256 public candidateCount = 0;

    constructor() public {
        adminAddress = msg.sender;
    }

    function isAdmin() public view returns (bool) {
        return (msg.sender == adminAddress);
    }

    function registerVoter(string memory _name, uint256 _voterId)
        public
        returns (uint256)
    {
        address _accountAddress = msg.sender;
        require(
            _accountAddress != adminAddress,
            "You cannot use owner address to register."
        );
        require(
            checkIfAddressExist(_accountAddress),
            "This Account Address is already registered"
        );
        require(
            checkIfVoterIdExist(_voterId),
            "This Voter Id is already registered."
        );
        voterCount++;
        voters[voterCount] = Voter(
            _name,
            _voterId,
            _accountAddress,
            false,
            false,
            true
        );
        emit voterCreated(_name, _voterId, _accountAddress);
    }

    function registerCandidate(string memory _name, string memory _party)
        public
        onlyOwner
        returns (uint256)
    {
        require(checkIfPartyExist(_party), "This Party is already registered.");
        candidateCount++;
        candidates[candidateCount] = Candidate(_name, _party, 0, true);
        emit candidateCreated(_name, _party);
    }

    function vote(uint256 _voterId, uint256 _candidateId) public {
        require(
            !checkIfVoterIdExist(_voterId),
            "You are not registered to vote."
        );
        require(
            _candidateId > 0 && _candidateId <= candidateCount,
            "Candidate selection is invalid."
        );
        uint256 id = returnCount(_voterId);
        require(
            voters[id].accountAddress == msg.sender,
            "Please vote with registered Account Address."
        );
        // require(voters[id].authorized, "You are not authorize to vote.");
        require(!voters[id].voted, "You have already Voted.");
        candidates[_candidateId].noOfVotes++;
        voters[id].voted = true;
        emit voterVoted(_voterId, _candidateId);
    }

    function returnCount(uint256 _inputVoterId) private returns (uint256) {
        for (uint256 i = 1; i <= voterCount; i++) {
            uint256 idVoter = voters[i].voterId;
            if (
                keccak256(abi.encodePacked(idVoter)) ==
                keccak256(abi.encodePacked(_inputVoterId))
            ) {
                return i;
                break;
            }
        }
        return 0;
    }

    function checkIfVoterIdExist(uint256 _inputVoterId) private returns (bool) {
        for (uint256 i = 1; i <= voterCount; i++) {
            uint256 idVoter = voters[i].voterId;
            if (
                keccak256(abi.encodePacked(idVoter)) ==
                keccak256(abi.encodePacked(_inputVoterId))
            ) {
                return false;
                break;
            }
        }
        return true;
    }

    function checkIfAddressExist(address _inputAccountAddress)
        private
        returns (bool)
    {
        for (uint256 i = 1; i <= voterCount; i++) {
            address addressAccount = voters[i].accountAddress;
            if (
                keccak256(abi.encodePacked(addressAccount)) ==
                keccak256(abi.encodePacked(_inputAccountAddress))
            ) {
                return false;
                break;
            }
        }
        return true;
    }

    function checkIfPartyExist(string memory _inputParty)
        private
        returns (bool)
    {
        for (uint256 i = 1; i <= candidateCount; i++) {
            string memory partyName = candidates[i].party;
            if (
                keccak256(abi.encodePacked(partyName)) ==
                keccak256(abi.encodePacked(_inputParty))
            ) {
                return false;
                break;
            }
        }
        return true;
    }

    event voterCreated(string name, uint256 voterId, address accountAddress);
    event candidateCreated(string name, string party);
    event voterVoted(uint256 voterId, uint256 candidateId);
}
