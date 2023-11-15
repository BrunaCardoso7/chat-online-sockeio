import express from "express";
import { createServer } from "node:http"

const app = express()
const server = createServer(app)

app.get('/', (req, res)=>{
    res.sendFile(new URL('index.html', import.meta.url).pathname)
})

server.listen(3000, ()=>{
    console.log("servidor rodando na porta 3000")
})