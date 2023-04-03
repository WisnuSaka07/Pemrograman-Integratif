const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load file-code gRPC
const packageDefinition = protoLoader.loadSync('./file.proto');
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const todoService = grpcObject.api.TodoService;

// Konfigurasi koneksi ke server
const client = new todoService('localhost:5000', grpc.credentials.createInsecure());

// Panggil API untuk create todo
client.CreateTodo({
  title: 'Belajar gRPC',
  description: 'Belajar membuat API dengan gRPC dan JavaScript',
}, (error, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log(response.todo);
  }
});

// Panggil API untuk read todo
client.ReadTodo({
  id: '4lIFFm23pvtbLKVMTfQH',
}, (error, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log(response.todo);
  }
});

// Panggil API untuk update todo
client.UpdateTodo({
  id: '5apMngFGSwcvo8zHQAHW',
  title: 'Belajar gRPC (update)',
}, (error, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log(response.todo);
  }
});

// Panggil API untuk delete todo
client.DeleteTodo({
  id: '6gDwl2rDFnszFT3NeTg0',
}, (error, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('Todo deleted successfully');
  }
});

