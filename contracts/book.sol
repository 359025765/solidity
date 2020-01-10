pragma solidity >=0.4.21 <0.7.0;

contract Book {
    mapping(uint => string) books;
    event printBookName(string bookName);

    function registerBook(uint _bookId, string memory _bookName) public {
        books[_bookId] = _bookName;
        emit printBookName("Registered successfully!");
    }
    function getBook(uint _bookId) public view returns (string memory) {
        return books[_bookId];
    }
}
