module.exports = function Cart(oldCart){
    //oldCart is the old cart and empty if it is new
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;
    this.discount = oldCart.discount || 0;
    this.discountCodeName = oldCart.discountCodeName || "";
    this.discountAmount = oldCart.discountAmount || 0;
    this.isDiscountPercent = oldCart.isDiscountPercent || false;
    this.totalPriceWDiscount = oldCart.totalPriceWDiscount || 0;
    //taxes
    this.tax = oldCart.tax || 0;
    //final price
    this.finalPrice = oldCart.finalPrice || 0;
    
    this.add = function(item, id){
        var storedItem = this.items[id];
        if (!storedItem){
            storedItem = this.items[id] = {item: item, qty: 0, price: 0};
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.price;
    };

    this.reduceByOne = function(id){
        this.items[id].qty--;
        this.items[id].price -= this.items[id].item.price;
        this.totalQty--;
        this.totalPrice -= this.items[id].item.price;

        if (this.items[id].qty <= 0 ){
            delete this.items[id];
        }
    };

    this.increaseByOne = function(id){
        this.items[id].qty++;
        this.items[id].price += this.items[id].item.price;
        this.totalQty++;
        this.totalPrice += this.items[id].item.price;
    };

    this.addDiscount = function(isPercent, discountAmount){
        if(isPercent){
            this.discount = this.totalPrice * (discountAmount / 100);
        } else{
            this.discount = discountAmount;
        }
    };

    this.addDiscountAmount = function(amount){
        this.discountAmount = amount
    };

    this.changeDiscountCodeName = function(codeName){
        this.discountCodeName = codeName;
    };

    this.changeIsDiscountPercent = function(trueOrFalse){
        this.isDiscountPercent = trueOrFalse;
    };

    this.changeTotalPriceWDiscount = function(value){
        this.totalPriceWDiscount = this.totalPrice - this.discount;
    }

    //add tax
    this.addTax = function(){
        if (this.totalPriceWDiscount == 0){
            this.tax = Math.round(this.totalPrice * 0.16);
        } else{
            this.tax = Math.round(this.totalPriceWDiscount * 0.16);
        }
    }

    //get final price
    this.getFinalPrice = function(){
        if (this.totalPriceWDiscount == 0){
            this.finalPrice = this.totalPrice + this.tax;
        } else{
            this.finalPrice = this.totalPriceWDiscount + this.tax;
        }
    }

    this.removeItem = function(id){
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    }

    //convert the object to an arrray
    this.generateArray = function(){
        var arr = [];
        for (var id in this.items){
            arr.push(this.items[id]);
        }
        return arr;
    }
};