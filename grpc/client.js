// Import package
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Define Proto Path
const PROTO_PATH = './mahasiswa.proto';

const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
};

var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);

// Load service
const MahasiswaService = grpc.loadPackageDefinition(packageDefinition);
MahasiswaService;

// Define client
const client = new MahasiswaService.MahasiswaService(
    "127.0.0.1:3000",
    grpc.credentials.createInsecure()
)

client.getAll({}, (error, mahasiswa) => {
    if(!error) throw error;
    console.log(mahasiswa);
});
