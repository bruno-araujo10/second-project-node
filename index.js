const express = require('express')

const uuid = require('uuid')

const port = 3000

const app = express()

app.use(express.json())

app.listen(port, () => {
    console.log(`🍔 Server started on port ${port}`)
})

const clients = []

const checkId = (request, response, next) => {
    const {id} = request.params

    const index = clients.findIndex(client => client.id === id)
    
    if(index < 0) {
        return response.status(404).json({error: 'not a found'})
    }

    request.idCheck = id
    request.indexCheck = index

    next()
}

const checkType = (request, response, next) => {
    console.log(`${request.method} url = http://localhost:${port}/order/`)

    next()
}



app.post('/order', checkType, (request, response) => {
    
    const {order, clientName, price, status} = request.body
    const client = {id:uuid.v4(), order, clientName, price, status}

    clients.push(client)

    return response.status(201).json(clients)
})

app.get('/order', checkType, (request, response) => {
    return response.json(clients)
})

app.put('/order/:id', checkId, checkType, (request, response) => {
    const id = request.idCheck
    const index = request.indexCheck
    const {order, clientName, price, status} = request.body
    const orderUpdate = {id, order, clientName, price, status}

    clients[index] = orderUpdate

    return response.json(orderUpdate)

})

app.delete('/order/:id', checkId, checkType, (request, response) => {
    const id = request.idCheck

    clients.splice(0,1)

    return response.status(201).json()

})

app.get('/order/:id', checkId, checkType, (request, response) => {
    const id = request.idCheck
    const client = clients.find(client => client.id === id)
    if(client < 0) {
        return response.status(404).json({error: 'not a found'})
    }
    return response.json(client)
})

app.patch('/order/:id', checkId, checkType, (request, response) => {
    const id = request.idCheck
    const order = request.body
  
    const index = request.indexCheck
  
    clients[index].status = 'Pronto'

    return response.status(200).json(clients[index])
})