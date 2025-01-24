const express = require('express'); // Importar Express
const mongoose = require('mongoose'); //Importamos módulo para Mongo
const path = require('path');
const app = express(); // Crear una instancia de aplicación Express


app.use(express.static(path.join(__dirname, 'public')));
// Middleware for JSON parsing
app.use(express.json());
//Middleware para el encoding
app.use(express.urlencoded({ extended: true }));

// const MONGO_URI = 'mongodb://localhost:27017/glosario_p44' //Identificador de la base de datos (el localhost es cuando es local, pero vamos a usar otra en Internet)
const MONGO_URI = 'mongodb+srv://agustinlawtaro:r2+BF.cxkTX.&Xb@clusterfree.jzkmw.mongodb.net/glosario_p44?retryWrites=true&w=majority';


//Conectamos a Mongo usando el módulo

mongoose
.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('MongoDB connected succesfully')) //Try catch
.catch((err) => console.error('MongoDB connection error: ', err));

//Para verificar conexión
mongoose.connection.on('connected', () => {
  console.log(`Connected to database: ${mongoose.connection.db.databaseName}`);
});

// Ruta básica para min(GET)
app.get('/', (req, res) => {
  res.send('¡Hola, mundo desde Express!');
});


//Creamos 
const wordSchema =  new mongoose.Schema({
    word: String,
    definition: String
});

const Word = mongoose.model('Word', wordSchema, 'glosario');

////Old word page
// app.get('/words', async(req,res) => {
//     try {
//         const words =  await Word.find();
//         console.log(words)
//         res.status(200).json(words);
//     } catch (error) {
//         res.status(500).json({error: "Can't retrieve words"});
        
//     }


// } )

//Old form  (serve the form)
// app.get('/form', (req,res)=>{
//   res.sendFile(path.join(__dirname, 'form.html'));
// })

//Ruta para agregar posteo

// app.post('/add-word', async(req,res)=>{
//   try {
//     const {word, definition} = req.body;

//     const newWord = new Word({word, definition});

//     await newWord.save();

//     res.send('Word added succesfully');

//   }

//   catch(error){

//     console.error(error);

//     req.status(500).send('Error saving the world');

//   }
// });


app.post('/words', async(req,res)=>{
  try {
    const newWord = new Word(req.body);
    const savedWord = await newWord.save();
    res.status(201).json(savedWord);
  }
  catch(error){
    res.status(500).json({error: 'Error creating new word'});
  }
})
//Read all words
app.get('/words', async (req,res)=>{
  try{
    const words = await Word.find();
    res.status(200).json(words);
  }
  catch(error){
    res.status(500).json({error:'Error fetching words'});
  }
})

//Update a word
app.put('/words/:id', async(req,res)=>{
  try{
    const updatedWord = await Word.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.status(200).json(updatedWord);
  }catch(error){
    res.status(500).json({error: 'Error updating word'});
  }
});

//Delete a word
app.delete('/words/:id', async(req,res)=>{
  try{
    await Word.findByIdAndDelete(req.params.id);
    req.status(200).send('Word delted');
  }
  catch{
    res.status(500).json({error: 'Error deleting word'});
  }
})

// // Puerto donde se ejecutará el servidor de FORMA LOCAL
// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Servidor corriendo en http://localhost:${PORT}`);
// });


//Para ejecutar en HEROKU usamos el env, si no está, usamos el 3000 (para lo local)
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

