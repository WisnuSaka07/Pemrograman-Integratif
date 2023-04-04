
# Implementation of gRPC API and Protobuf in Node JS

## Tujuan

Membuat Implementasi gRPC API dan Protobuf

## Tahap Pengerjaan

### 1. Init Project

1. Buat direktori gRPC terlebih dahulu
    ![Alt teks](https://github.com/WisnuSaka07/Pemrograman-Integratif/tree/main/gRPC/img/direktori.png)

2. Install nodeJS ( Sesuaikan bahasa yang kalian gunakan )

3. Install gRPC

```bash 
npm i grpc
```

```bash
npm install @grpc/proto-loader
```

4. Buat 3 files ini :
    * [Proto file](file.proto)
    * [Server.js](server.js)
    * [Client.js](client.js)

### 2. Tambahkan Fungsi CRUD-nya

#### a. File Proto
file.proto
```protobuf
syntax = "proto3";

package api;

service TodoService {
rpc CreateTodo (CreateTodoRequest) returns (TodoResponse) {}

rpc ReadTodo (ReadTodoRequest) returns (TodoResponse) {}

rpc UpdateTodo (UpdateTodoRequest) returns (TodoResponse) {}

rpc DeleteTodo (DeleteTodoRequest) returns (TodoResponse) {}
}

message Todo {
string id = 1;
string title = 2;
string description = 3;
}

message CreateTodoRequest {
string title = 1;
string description = 2;
}

message ReadTodoRequest {
string id = 1;
}

message UpdateTodoRequest {
string id = 1;
string title = 2;
string description = 3;
}

message DeleteTodoRequest {
string id = 1;
}

message TodoResponse {
Todo  todo = 1;
string error = 2;
}
```

#### b. File Server
server.js

```js
const  grpc = require('@grpc/grpc-js');
const  protoLoader = require('@grpc/proto-loader');
const  firebase = require('firebase-admin');

// Konfigurasi Firebase Firestore
const  serviceAccount = require('./serviceAccountKey.json');
firebase.initializeApp({
credential:  firebase.credential.cert(serviceAccount),
});

const  db = firebase.firestore();

// Load file-code gRPC
const  packageDefinition = protoLoader.loadSync('./file.proto');
const  grpcObject = grpc.loadPackageDefinition(packageDefinition);
const  todoService = grpcObject.api.TodoService;

// Implementasi API TodoService
const  server = new  grpc.Server();
server.addService(todoService.service, {

CreateTodo: (call, callback) => {
const  todo = call.request;
db.collection('todos').add(todo)
.then((docRef) => {
const  newTodo = {
id:  docRef.id,
title:  todo.title,
description:  todo.description,
};
callback(null, { todo:  newTodo });
})
.catch((error) => {
console.error(error);
callback(error, null);
});
},

ReadTodo: (call, callback) => {
const  id = call.request.id;
db.collection('todos').doc(id).get()
.then((doc) => {
if (doc.exists) {
const  todo = {
id:  doc.id,
...doc.data(),
};
callback(null, { todo:  todo });
} else {
callback({
code:  grpc.status.NOT_FOUND,
details:  'Todo not found',
}, null);
}
})
.catch((error) => {
console.error(error);
callback(error, null);
});
},

UpdateTodo: (call, callback) => {
const  todo = call.request;
const  id = todo.id;
db.collection('todos').doc(id).set(todo, { merge:  true })
.then(() => {
callback(null, { todo:  todo });
})
.catch((error) => {
console.error(error);
callback(error, null);
});
},

DeleteTodo: (call, callback) => {
const  id = call.request.id;
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
const  PORT = 5000;
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
if (err != null) {
return  console.error(err);
}
console.log(`Server running on port ${port}`);
server.start();
});
```

#### c. File Client
client.js

```js
const  grpc = require('@grpc/grpc-js');
const  protoLoader = require('@grpc/proto-loader');

// Load file-code gRPC
const  packageDefinition = protoLoader.loadSync('./file.proto');
const  grpcObject = grpc.loadPackageDefinition(packageDefinition);
const  todoService = grpcObject.api.TodoService;

// Konfigurasi koneksi ke server
const  client = new  todoService('localhost:5000', grpc.credentials.createInsecure());

// Panggil API untuk create todo
client.CreateTodo({
title:  'Belajar gRPC',
description:  'Belajar membuat API dengan gRPC dan JavaScript',
}, (error, response) => {
if (error) {
console.error(error);
} else {
console.log(response.todo);
}
});

// Panggil API untuk read todo
client.ReadTodo({
id:  '4lIFFm23pvtbLKVMTfQH',
}, (error, response) => {
if (error) {
console.error(error);
} else {
console.log(response.todo);
}
});

// Panggil API untuk update todo
client.UpdateTodo({
id:  '5apMngFGSwcvo8zHQAHW',
title:  'Belajar gRPC (update)',
}, (error, response) => {
if (error) {
console.error(error);
} else {
console.log(response.todo);
}
});

// Panggil API untuk delete todo
client.DeleteTodo({
id:  '6gDwl2rDFnszFT3NeTg0',
}, (error, response) => {
if (error) {
console.error(error);
} else {
console.log('Todo deleted successfully');
}
});
```


## Testing
 1. Jalankan server pada port bebas
```bash
node server.js
```
![Alt teks](https://github.com/WisnuSaka07/Pemrograman-Integratif/blob/main/gRPC/img/jalanServer.png "jalanServer.png")

2. Jalankan client pada terminal 
```bash
node client.js
```

3. Preview Console
![Alt teks](https://github.com/WisnuSaka07/Pemrograman-Integratif/blob/main/gRPC/img/jalanClient.png "jalanClient.png")

4. Preview Firebase/Firestore
![Alt teks](https://github.com/WisnuSaka07/Pemrograman-Integratif/blob/main/gRPC/img/filebaruCreate.png "filebaruCreate.png")


## Penjelasan

1. Create
Membuat Document baru dengan generate id dan memiliki atribut title menjadi  "Belajar gRPC" dan description menjadi "Belajar membuat API dengan gRPC dan JavaScript".

2. Read
Membaca atribut dari documen dengan id "4lIFFm23pvtbLKVMTfQH".

3. Update
Mengubah atribut dari document "5apMngFGSwcvo8zHQAHW".

4. Delete
Menghapus document dengan id "6gDwl2rDFnszFT3NeTg0".

