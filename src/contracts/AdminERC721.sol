// My Code

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "./Ownable.sol";
import "./ERC721/ERC721Enumerable.sol";
import "./ERC721/ERC721Metadata.sol";

abstract contract AdminERC721 is Ownable, ERC721Enumerable {
    uint256 internal _length;
    string private _tokenMetaUri;

    mapping(uint256 => bool) private _adminIds;

    error AdminInvalidOwner(address addr);
    error AlreadyOwner(address addr);
    error AdminUnauthorizedAccount(address addr);

    constructor(
        address initialAdmin,
        string memory tokenUri,
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) Ownable(initialAdmin) {
        if (initialAdmin == address(0)) {
            revert AdminInvalidOwner(address(0));
        }

        _length = uint256(0);
        _tokenMetaUri = tokenUri;
        _transferOwnership(initialAdmin);
        _safeMintAdminAccessToken(initialAdmin, 1);
    }

    function _safeMintAccessToken(address to, uint256 tokenId) internal {
        // require(balanceOf(to) == 0, "ERC721Adminable: Already has access token");

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, _tokenMetaUri);

        unchecked {
            _length++;
        }
    }

    function _safeMintAdminAccessToken(address to, uint256 tokenId) internal {
        _safeMintAccessToken(to, tokenId);
        _registerAdminId(tokenId);
    }

    function getNextId() public view returns (uint256) {
        return _length + 1;
    }

    modifier onlyAdmin() {
        if (checkAdmin(_msgSender()) == false) {
            revert AdminUnauthorizedAccount(_msgSender());
        }
        _;
    }

    function _registerAdminId(uint256 tokenId) private {
        _adminIds[tokenId] = true;
    }

    function checkAdmin(address sender) public view returns (bool) {
        return tokenOfOwnerByIndex(sender, 0) == 1;
    }
}
