const { json } = require('body-parser');
const fs = require('fs');
const path = require('path');
const Cart = require('./cart.model');

const p = path.join(require.main.path, 'data', 'products.json');

/**
 * 
 * @param callback  Call the function after fetch data `function(products){}`
 */
const getProductsFromFile = (callBack)=>{
    fs.readFile(p, (err, fileContent) => {
        if (err) { 
           return callBack([]);
        }
        return callBack(JSON.parse(fileContent));
    });
}

module.exports = class Product {
    constructor({id,title, imageUrl, description, price}){
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = Number(price);
    }

    save(){
        if(this.id){
            getProductsFromFile(products => {
                const existingProductIndex  = products.findIndex(p=> p.id == this.id);
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts),err => {
                    //console.log(err);
                })
            });
        }else{
            this.id = Math.random().toString();
            getProductsFromFile(products => {
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), (err)=>{
                    console.log(err);
                });
            });
        }
    }

    /**
     * 
     * @param callback  Call the function after fetch data `function(data){}`
     */
    static fetchAll(callBack){
        getProductsFromFile(callBack)
    }

    /**
     * 
     * @param id Id of the required product
     * @param callBack call back function after fetch the product `function(data)`
     */
    static findById(id, callBack){
         getProductsFromFile(products => {
             const product = products.find(p => p.id == id);
             callBack(product);
         })
    }

    static delete(id){
        getProductsFromFile(products => {
            const product = products.find(p => p.id == id);
            const updatedProducts = products.filter(p => p.id != id);
            fs.writeFile(p, JSON.stringify(updatedProducts),err=>{
                if(!err){
                     Cart.deleteProduct(id,product.price);
                }
            })
        });
    }
}