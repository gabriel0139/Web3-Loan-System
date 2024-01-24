// My Code

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./AdminERC721.sol";

enum LoanState {
    Pending,
    Accepted,
    Denied
}

struct Loan {
    uint128 id;
    LoanState state;
    uint256 deadline;
    uint[][] details;
}

contract Y28 is AdminERC721 {
    uint128 private _pendingLoanCount;
    uint128 private _loanCount;
    mapping(uint128 => Loan) private _pendingLoans;
    mapping(uint256 => mapping(uint128 => Loan)) private _loans;
    mapping(uint256 => uint128[]) private _loanIdsByOwner;

    constructor(
        address initialOwner,
        string memory tokenUri
    ) AdminERC721(initialOwner, tokenUri, "Y-28", "Y28") {
        _pendingLoanCount = 0;
    }

    function pendingLoanCount() public view returns (uint128) {
        return _pendingLoanCount;
    }

    function safeMintAccessToken(address to) public {
        _safeMintAccessToken(to, getNextId());
    }

    function safeMintAdminAccessToken(address to) public onlyAdmin {
        _safeMintAdminAccessToken(to, getNextId());
    }

    function requestLoan(
        uint256 tokenId,
        uint128 loanId,
        uint256 deadline,
        uint[][] memory details
    ) public {
        require(
            ownerOf(tokenId) == _msgSender() || checkAdmin(_msgSender()),
            "unauthorized"
        );

        _loans[tokenId][loanId] = Loan(
            loanId,
            LoanState.Pending,
            deadline,
            details
        );

        _pendingLoans[loanId] = _loans[tokenId][loanId];
        _loanIdsByOwner[tokenId].push(loanId);
        _loanCount++;
        _pendingLoanCount++;
    }

    function updateLoanState(
        uint256 tokenId,
        uint128 loanId,
        LoanState state
    ) public onlyAdmin {
        _loans[tokenId][loanId].state = state;
        _pendingLoanCount--;
    }

    function getLoansIds(
        uint256 tokenId
    ) public view returns (uint128[] memory ids) {
        require(
            ownerOf(tokenId) == _msgSender() || checkAdmin(_msgSender()),
            "unauthorized"
        );

        return _loanIdsByOwner[tokenId];
    }

    function getLoanDetails(
        uint256 tokenId,
        uint128 loanId
    ) public view returns (Loan memory) {
        require(
            ownerOf(tokenId) == _msgSender() || checkAdmin(_msgSender()),
            "unauthorized"
        );

        return _loans[tokenId][loanId];
    }

    function getAllLoansByTokenId(
        uint256 tokenId
    ) public view returns (Loan[] memory) {
        uint128[] memory _tokenLoanIds = getLoansIds(tokenId);
        Loan[] memory _tokenLoans = new Loan[](_tokenLoanIds.length);
        uint8 _i = 0;

        do {
            _tokenLoans[_i] = getLoanDetails(tokenId, _tokenLoanIds[_i]);

            unchecked {
                ++_i;
            }
        } while (_i < _tokenLoanIds.length);

        return _tokenLoans;
    }

    function getAllLoans() public view onlyAdmin returns (Loan[] memory) {
        Loan[] memory _tokenLoans = new Loan[](_loanCount);
        uint256 userIndex = 1;
        uint256 totalIndex = 0;

        do {
            uint128[] storage userLoanIds = _loanIdsByOwner[userIndex];
            uint128 loanIndex = 0;

            do {
                // _tokenLoans[totalIndex] = getAllLoansByTokenId(userIndex);
                loanIndex += 1;
                totalIndex += 1;
            } while (loanIndex < userLoanIds.length);

            userIndex += 1;
        } while (userIndex < _length);

        return _tokenLoans;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
