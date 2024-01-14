const express = require("express");
const fs = require('fs');
const path = require('path');
const router = express.Router();

const jsonPath = "../../client/form_test.json";

router.post('/submit-form', (req, res) => {
    const newFormData = req.body;
    const filePath = path.join(__dirname, jsonPath); // Adjust the path as necessary

    fs.readFile(filePath, (err, data) => {
    if (err) {
        console.error(err);
        return res.status(500).send('Error reading file');
    }

    let fileData = [];
    if (data.length > 0) {
        fileData = JSON.parse(data);
    }
    fileData.push(newFormData);

    fs.writeFile(filePath, JSON.stringify(fileData, null, 2), (writeErr) => {
        if (writeErr) {
        console.error(writeErr);
        return res.status(500).send('Error writing to file');
        }
        res.status(200).send('Data added successfully');
    });
    });
});

module.exports = router;