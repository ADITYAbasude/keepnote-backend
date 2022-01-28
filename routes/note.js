const express = require('express');
const router = express.Router();
const Notes = require('../models/notes');
const fetchUser = require('../middleware/fetchUser');
const { body, validationResult } = require('express-validator');



router.get('/fetchnote', fetchUser, async (req, res) => {
    try {

        const notes = await Notes.find({ user: req.user.id });
        console.log(notes)
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error")
    }
})

// to add the notes ____ login required!
router.post('/addNotes', fetchUser, [
    body('noteTitle', 'Enter a title').isLength({ min: 1 }),
    body('noteDiscription').isLength({ min: 1 })
], async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(500).json({ error: error.array() })
    }

    try {
        const note = new Notes({
            user: req.user.id,
            noteTitle: req.body.noteTitle,
            noteDiscription: req.body.noteDiscription,
            tag: req.body.tag
        })
        const saveNote = await note.save();
        res.json(saveNote);

    } catch (error) {
        console.log(error)
    }
})



// updataing the existing note by user
router.put('/updateNote/:id', fetchUser, async (req, res) => {
    const { noteTitle, noteDiscription, tag } = req.body;
    const newNote = {};

    if (noteTitle) { newNote.noteTitle = noteTitle }
    if (noteDiscription) { newNote.noteDiscription = noteDiscription }
    if (tag) { newNote.tag = tag }

    try {

        let note = await Notes.findById(req.params.id)

        if (!note) {
            return res.status(404).send("not found")
        }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Invalid user")
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json(note)
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal server error")
    }
})




// delecting the existing note by user
router.delete('/delectingNote/:id', fetchUser, async (req, res) => {
    const { noteTitle, noteDiscription, tag } = req.body;
    const newNote = {};

    if (noteTitle) { newNote.noteTitle = noteTitle }
    if (noteDiscription) { newNote.noteDiscription = noteDiscription }
    if (tag) { newNote.tag = tag }

    try {

        let note = await Notes.findById(req.params.id)

        if (!note) {
            return res.status(404).send("not found")
        }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Invalid user")
        }

        note = await Notes.findOneAndDelete(req.params.id)
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal server error")
    }
})



//to search note api  login required
router.post('/searchNote', fetchUser, async (req, res) => {
    const { noteTitle } = req.body
    try {
        const getNote = await Notes.find({ noteTitle: new RegExp(noteTitle) })
        res.json(getNote)

    } catch (error) {
        console.log(error)
    }
})








module.exports = router