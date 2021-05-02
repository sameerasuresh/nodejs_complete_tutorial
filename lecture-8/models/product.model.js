const { json } = require('body-parser');
const fs = require('fs');
const path = require('path');

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
    constructor({title, imageUrl, description, price}){
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save(){
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err)=>{
                //console.log(err);
            });

        });
    }

    /**
     * 
     * @param callback  Call the function after fetch data `function(data){}`
     */
    static fetchAll(callBack){
        getProductsFromFile(callBack)
    }
}