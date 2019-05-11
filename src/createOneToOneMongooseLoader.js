import DataLoader from 'dataloader';
import R from 'ramda';

/* https://www.youtube.com/watch?v=ld2_AS4l19g&app=desktop */
/* https://github.com/ramda/ramda/wiki/Cookbook#make-an-object-out-of-a-list-with-keys-derived-form-each-element */
const objFromListWith = R.curry((fn, list) =>
  R.chain(R.zipObj, R.map(fn))(list)
);

/**
 * A one-to-one mapping of keys to returned documents from mongodb.
 * Meaning that for each key that is called with Loader.load() will return a document from
 * the DB.
 *
 * From the requirements on the Dataloader readme.md a Batch Function:
 * Accepts an arrys of keys and returns a promise that resolves to an arravy of values that
 * is the same length as the array of keys; and the return ordering of values must match the
 * input array of keys. See https://github.com/graphql/dataloader#batch-function
 *
 * @param {*} model - Mogoose Model
 * @param {string} [field='_id'] - Which Field to use for searching the DB for documents.
 * @param {*} keys args to the batch function
 * @returns
 */
function createOneToOneMongooseLoader(
  model,
  field = '_id',
  projection = { __v: false }
) {
  return new DataLoader(async (keys) => {
    // Use .find() to get all docs for the respective keys.
    const results = await model.find({ [field]: { $in: keys } }, projection);
    // create a hash with keys as the field's value and value the corresponding doc
    // from the results array with the matching field value
    const hash = objFromListWith(R.prop(field), results);
    // async function will wrap an value returned in a Promise; meaning second requirement
    return keys.map((key) => hash[key.toString()]);
  });
}

export default createOneToOneMongooseLoader;

// Example Hash
/*
{
  'id1': { field: id1, ...otherInfo },
  id2: { field: id2, ...otherInfo },
}

// * Usage: new Dataloader((keys) => createOneToOneMongooseLoader(model, keys, field))
// function createOneToOneMongooseLoader(model, keys, field = '_id') {
//   const results = await model.find({ [field]: { $in: keys } }, projection);
//   const hash = objFromListWith(R.prop(field), results);
//   return R.map((key) => hash[key.toString()])(keys);
// }

*/
