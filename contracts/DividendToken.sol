pragma solidity ^0.5.0; 

import "./ERC20Mintable.sol";
import "./math/SafeMath.sol";

contract dividendToken is ERC20Mintable {

	using SafeMath for uint256;

	uint256 public totalDividends;

	mapping (address => uint256) lastDividends;

	function () external payable {
		totalDividends = totalDividends.add(msg.value);
	}

	function payToContract() external payable {
		totalDividends = totalDividends.add(msg.value);
	}

	function dividendBalanceOf(address account) public view returns (uint256) {
		uint256 newDividends = totalDividends.sub(lastDividends[account]);
		uint256 product = balanceOf(msg.sender).mul(newDividends);

		return product.div(totalSupply());
	}

	function claimDividend() public {
		uint256 owing = dividendBalanceOf(msg.sender);
		if (owing>0) {
			msg.sender.transfer(owing);
			lastDividends[msg.sender] = totalDividends;
		}
	}

}