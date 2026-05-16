const { connectDB } = require('./database');
const Restriction = require('../models/Restriction');

const seed = async () => {
  await connectDB();
  await Restriction.deleteMany({});
  await Restriction.insertMany([
    { nome: 'Glúten', categoria: 'alergia', palavras_chave: ['trigo', 'glúten', 'farinha'] },
    { nome: 'Lactose', categoria: 'intolerância', palavras_chave: ['leite', 'lactose', 'queijo'] },
    // ... etc
  ]);
  console.log('Seeds inseridos!');
  process.exit(0);
};

seed();