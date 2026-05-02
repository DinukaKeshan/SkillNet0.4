MongoDB is a NoSQL document database that stores data in flexible, JSON-like BSON documents.

Documents are stored in collections (analogous to tables). Each document has a unique _id field.

A document is a set of key-value pairs: { name: "Alice", age: 30, skills: ["js", "python"] }.

CRUD operations: insertOne/insertMany, find/findOne, updateOne/updateMany, deleteOne/deleteMany.

Query operators: $eq, $ne, $gt, $gte, $lt, $lte, $in, $nin, $exists, $regex.

Logical operators: $and, $or, $not, $nor.

Update operators: $set, $unset, $inc, $push, $pull, $addToSet, $rename.

Projection selects which fields to return: db.users.find({}, { name: 1, age: 1, _id: 0 }).

The aggregation pipeline processes documents through stages: $match, $group, $sort, $project, $lookup, $unwind.

$lookup performs left outer joins between collections.

$group aggregates: { $group: { _id: "$city", total: { $sum: 1 } } }.

Indexes improve query performance: db.collection.createIndex({ field: 1 }). 1 = ascending, -1 = descending.

Compound indexes: createIndex({ firstName: 1, lastName: 1 }).

Text indexes enable full-text search: createIndex({ content: "text" }); queried with $text operator.

Schema design: embed related data for read performance; reference for write-heavy or large subdocuments.

One-to-many relationships: embed if few (subdocument array) or reference if many (ObjectId array).

Mongoose is an ODM (Object Data Modeling) library for MongoDB and Node.js.

Mongoose schemas define document structure: new Schema({ name: String, age: Number, email: { type: String, required: true } }).

Mongoose models provide CRUD methods: User.find(), User.findById(), User.create(), User.findByIdAndUpdate().

Mongoose middleware (hooks): pre('save'), post('save') for logic before/after operations.

Mongoose validation: required, min, max, enum, match (regex), custom validators.

Mongoose virtuals are computed properties not stored in the database.

Mongoose population: .populate('author') replaces ObjectId references with actual documents.
