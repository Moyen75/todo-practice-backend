const express = require('express');
const app = express()
const port = process.env.PORT || 3001
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config();

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://todo-2022:9LOhKfyljZXKxJfl@cluster0.aghhg.mongodb.net/todos?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


app.use(cors());
app.use(express.json());


app.get('/todos/all', async (req, res) => {
    try {
        await client.connect();
        const tasks = await client.db('todo').collection('tasks').find({ isDeleted: { $ne: true } }).toArray();
        res.status(200).json({ success: !!tasks, tasks })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
})
app.post('/todo', async (req, res) => {
    const payload = req.body;
    await client.connect();
    try {

        const inserted = await client.db('todo').collection('tasks').insertOne(payload);
        res.status(200).json({ success: !!inserted })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    } finally {
        await client.close();
    }
})
app.put('/todo/:id', async (req, res) => {
    const payload = req.body;
    await client.connect();
    try {
        const { id } = req.params
        const updated = await client.db('todo').collection('tasks').updateOne({ id: Number(id) }, { $set: payload });
        res.status(200).json({ success: !!updated, updated })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    } finally {
        await client.close();
    }
})
app.delete('/todo/delete/:id', async (req, res) => {
    await client.connect();
    try {
        const { id } = req.params
        const deleted = await client.db('todo').collection('tasks').deleteOne({ id });
        res.status(200).json({ success: !!deleted, deleted })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    } finally {
        await client.close();
    }
})
app.listen(port, () => {
    console.log('listening at', port)
})