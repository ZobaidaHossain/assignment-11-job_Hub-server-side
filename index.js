const express = require('express');
const cors=require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app=express();
const port=process.env.PORT || 5000;


//middleware
app.use(cors({
  origin:[
    'https://jobhub-ecf0b.web.app',
    'https://jobhub-ecf0b.firebaseapp.com',
   'http://localhost:5173'

  ],
  credentials:true
}));
app.use(express.json());

//    //send add a job to the database
//    app.post('/addjob',async(req,res)=>{
//     const newCoffee=req.body;
//     console.log(newCoffee);
//     const result=await coffeeCollection.insertOne(newCoffee);
//     res.send(result);
// })

//jobHub
//8DDusKCdEt7sq0OD
console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mxoo4ka.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with add gMongoClientOptions object to set the Stable API version
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
    // await client.connect();
    
    //db

    const coffeeCollection=client.db('jobHub').collection('addjob');
    const cartCollection=client.db('jobHub').collection('cart');
    const userCollection=client.db('jobHub').collection('user');
    // const bookingCollectionff=cliffent.db('jobHub').collection('myjobs');

// add job old
   //send add a job to the database
   app.post('/addjob',async(req,res)=>{
    const newCoffee=req.body;
    console.log(newCoffee);
    const result=await coffeeCollection.insertOne(newCoffee);
    res.send(result);
})

//add job new
// send add a job to the database
// app.post('/addjob', async (req, res) => {
//   const newCoffee = req.body;
//   console.log(newCoffee);
   
//   const result = await coffeeCollection.insertOne(newCoffee);
//   if (result.insertedId) {
//        // Update the number of applicants for the job
//        const jobId = result.insertedId; // Assuming this holds the newly inserted job's ID
 
//        // Use the jobId to find the job in the collection and increment the number of applicants
//        const jobQuery = { _id: jobId };
//        const updateQuery = { $inc: { numberOfApplicants: 1 } }; // Increment the 'numberOfApplicants' field by 1
 
//        await jobCollection.updateOne(jobQuery, updateQuery);
//        res.send({ message: 'Job added successfully' });
//   } else {
//        res.status(500).send({ message: 'Failed to add job' });
//   }
//  });


//my job
app.get('/addjob',async(req,res)=>{
console.log(req.query.email);
let query={};
if(req.query?.email){
    query={email:req.query.email}
}

    const result=await coffeeCollection.find(query).toArray();
    res.send(result);
})

//my job delete
app.delete('/addjob/:id',async(req,res)=>{
  const id=req.params.id;
  const query={_id:new ObjectId(id)}
  const result=await coffeeCollection.deleteOne(query);
  res.send(result)
})

//my job update
app.get('/addjob/:id',async(req,res)=>{
  const id=req.params.id;
  const query={_id:new ObjectId(id)}
  const result=await coffeeCollection.findOne(query);
  res.send(result);
})

app.put('/addjob/:id',async(req,res)=>{
  const id=req.params.id;
  const filter={_id:new ObjectId(id)}
  const options={upsert:true};
  const updatedJob=req.body;
  const job={
    $set:{
      photo:updatedJob.photo,
      title:updatedJob.title,
      name:updatedJob.name,
      category:updatedJob.category,
      salary:updatedJob.salary,
      posting:updatedJob.posting,
      deadline:updatedJob.deadline,
      description:updatedJob.description,
      email:updatedJob.email,
      numbers:updatedJob.numbers
    }
  }
  const result=await coffeeCollection.updateOne(filter,job,options);
  res.send(result);

})

//add job data read from db

app.get('/addjob',async(req,res)=>{
    const cursor=coffeeCollection.find();
    const result=await cursor.toArray();
    res.send(result);
      })


// //myjob data read from db
// app.get('/addjob',async(req,res)=>{
//     console.log(req.query);
//     let query={};
//     if(req.query?.email){
//         query={email:req.query.email}
//     }
//     const result=await coffeeCollection.find().toArray();
//     res.send(result);
//       })

//details read
app.get('/addjob/:id',async(req,res)=>{
    const id=req.params.id;
    const query={_id:new ObjectId(id)}
    const user=await coffeeCollection.findOne(query);
    res.send(user);
})




//submit information api
app.post('/user',async(req,res)=>{
    const user=req.body;
    console.log(user);
    const result=await userCollection.insertOne(user);
    res.send(result);
})


//cart applied job api
//cart related api
app.get('/cart',async(req,res)=>{
    const cursor=cartCollection.find();
    const cart=await cursor.toArray();
    res.send(cart);
      })



app.post('/cart',async(req,res)=>{
    const cart=req.body;
    console.log(cart);
    const result=await cartCollection.insertOne(cart)
    res.send(result);

})


//cart delete
app.delete('/cart/:id',async(req,res)=>{
    const id=req.params.id;
    console.log('Received delete request for ID:', id);
    const query={_id: id};
    const result=await cartCollection.deleteOne(query);
    res.send(result);
})



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
app.get('/',(req,res)=>{
    res.send('jobHub server is running');
})

app.listen(port,()=>{
    console.log(`jobHub server is running on port: ${port}`)
})