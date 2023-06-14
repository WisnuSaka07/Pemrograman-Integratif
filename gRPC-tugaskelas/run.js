const client = require('./client')

client.getAll({}, (error, mahasiswa) => {
    if(!error) {
      console.log ('success get all mahasiswa')
      console.log(mahasiswa)
    }else{
      console.log('error get all mahasiswa')
    }
  })