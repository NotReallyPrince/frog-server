const { MongoClient } = require('mongodb');

// Connection URL and Database Name
const url = 'mongodb+srv://ape:ySLBaDt0BuouYqXi@atlascluster.rbiewzn.mongodb.net/Frog'; // Replace with your MongoDB connection string
const dbName = 'Frog'; // Replace with your database name
const collectionName = 'userpoints'; // Replace with your collection name

async function migratePointsField() {
    const client = new MongoClient(url, { useUnifiedTopology: true });

    try {
        // Connect to MongoDB
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Use bulk operations to handle both cases
        const bulkOps = [];

        // Find documents where point is a string and convert to number
        bulkOps.push({
            updateMany: {
                filter: { point: { $type: 'string' } },
                update: [
                    {
                        $set: {
                            points: {
                                $convert: {
                                    input: '$point',
                                    to: 'double',
                                    onError: 0, // Handle conversion errors by setting to 0
                                    onNull: 0,  // Handle null values
                                },
                            },
                        },
                    },
                    { $unset: 'point' },
                ],
            },
        });

        // Find documents where point is already a number and rename it
        bulkOps.push({
            updateMany: {
                filter: { point: { $type: 'number' } },
                update: [
                    { $set: { points: '$point' } },
                    { $unset: 'point' },
                ],
            },
        });

        // Execute bulk operations
        const result = await collection.bulkWrite(bulkOps);

        console.log(`Modified ${result.modifiedCount} documents.`);
        console.log('Migration completed successfully');
    } catch (err) {
        console.error('Error during migration:', err);
    } finally {
        await client.close();
    }
}

migratePointsField();
