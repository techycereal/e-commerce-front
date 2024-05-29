
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.MONGO_CONNECTION

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    return client.db("product");
  } catch(err) {
    console.log(err)
  }
}


async function getAllProducts(start, end) {
    const database = await run();
    const products = database.collection('product');
  
    const aggregationPipeline = [
        {
          $group: {
            _id: "$category",
            documents: { $push: "$$ROOT" }
          }
        },
        {
          $project: {
            _id: 0,
            category: "$_id",
            documents: { $slice: ["$documents", start, end] }
          }
        },
        {
          $unwind: "$documents"
        },
        {
          $replaceRoot: { newRoot: "$documents" }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            category: 1,
            price: 1,
            desc: 1,
            longDesc: 1,
            pic: 1
          }
        }
      ];
  
    const result = await products.aggregate(aggregationPipeline).toArray();
    
    // Optionally log the result for debugging
    result.forEach(doc => {
      console.log(`Document: ${JSON.stringify(doc, null, 2)}`);
    });
  
    return result;
  }
  

async function getProduct(id){
    const database = await run()
    const products = database.collection('product')
    const result = await products.findOne({_id: new ObjectId(id)})
    return result
}



async function editProduct(body) {
    const database = await run(); // Ensure this function is defined and connects to your MongoDB
    const message = {
      name: body.name,
      category: body.category,
      price: body.price,
      desc: body.desc,
      longDesc: body.longDesc,
      pic: body.url, // Include the image URL
    };
    console.log('THIS HERE')
    console.log(message)
    const products = database.collection('product');
    const result = await products.updateOne({ _id: new ObjectId(body._id) }, { $set: message });
    return result;
  }
  
async function addProduct(body){
    const database = await run()
    console.log(body)
    const message = {
        name: body.name,
        category: body.category,
        price: body.price,
        desc: body.desc,
        longDesc: body.longDesc,
        pic: body.url
    }
    const products = database.collection('product')
    const result = await products.insertOne(message)
    return result
}



async function deleteProduct(id) {
    const database = await run()
    const products = database.collection('product')
    const result = await products.deleteOne({_id: new ObjectId(id)})
    return result
}



module.exports = {getAllProducts, getProduct, addProduct, editProduct, deleteProduct}