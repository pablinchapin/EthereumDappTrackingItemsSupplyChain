// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within
// Declare a variable and assign the compiled smart contract artifact
const SupplyChain = artifacts.require('SupplyChain');

before(async() => {
    supplyChain = await SupplyChain.deployed();
});

contract('SupplyChain', function(accounts) {
    // Declare few constants and assign a few sample accounts generated by ganache-cli
    let sku = 1;
    let upc = 1;
    const ownerID = accounts[0];
    const originFarmerID = accounts[1];
    const originFarmName = "John Doe";
    const originFarmInformation = "Yarray Valley";
    const originFarmLatitude = "-38.239770";
    const originFarmLongitude = "144.341490";
    let productID = sku + upc;
    const productNotes = "Best beans for Espresso";
    const productPrice = web3.utils.toWei("1", "ether");
    let itemState = 0;
    const distributorID = accounts[2];
    const retailerID = accounts[3];
    const consumerID = accounts[4];
    const emptyAddress = "0x0000000000000000000000000000000000000000";
    
    ///Available Accounts
    ///==================
    ///(0) 0x27d8d15cbc94527cadf5ec14b69519ae23288b95
    ///(1) 0x018c2dabef4904ecbd7118350a0c54dbeae3549a
    ///(2) 0xce5144391b4ab80668965f2cc4f2cc102380ef0a
    ///(3) 0x460c31107dd048e34971e57da2f99f659add4f02
    ///(4) 0xd37b7b8c62be2fdde8daa9816483aebdbd356088
    ///(5) 0x27f184bdc0e7a931b507ddd689d76dba10514bcb
    ///(6) 0xfe0df793060c49edca5ac9c104dd8e3375349978
    ///(7) 0xbd58a85c96cc6727859d853086fe8560bc137632
    ///(8) 0xe07b5ee5f738b2f87f88b99aac9c64ff1e0c7917
    ///(9) 0xbd3ff2e3aded055244d66544c9c059fa0851da44

    console.log("ganache-cli accounts used here...");
    console.log("Contract Owner: accounts[0] ", accounts[0]);
    console.log("Farmer: accounts[1] ", accounts[1]);
    console.log("Distributor: accounts[2] ", accounts[2]);
    console.log("Retailer: accounts[3] ", accounts[3]);
    console.log("Consumer: accounts[4] ", accounts[4]);

    
    // 1st Test
    it("Testing smart contract function harvestItem() that allows a farmer to harvest coffee", async() => {
        
        await supplyChain.addFarmer(originFarmerID, {from: ownerID}); 
                
        // Declare and Initialize a variable for event
        let eventEmitted = false;
                             
        // Mark an item as Harvested by calling function harvestItem()
        let transaction = await supplyChain.harvestItem(upc, originFarmerID, originFarmName, originFarmInformation, originFarmLatitude, originFarmLongitude, productNotes, {from:originFarmerID});
        let transactionEvent = transaction.logs[0].event;

        // Watch the emitted event Harvested()
        if(transactionEvent == "Harvested"){
            eventEmitted = true; 
        }

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU');
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC');
        assert.equal(resultBufferOne[2], originFarmerID, 'Error: Missing or Invalid ownerID');
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID');
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName');
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation');
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude');
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude');
        assert.equal(resultBufferTwo[5], 0, 'Error: Invalid item State');
        assert.equal(resultBufferTwo[2], productID, 'Error: Invalid product id');
        assert.equal(resultBufferTwo[6], emptyAddress, 'Error: Missing or Invalid distributorID');
        assert.equal(resultBufferTwo[7], emptyAddress, 'Error: Missing or Invalid retailerID');
        assert.equal(resultBufferTwo[8], emptyAddress, 'Error: Missing or Invalid consumerID');
        assert.equal(eventEmitted, true, 'Invalid event emitted');
    });


    // 2nd Test
    it("Testing smart contract function processItem() that allows a farmer to process coffee", async() => {
        

        //validates if the farmer has been added
        if(!(await supplyChain.isFarmer(originFarmerID))){            
            await supplyChain.addFarmer(originFarmerID, {from: ownerID}); 
        }

        // Declare and Initialize a variable for event
        let eventEmitted = false;

        // Mark an item as Processed by calling function processtItem()
        let transaction = await supplyChain.processItem(upc, {from:originFarmerID}); 
        let transactionEvent = transaction.logs[0].event;  

        // Watch the emitted event Harvested()
        if(transactionEvent == "Processed"){
            eventEmitted = true; 
        } 

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU');
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC');
        assert.equal(resultBufferOne[2], originFarmerID, 'Error: Missing or Invalid ownerID');
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID');
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName');
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation');
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude');
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude');
        assert.equal(resultBufferTwo[5], 1, 'Error: Invalid item State');
        assert.equal(resultBufferTwo[2], productID, 'Error: Invalid product id');
        assert.equal(resultBufferTwo[6], emptyAddress, 'Error: Missing or Invalid distributorID');
        assert.equal(resultBufferTwo[7], emptyAddress, 'Error: Missing or Invalid retailerID');
        assert.equal(resultBufferTwo[8], emptyAddress, 'Error: Missing or Invalid consumerID');
        assert.equal(eventEmitted, true, 'Invalid event emitted');
        
    });   

    
    // 3rd Test
    it("Testing smart contract function packItem() that allows a farmer to pack coffee", async() => {
        
        //validates if the farmer has been added
        if(!(await supplyChain.isFarmer(originFarmerID))){            
            await supplyChain.addFarmer(originFarmerID, {from: ownerID}); 
        }

        // Declare and Initialize a variable for event
        let eventEmitted = false;

        // Mark an item as Packed by calling function packItem()
        let transaction = await supplyChain.packItem(upc, {from:originFarmerID}); 
        let transactionEvent = transaction.logs[0].event;  

        // Watch the emitted event Packed()
        if(transactionEvent == "Packed"){
            eventEmitted = true; 
        } 

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU');
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC');
        assert.equal(resultBufferOne[2], originFarmerID, 'Error: Missing or Invalid ownerID');
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID');
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName');
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation');
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude');
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude');
        assert.equal(resultBufferTwo[5], 2, 'Error: Invalid item State');
        assert.equal(resultBufferTwo[2], productID, 'Error: Invalid product id');
        assert.equal(resultBufferTwo[6], emptyAddress, 'Error: Missing or Invalid distributorID');
        assert.equal(resultBufferTwo[7], emptyAddress, 'Error: Missing or Invalid retailerID');
        assert.equal(resultBufferTwo[8], emptyAddress, 'Error: Missing or Invalid consumerID');
        assert.equal(eventEmitted, true, 'Invalid event emitted');
    });   

    
    // 4th Test
    it("Testing smart contract function sellItem() that allows a farmer to sell coffee", async() => {
        
        //validates if the farmer has been added
        if(!(await supplyChain.isFarmer(originFarmerID))){            
            await supplyChain.addFarmer(originFarmerID, {from: ownerID}); 
        }

        // Declare and Initialize a variable for event
        let eventEmitted = false;

        // Mark an item as ForSale by calling function sellItem()
        let transaction = await supplyChain.sellItem(upc, productPrice, {from:originFarmerID}); 
        let transactionEvent = transaction.logs[0].event;  

        // Watch the emitted event ForSale()
        if(transactionEvent == "ForSale"){
            eventEmitted = true; 
        } 

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU');
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC');
        assert.equal(resultBufferOne[2], originFarmerID, 'Error: Missing or Invalid ownerID');
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID');
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName');
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation');
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude');
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude');
        assert.equal(resultBufferTwo[5], 3, 'Error: Invalid item State');
        assert.equal(resultBufferTwo[2], productID, 'Error: Invalid product id');
        assert.equal(resultBufferTwo[6], emptyAddress, 'Error: Missing or Invalid distributorID');
        assert.equal(resultBufferTwo[7], emptyAddress, 'Error: Missing or Invalid retailerID');
        assert.equal(resultBufferTwo[8], emptyAddress, 'Error: Missing or Invalid consumerID');
        assert.equal(eventEmitted, true, 'Invalid event emitted');
    });   

    
    // 5th Test
    it("Testing smart contract function buyItem() that allows a distributor to buy coffee", async() => {
        
        //validates if the Distributor has been added
        if(!(await supplyChain.isDistributor(distributorID))){            
            await supplyChain.addDistributor(distributorID, {from: ownerID}); 
        }

        // Declare and Initialize a variable for event
        let eventEmitted = false;

        // Mark an item as Sold by calling function buyItem()
        let transaction = await supplyChain.buyItem(upc, {from:distributorID, value: web3.utils.toWei("1.5", "ether")});
        let transactionEvent = transaction.logs[0].event;

        // Watch the emitted event Sold()
        if(transactionEvent == "Sold"){
            eventEmitted = true;
        }

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU');
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC');
        assert.equal(resultBufferOne[2], distributorID, 'Error: Missing or Invalid ownerID');
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID');
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName');
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation');
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude');
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude');
        assert.equal(resultBufferTwo[5], 4, 'Error: Invalid item State');
        assert.equal(resultBufferTwo[2], productID, 'Error: Invalid product id');
        assert.equal(resultBufferTwo[6], distributorID, 'Error: Missing or Invalid distributorID');
        assert.equal(resultBufferTwo[7], emptyAddress, 'Error: Missing or Invalid retailerID');
        assert.equal(resultBufferTwo[8], emptyAddress, 'Error: Missing or Invalid consumerID');
        assert.equal(eventEmitted, true, 'Invalid event emitted');
    });   

    
    // 6th Test
    it("Testing smart contract function shipItem() that allows a distributor to ship coffee", async() => {
        
        
        //validates if the distributor has been added
        if(!(await supplyChain.isDistributor(distributorID))){            
            await supplyChain.addDistributor(distributorID, {from: ownerID}); 
        }

        // Declare and Initialize a variable for event
        let eventEmitted = false;

        // Mark an item as Shipped by calling function shipItem()
        let transaction = await supplyChain.shipItem(upc, {from:distributorID});
        let transactionEvent = transaction.logs[0].event;

        // Watch the emitted event Shipped()
        if(transactionEvent == "Shipped"){
            eventEmitted = true;
        }

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU');
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC');
        assert.equal(resultBufferOne[2], distributorID, 'Error: Missing or Invalid ownerID');
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID');
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName');
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation');
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude');
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude');
        assert.equal(resultBufferTwo[5], 5, 'Error: Invalid item State');
        assert.equal(resultBufferTwo[2], productID, 'Error: Invalid product id');
        assert.equal(resultBufferTwo[6], distributorID, 'Error: Missing or Invalid distributorID');
        assert.equal(resultBufferTwo[7], emptyAddress, 'Error: Missing or Invalid retailerID');
        assert.equal(resultBufferTwo[8], emptyAddress, 'Error: Missing or Invalid consumerID');
        assert.equal(eventEmitted, true, 'Invalid event emitted');
    });   

    
    // 7th Test
    it("Testing smart contract function receiveItem() that allows a retailer to mark coffee received", async() => {
        
        //validates if the retailer has been added
        if(!(await supplyChain.isRetailer(retailerID))){            
            await supplyChain.addRetailer(retailerID, {from: ownerID}); 
        }

        // Declare and Initialize a variable for event
        let eventEmitted = false;

        // Mark an item as Received by calling function receiveItem()
        let transaction = await supplyChain.receiveItem(upc, {from:retailerID});
        let transactionEvent = transaction.logs[0].event;

        // Watch the emitted event Received()
        if(transactionEvent == "Received"){
            eventEmitted = true;
        }

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU');
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC');
        assert.equal(resultBufferOne[2], retailerID, 'Error: Missing or Invalid ownerID');
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID');
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName');
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation');
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude');
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude');
        assert.equal(resultBufferTwo[5], 6, 'Error: Invalid item State');
        assert.equal(resultBufferTwo[2], productID, 'Error: Invalid product id');
        assert.equal(resultBufferTwo[6], distributorID, 'Error: Missing or Invalid distributorID');
        assert.equal(resultBufferTwo[7], retailerID, 'Error: Missing or Invalid retailerID');
        assert.equal(resultBufferTwo[8], emptyAddress, 'Error: Missing or Invalid consumerID');
        assert.equal(eventEmitted, true, 'Invalid event emitted');
    });

    
    // 8th Test
    it("Testing smart contract function purchaseItem() that allows a consumer to purchase coffee", async() => {
        
        //validates if the retailer has been added
        if(!(await supplyChain.isConsumer(consumerID))){            
            await supplyChain.addConsumer(consumerID, {from: ownerID}); 
        }

        // Declare and Initialize a variable for event
        let eventEmitted = false;

        // Mark an item as Received by calling function purchaseItem()
        let transaction = await supplyChain.purchaseItem(upc, {from:consumerID});
        let transactionEvent = transaction.logs[0].event;

        // Watch the emitted event Received()
        if(transactionEvent == "Purchased"){
            eventEmitted = true;
        }

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU');
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC');
        assert.equal(resultBufferOne[2], consumerID, 'Error: Missing or Invalid ownerID');
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID');
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName');
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation');
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude');
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude');
        assert.equal(resultBufferTwo[5], 7, 'Error: Invalid item State');
        assert.equal(resultBufferTwo[2], productID, 'Error: Invalid product id');
        assert.equal(resultBufferTwo[6], distributorID, 'Error: Missing or Invalid distributorID');
        assert.equal(resultBufferTwo[7], retailerID, 'Error: Missing or Invalid retailerID');
        assert.equal(resultBufferTwo[8], consumerID, 'Error: Missing or Invalid consumerID');
        assert.equal(eventEmitted, true, 'Invalid event emitted');
    });

    
    // 9th Test
    it("Testing smart contract function fetchItemBufferOne() that allows anyone to fetch item details from blockchain", async() => {
        
        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
        
        // Verify the result set:
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU');
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC');
        assert.equal(resultBufferOne[2], consumerID, 'Error: Missing or Invalid ownerID');
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID');
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName');
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation');
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude');
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude');
    });

    
    // 10th Test
    it("Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain", async() => {
        
        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);
        
        // Verify the result set:
        assert.equal(resultBufferTwo[0], sku, 'Error: Invalid item SKU');
        assert.equal(resultBufferTwo[1], upc, 'Error: Invalid item UPC');
        assert.equal(resultBufferTwo[2], productID, 'Error: Invalid product id');
        assert.equal(resultBufferTwo[3], productNotes, 'Error: Invalid product notes');
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Invalid product price');
        assert.equal(resultBufferTwo[5], 7, 'Error: Invalid item State');
        assert.equal(resultBufferTwo[6], distributorID, 'Error: Missing or Invalid distributorID');
        assert.equal(resultBufferTwo[7], retailerID, 'Error: Missing or Invalid retailerID');
        assert.equal(resultBufferTwo[8], consumerID, 'Error: Missing or Invalid consumerID');
    });

    
});