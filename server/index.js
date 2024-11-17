const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3005;

const mongoURI = 'mongodb+srv://kamlesh:kamlesh@cluster0.zeotqe3.mongodb.net/HelpDesk?retryWrites=true&w=majority&appName=Cluster0';

const cors = require('cors');
app.use(cors());

require('./models/User')
require('./models/Ticket')

app.use(express.json())

app.use(require('./routes/userRoutes'))
app.use(require('./routes/ticketRoutes'))

mongoose.connect(mongoURI)
mongoose.connection.on("connected",()=> {
    console.log("mongo connected successfully")
})
mongoose.connection.on("error",()=> {
    console.log("error in coonnect")
})

app.get('/', (req, res) => {
    res.send('Hello from Express!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
