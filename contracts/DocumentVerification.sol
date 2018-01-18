pragma solidity ^0.4.15;

// Proof of Existence contract, version 4
contract DocumentVerification {
  mapping (bytes32 => bool) private proofs;

  event LogDocumentProof(bytes32 document_hash);

  // store a proof of existence in the contract state
  function storeProof(bytes32 proof) public{
    proofs[proof] = true;
  }
  // calculate and store the proof for a document
  function verifyDocument(string document) public{
    var proof = proofFor(document);
    storeProof(proof);
    LogDocumentProof(proof);
  }
  // helper function to get a document's sha256
  function proofFor(string document)  public pure returns (bytes32) {
    return sha256(document);
  }
  // check if a document has been verified
  function checkDocument(string document) public constant returns (bool) {
    var proof = proofFor(document);
    return hasProof(proof);
  }
  // returns true if proof is stored
  function hasProof(bytes32 proof) public constant returns(bool) {
    return proofs[proof];
  }
}

