import mongodb from "mongodb";
import fs from "fs";

const { MongoClient, ServerApiVersion } = mongodb;

const uri =
  "mongodb+srv://e00181703:zGju3VAVTcVj8ALA@cluster0.xzeljne.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function obtenerDinosaurio(clientDB) {
  console.log("Mostrando datos....");
  try {
    const db = clientDB.db("guiaLab");
    const coll = db.collection("Dinosaurios");
    const result = await coll.find({}).toArray();
    let dinos = [];

    return new Promise((res, rej) => {
      result.forEach((element) => {
        dinos.push(element);
      });
      console.log(dinos)
      res(dinos);
    });
  } catch (err) {
    console.log(err);
  }
}

async function crearDinosaurio(clientDB, info) {
  console.log("Guardando info...");
  console.log(info);

  try {
    const db = clientDB.db("guiaLab");
    const coll = db.collection("Dinosaurios");
    await coll.insertOne(info);

    console.log("Info Guardada!");

    return info._id;
  } catch (err) {
    console.log(err);
  }
}

async function updateDinosaurio(clientDB, id, info) {
  console.log("Actualizando info...");
  console.log(info);

  try {
    const db = clientDB.db("guiaLab");
    const coll = db.collection("Dinosaurios");

    const filter = { _id: id };
    const updateDoc = {
      $set: {
        ...info,
      },
    };

    const result = await coll.updateOne(filter, updateDoc);
    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s),`
    );

    console.log("Actualizado exitosamente.");
  } catch (err) {
    console.log(err);
  }
}

async function deleteDinosaurio(clientDB, id){
  console.log("Borrando info...")

  try{
    const db = clientDB.db("guiaLab");
    const coll = db.collection("Dinosaurios");

    const filter = { _id:id };
    const result = await coll.deleteOne(filter)

    if (result.deletedCount === 1) {
      console.log("Successfully deleted one document.");
    } else {
      console.log("No documents matched the query. Deleted 0 documents.");
    }

  }catch(err){
    console.log(err)
  }
}

async function exportCollection(data){
  try {
    fs.writeFileSync('Dinosaurio.json', JSON.stringify(data));
    console.log('Done writing to file.');
  }catch(err) {
    console.log('Error writing to file', err)
  }
}

async function run() {
  try {
    await client.connect();
    await client.db("guiaLab").command({ ping: 1 });
    return client;
  } catch (error) {
    console.log(error);
  }
}

run()
  .then(async (res) => {
    const collData = await obtenerDinosaurio(res)
    const updateId = await crearDinosaurio(res, {name:"Velociraptor"})
    await updateDinosaurio(res,updateId,{name:"Velociraptor 2"})
    await deleteDinosaurio(res,updateId)
    await exportCollection(collData)
    console.log(collData)
    return res
  })
  .then(async (res) => await res.close());
