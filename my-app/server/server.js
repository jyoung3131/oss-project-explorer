const express = require("express");
const cors = require("cors");
// const corsOptions ={
//     credentials:true,            //access-control-allow-credentials:true
// }

const projectFormRoutes = require("./routes/projectFormRoutes");

const app = express();
app.use(express.json());

// app.use(cors(corsOptions));
app.use(cors());

// Incorporates routes to the express instance
app.use(projectFormRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});