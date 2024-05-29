
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.MONGO_CONNECTION;

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
    return client.db("cart")
  } catch(err) {
    console.error(err)
  }
}

async function addToCart(data, user){
    const database = await run()
    const cart = database.collection('cart')
    console.log(data._id)
    console.log(data)
    const cartData = {
        productId: data._id,
        name: data.name,
        category: data.category,
        price: data.price,
        desc: data.desc,
        pic: data.pic,
        stock: data.stock,
        userId: user.userId,
        userName: user.email
    }
    const result = await cart.insertOne(cartData)
    return 'true'
}

async function editCart(data){
    const database = await run()
    const cart = database.collection('cart')
    const body = {
        name: data.name,
        category: data.category,
        price: data.price,
        desc: data.desc,
        pic: data.pic,
    }
    const result = await cart.updateMany({productId: data._id}, {$set: body})
    console.log(result)
    return 'true'
}

async function removeCart(data, userId){
    const database = await run()
    const cart = database.collection('cart')
    console.log(data)
    console.log(userId)
    const result = await cart.deleteOne({productId: data.productId, userId})
    console.log(result)
    return 'true'
}

async function getCart(userId){
    const database = await run()
    const cart = database.collection('cart')
    const result = await cart.find({userId: parseInt(userId)}).toArray()
    console.log(result)
    return result
}

async function getCartCount(userId) {
    try {
      console.log('Connecting to database...');
      const database = await run(); // Assuming run() connects to your MongoDB
      const cart = database.collection('cart');
      
      console.log('Fetching cart count for user:', userId);
      const result = await cart.countDocuments({ userId: userId });
      
      console.log('Cart count:', result);
      return result;
    } catch (error) {
      console.error('Error fetching cart count:', error);
      throw new Error('Error fetching cart count');
    }
  }
  

async function deletedProduct(id){
    const database = await run()
    const cart = database.collection('cart')
    console.log(id)
    const result = await cart.deleteMany({productId: id.id})
    console.log(result)
    return result
}

module.exports = {addToCart, editCart, getCart, removeCart, deletedProduct, getCartCount}