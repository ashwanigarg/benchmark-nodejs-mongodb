const res = require('express/lib/response');
const {ObjectId} = require("mongodb");

class Controller {

    static fillProducts = async (req, res) => {
        let page = req.params.count;
        console.log("Will insert " + page + "products.");
        const products_collection = req.db.native.collection('products_collection');
        const products = [];
        for (let i = 0; i < page; i++) {
            const data = {
                "poId": "FOID0000000000",
                "pId": "602cf5eaa600007662a8935a",
                "merchantStoreClientId": "",
                "merchantId": "602c9fwdf600007662aad674",
                "merchantGroupId": "",
                "merchantGroupClientId": "602c9f6ad456df7662a6d675",
                "merchantProductClientId": "",
                "merchantProductId": "602c9f6ad600007662a6d674",
                "productClientId": "FMO154356494541087040",
                "brandId": "602ca038d6ee007002a6dd26",
                "productName": "Push Pull Hook",
                "productModifiedName": "Push/Pull lift Hook",
                "productSku": 1,
                "productType": "2",
                "description": "",
                "comment": "",
                "variants": [
                    {
                        "color": 3,
                        "width": 0,
                        "height": 0,
                        "length": 0,
                        "capacity": 200,
                        "weight": "200KG",
                        "manufacturer": 1
                    }
                ],
                "status": 1,
                "sizeUnit": {
                    "unitCategoryId": "",
                    "unitId": ""
                },
                "sizeConversionFactor": {
                    "conversionFactor": 10000
                },
                "createdAt": 1613568084567,
                "updatedAt": 1613568084567
            };

            data._id = new ObjectId();
            data.productSku = data.productSku + 1;
            products.push(data);
        }
        console.log("total products -- ", products);
        await products_collection.insertMany(products);
        res.send("New collection created and data filled")
    }

    static BulkDataNative = async function (req, res) {

        let page = Number(req.params.count);
        const products_collection = req.db.native.collection('products_collection');
        const products_collection_new = req.db.native.collection('products_collection_node');
        const products = await products_collection.find({}).limit(page).toArray();
        console.log("aaa", products);
        const modifiedProductsData = []

        async function modifyData() {
            products.forEach(async (product) => {
                delete product._id;
                modifiedProductsData.push(product)
            })
        }

        await modifyData();
        await products_collection_new.insertMany(modifiedProductsData);
        res.send("New collection created check database")
    }

}

module.exports = Controller;
