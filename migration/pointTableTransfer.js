const { MongoClient, ObjectId } = require('mongodb')

const main = async () => {
  const client = new MongoClient('');
  const db = client.db('Frog');

  const users = await db.collection('User').find({}).toArray()


  for ( const user of users ) {
    // console.log(user._id);
    const point = await db.collection('Points').findOne({ userId: user._id })

    const newUser = await db.collection('User').updateOne(
      { _id: user._id },
      { $set: { points: point===null?0:point.point } },
      { new: true }
    )
    console.log(newUser);
  }


}

main();