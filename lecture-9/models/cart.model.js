const fs = require('fs');
const path = require('path');
const { callbackify } = require('util');

const p = path.join(require.main.path,'data','cart.json');

module.exports = class Cart{
    static addProduct(id, productPrice){
        //fetch the previous cart
        fs.readFile(p, (err , filecontent) => {
            let cart = {products: [], totalPrice: 0};
            if(!err){
                cart = JSON.parse(filecontent);
            }
            //find the existing product
            const existingProductIndex = cart.products.findIndex(p => p.id == id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            if(existingProduct){
                updatedProduct = {...existingProduct};
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products[existingProductIndex] = updatedProduct;
            }else{
                updatedProduct = {id: id, qty: 1}
                cart.products = [...cart.products, updatedProduct]
            }
            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            })
        });
    }

    static deleteProduct(id, productPrice){
        fs.readFile(p, (err, filecontent)=>{
            if(err){
                return
            }
            const updatedCart = {...JSON.parse(filecontent)};
            const product = updatedCart.products.find(prod => prod.id == id);
            if(product){
                const productQty = product.qty;
                updatedCart.products = updatedCart.products.filter(prod => prod.id != id);
                updatedCart.totalPrice = updatedCart.totalPrice -  productPrice * productQty;
                fs.writeFile(p, JSON.stringify(updatedCart),err => {
                    console.log(err);
                })
            }
        });
    }

    static getCart(callBack){
        fs.readFile(p, (err, fileContent)=>{
            if(err){
                callBack(null);
            }else{
                const cart = JSON.parse(fileContent);
                callBack(cart);
            }
        });
    }
}