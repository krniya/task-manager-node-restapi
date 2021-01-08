const express = require('express')
const router = new express.Router()
const User = require('../models/user')

router.post('/users/login', async (req, res)=> {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.status(201).send(users)
    }
    catch(e) {
        res.status(404).send(e)
    }
 
})

router.get("/users/:id", async (req, res) => {
    const _id = req.params.id;
    try {
        const user = await User.findById(_id);
        res.send(user);
    } catch {
        res.status(404).send(e);
    }
});

router.post('/users', async (req, res)=> {
    const user = new User(req.body)
    try {
        await user.save()
        res.status(201).send(user)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','age','email','password']
    const isValidOperation = updates.every((update)=> {
        allowedUpdates.includes(update)
    })
    const _id = req.params.id
    if(!isValidOperation) {
        return res.status(400).send({error : 'Invalid Update'})
    }
    try {
        // const user = await User.findByIdAndUpdate(_id, req.body, {new : true, runValidators: true})
        const user = await User.findById(req.params.id)
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        if(!user) {
            res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router