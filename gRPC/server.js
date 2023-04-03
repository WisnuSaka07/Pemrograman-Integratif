const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const firebase = require('firebase-admin');


// Konfigurasi Firebase Firestore
const serviceAccount = require('./serviceAccountKey.json');
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),

});
const db = firebase.firestore();

// Load file-code gRPC
const packageDefinition = protoLoader.loadSync('./file.proto');
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const todoService = grpcObject.api.TodoService;

// Implementasi API TodoService
const server = new grpc.Server();
server.addService(todoService.service, {
  CreateTodo: (call, callback) => {
    const todo = call.request;
    db.collection('todos').add(todo)
      .then((docRef) => {
        const newTodo = {
          id: docRef.id,
          title: todo.title,
          description: todo.description,
        };
        callback(null, { todo: newTodo });
      })
      .catch((error) => {
        console.error(error);
        callback(error, null);
      });
  },

  ReadTodo: (call, callback) => {
    const id = call.request.id;
    db.collection('todos').doc(id).get()
      .then((doc) => {
        if (doc.exists) {
          const todo = {
            id: doc.id,
            ...doc.data(),
          };
          callback(null, { todo: todo });
        } else {
          callback({
            code: grpc.status.NOT_FOUND,
            details: 'Todo not found',
          }, null);
        }
      })
      .catch((error) => {
        console.error(error);
        callback(error, null);
      });
  },

  UpdateTodo: (call, callback) => {
    const todo = call.request;
    const id = todo.id;
    db.collection('todos').doc(id).set(todo, { merge: true })
      .then(() => {
        callback(null, { todo: todo });
      })
      .catch((error) => {
        console.error(error);
        callback(error, null);
      });
  },

  DeleteTodo: (call, callback) => {
    const id = call.request.id;
    db.collection('todos').doc(id).delete()
      .then(() => {
        callback(null, {});
      })
      .catch((error) => {
        console.error(error);
        callback(error, null);
      });
  },
});

// Jalankan server
const PORT = 5000;
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err != null) {
    return console.error(err);
  }
  console.log(`Server running on port ${port}`);
  server.start();
});
