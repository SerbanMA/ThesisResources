// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract CorgiToken is ERC721, Ownable {

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

    event Transfered(address indexed _from);

    mapping(address => int256) private ranks; 

    uint256 tokenId;
    uint256 createFee = 0.01 ether;
    uint256 lvlUpFee = 0.001 ether;
    uint256 changeNameFee = 0.005 ether;
    uint256 feedFee = 0.001 ether;

    struct Corgi {
        uint256 id;
        uint256 dna;
        string name;
        uint8 level;
        uint8 rarity;
        uint8 damage;
        uint8 health;
        uint256 lastMeal;
        bool onMarket;
        uint256 price;
    }

    Corgi[] public corgis;

    // Helpers
    function _generateRandomNumber(uint256 _step, uint256 _limit) internal view returns(uint256) {
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender)));
        return (randomNumber / 100 * _step) % _limit;
    }

    function _generateRandomDNA() internal view returns(uint256) {
        uint256 step = 0;

        uint256 earing = _generateRandomNumber(++step, 5);
        uint256 background = _generateRandomNumber(++step, 5);
        uint256 elemental = _generateRandomNumber(++step, 4);
        uint256 weapon = _generateRandomNumber(++step, 3);
        uint256 armor = _generateRandomNumber(++step, 3);

        uint256 dna = earing * 10000 + 
                      background * 1000 + 
                      elemental * 100 + 
                      weapon * 10 + 
                      armor;

        for(uint256 i = 0; i < corgis.length; i++) {
            if (corgis[i].dna == dna) {
                return _generateRandomDNA();
            }
        }
        return dna;
    }

    function _sum(uint256 _number) internal pure returns(uint8){
        uint8 sum = 0;
        while (_number != 0) {
            sum += uint8(_number % 10);
            _number /= 10;
        }
        return sum;
    }

    // Creation
    function _createCorgi(string memory _name) internal {
        uint256 dna = _generateRandomDNA();
        uint8 rariry = _sum(dna);
        uint8 damage = uint8(_generateRandomNumber(6, 100));
        uint8 health = uint8(_generateRandomNumber(7, 100));
        Corgi memory corgi = Corgi(tokenId, dna, _name, 1, rariry, damage, health, block.timestamp, false, 0);
        corgis.push(corgi);
        _safeMint(msg.sender, tokenId);
        tokenId++;
    }

    function createRandomCorgi(string memory _name) public payable {
        require(msg.value >= createFee);
        _createCorgi(_name);
    }

    // Getters
    function getCorgis() public view returns(Corgi[] memory) {
        return corgis;
    }

    function getOwnerCorgis(address _owner) public view returns(Corgi[] memory) {
        Corgi[] memory ownerCorgis = new Corgi[](balanceOf(_owner));
        
        uint256 counter = 0;
        for(uint256 i = 0; i < corgis.length; i++) {
            if (ownerOf(i) == _owner) {
                ownerCorgis[counter++] =  corgis[i];
            }
        }

        return ownerCorgis;
    }

    // Interaction
    function levelUp(uint256 _id) public payable {
        require(ownerOf(_id) == msg.sender);
        require(msg.value >= lvlUpFee);
        Corgi storage corgi = corgis[_id];
        corgi.level++;
    }

    function setName(uint256 _id, string memory _name) public payable {
        require(ownerOf(_id) == msg.sender);
        require(msg.value >= changeNameFee);
        Corgi storage corgi = corgis[_id];
        corgi.name = _name;
    }

    function feed(uint256 _id) public payable {
        require(ownerOf(_id) == msg.sender);
        require(msg.value >= feedFee);
        Corgi storage corgi = corgis[_id];
        corgi.lastMeal = block.timestamp;
    }

    function transferTo(uint256 _id, address _to) public {
        require(ownerOf(_id) == msg.sender);
        require(msg.sender != _to);
        transferFrom(msg.sender, _to, _id);
    }

    // Market
    function sell(uint256 _id, uint256 _price) public {
        Corgi storage corgi = corgis[_id];
        corgi.price = _price;
        corgi.onMarket = true;
    }

    function buy(uint256 _id) public payable {
        Corgi storage corgi = corgis[_id];
        require(msg.value >= corgi.price);
        payable(ownerOf(_id)).transfer(msg.value);

        corgi.price = 0;
        corgi.onMarket = false;

        transferFrom(ownerOf(_id), msg.sender, _id);
    }

    function cancelOnMarket(uint256 _id) public {
        Corgi storage corgi = corgis[_id];
        corgi.price = 0;
        corgi.onMarket = false;
    }

    // Rank
    function setRank(address _owner, int256 _rank) public payable{
        ranks[_owner] += _rank;
        if(ranks[_owner] < 0)
            ranks[_owner] = 0;
         if (_rank > 0 ) {
            payable(_owner).transfer(msg.value * 2);
        }
    } 

    function getRank(address _owner) public view returns(int256) {
        return ranks[_owner];
    } 
}
