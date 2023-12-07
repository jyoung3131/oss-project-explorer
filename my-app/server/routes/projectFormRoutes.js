const express = require("express");
const fs = require('fs');
const path = require('path');
const router = express.Router();

const jsonPath = "../../client/form_test.json";

router.post('/submit-form', (req, res) => {
    // const formData = req.body;
    // const filePath = path.join(__dirname, jsonPath);

    // fs.appendFile(filePath, JSON.stringify(formData, null, 2), (err) => {
    //     if (err) {
    //     console.error(err);
    //     return res.status(500).send('Error writing to file');
    //     }
    //     res.status(200).send('Data saved successfully');
    // });
    const newFormData = req.body;
    const filePath = path.join(__dirname, jsonPath); // Adjust the path as necessary

    // Read the existing file
    fs.readFile(filePath, (err, data) => {
    if (err) {
        console.error(err);
        return res.status(500).send('Error reading file');
    }

    // Parse the existing data and add the new data
    let fileData = [];
    if (data.length > 0) {
        fileData = JSON.parse(data);
    }
    fileData.push(newFormData);

    // Write the updated array back to the file
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