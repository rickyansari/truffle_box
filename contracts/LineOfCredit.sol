pragma solidity ^0.4.15;

contract LineOfCredit{

  address public buyer_bank;
  address public buyer;
  address public seller_bank;
  address public seller;
  bytes32 public deal_document_hash;
  string public status;
  event LogDocumentProof(bytes32 document_hash);
  event LogStatusChange(string new_status);

  /* Constructor function */
  function LineOfCredit() public{
    buyer_bank = msg.sender;
  }

  /* function modifier */
  modifier onlyBuyerBank(){
    require(msg.sender == buyer_bank);
    _;
  }

  modifier onlySeller(){
    require(msg.sender == seller);
    _;
  }

  modifier onlyBuyer(){
    require(msg.sender == buyer);
    _;
  }

  modifier onlySellerBank(){
    require(msg.sender == seller_bank);
    _;
  }

  /* only buyer bank can invoke this function*/
  function SubmitDeal(address buyer_address, address seller_address, string deal_document) public onlyBuyerBank {
    buyer = buyer_address;
    seller = seller_address;
    storeDealDocument(deal_document);
  }

  function addSellerBank(address seller_bank_addresss) public onlySeller{
    seller_bank = seller_bank_addresss;
  }

  function getProof(string document)  private pure returns (bytes32) {
    return sha256(document);
  }

  function storeDealDocument(string document)private{
    deal_document_hash = getProof(document);
    LogDocumentProof(deal_document_hash);
  }

  function updateStatus(string updated_status) public {
    if(compareStrings(updated_status, 'goods_dispatched')){
      goodsDispatched();
    }else if(compareStrings(updated_status, 'goods_received')){
      goodsReceived();
    }else if(compareStrings(updated_status, 'money_debited_from_buyer_account')){
      debitedMoney();
    }else if(compareStrings(updated_status, 'money_credited_to_seller_account')){
      creditedMoney();
    }
  }

  function compareStrings (string a, string b) private  pure returns (bool) {
      return keccak256(a) == keccak256(b);
   }

   function goodsDispatched() private onlySeller{
     status= "goods_dispatched";
     LogStatusChange(status);
   }

   function goodsReceived() private onlyBuyer{
      status = "goods_received";
      LogStatusChange(status);
   }

   function debitedMoney() private onlyBuyerBank{
      status = "amount_debited";
      LogStatusChange(status);
   }

   function creditedMoney() private onlySellerBank{
      status = "amount_credited";
      LogStatusChange(status);
   }
}
