import DataLoader from 'dataloader';
import R from 'ramda';

/* One-to-Many mapping of keys to an array of docs. Such as querying with a courseId for a list of classes. */
function createOneToManyMongooseLoader(
  model,
  field = '_id',
  options = { cacheKeyFn: (key) => key.toString() }
) {
  if (!model) {
    throw new Error('Need a Mongoose Model to create loader.');
  }
  return new DataLoader(async (keys) => {
    // Query the db for the requested docs; results is an array.
    const results = await model.find(
      { [field]: { $in: keys } },
      { __v: false }
    );
    // Using Ramda's groupBy function create a hash with the keys as the field's values
    // with the values as the array of found documents that match the keys for the
    // respective field
    const hash = R.groupBy(R.prop(field), results);
    // map the keys so that I return the array of doc that matches each key passed in.
    return keys.map((key) => hash[key.toString()]);
  }, options);
}

export default createOneToManyMongooseLoader;

// Example Hash
/*
{
  'publisher1': [ 
    { publisher_id: publisher1, ...otherBookInfo }, 
    { publisher_id: publisher1, ...otherBookInfo }, 
    { publisher_id: publisher1, ...otherBookInfo }
  ],
  publisher2: [
    { publisher_id: publisher2, ...otherBookInfo }
  ]
}
*/
