pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

contract Election {
    address adminAddress;
    modifier onlyOwner() {
        require(
            msg.sender == adminAddress,
            "You don't have rights to perform this operation !"
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

    constructor() public {
        adminAddress = msg.sender;
    }

    function registerVoter(string memory _name, uint256 _voterId)
        public
        returns (uint256)
    {
        address _accountAddress = msg.sender;
        require(
            adminAddress != _accountAddress,
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

    event voterCreated(string name, uint256 voterId, address accountAddress);
}
