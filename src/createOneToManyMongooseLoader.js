import DataLoader from 'dataloader';
import R from 'ramda';

/* One-to-Many mapping of keys to an array of docs. Such as querying with a courseId for a list of classes. */
function createOneToManyMongooseLoader(
  model,
  field = '_id',
  projection = { __v: false }
) {
  return new DataLoader(async (keys) => {
    // Query the db for the requested docs; results is an array.
    const results = await model.find({ [field]: { $in: keys } }, projection);
    // Using Ramda's groupBy function create a hash with the keys as the field's values
    // with the values as the array of found documents that match the keys for the
    // respective field
    const hash = R.groupBy(R.prop(field), results);
    // map the keys so that I return the array of doc that matches each key passed in.
    return keys.map((key) => hash[key.toString()]);
  });
}

export default createOneToManyMongooseLoader;

// Example Hash
/*
{
  'id1': [ 
    { field: id1, ...otherInfo }, 
    { field: id1, ...otherInfo }, 
    { field: id1, ...otherInfo }
  ],
  id2: [
    { field: id2, ...otherinfo }
  ]
}
*/
