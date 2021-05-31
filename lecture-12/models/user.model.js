const monogodb = require('mongodb');
const ObjectId = monogodb.ObjectId;
const getDB = require('../utils/database').getDB;

class User {
    constructor(username, email, cart, id){
        this.username = username;
        this.email = email;
        this.cart = cart; //{items: []}
        this._id = id;
    }

    save(){
        const db = getDB();
        return db.collection('users').insertOne(this);
    }

    addToCart(product){
        const cartProductIndex = this.cart.item.findIndex(cp => {
            return cp.productId.toString() === product._id.toString()
        });

        let newQty = 1;
        const updatedCartItems = [...this.cart.item];

        if(cartProductIndex >= 0){
            newQty = this.cart.item[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQty;
        }else{
            updatedCartItems.push({productId: new ObjectId(product._id), quantity: newQty})
        }



        const updatedCart = {item: updatedCartItems};
        const db = getDB();
        return db.collection('users')
        .updateOne(
            {_id: new ObjectId(this._id)},
            {$set: {cart: updatedCart}}
        );
    }

    getCart(){
        const db = getDB();
        const productIds = this.cart.item.map(i => {
            return i.productId;
        })

        return db.collection('products').find({_id : {$in: productIds}})
            .toArray()
            .then(products => {
                return products.map(p => {
                    return {
                        ...p,
                        quantity: this.cart.item.find(i => {
                            return i.productId.toString() === p._id.toString();
                        }).quantity
                    }
                });
            });
    }

    deleteItemFromCart(productId){
        const updatedCartItems = this.cart.item.filter(i => {
            return i.productId.toString() !== productId.toString();
        })

        const db = getDB();
        return db.collection('users').updateOne(
            {_id: new ObjectId(this._id)},
            { $set: {cart: {item: updatedCartItems}}}
        );
    }

    addOrder(){
        const db = getDB();
        return this.getCart().then(products => {
            const order = {
                items: products,
                user: {
                    _id: new ObjectId(this._id),
                    name: this.username
                }
            }
            return db.collection('orders').insertOne(order);
        })
        .then(result => {
            this.cart = { item: []};
            return db.collection('users')
            .updateOne(
                {_id: new ObjectId(this._id)},
                {$set: {cart: {item: []}}}
            );
        });
    }

    getOrders(){
        const db =getDB();
        return db.collection('orders').find({'user._id': new ObjectId(this._id)}).toArray();
    }

    static findById(userId){
        const db = getDB()
        return db.collection('users').findOne({_id: new ObjectId(userId)});
    }
}

module.exports = User 