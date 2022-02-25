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

    function registerCandidate(string memory _name, string memory _party)
        public
        onlyOwner
        returns (uint256)
    {
        require(checkIfPartyExist(_party), "This Party is already registered.");
        candidateCount++;
        candidates[candidateCount] = Candidate(_name, _party, 0, true);
        emit CandidateCreated(_name, _party);
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

    event CandidateCreated(string name, string party);
}
