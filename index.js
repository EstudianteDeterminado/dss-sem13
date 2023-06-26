const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const low = require("lowdb");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const articuloRouter = require("./routes/articulos");
const PORT = process.env.PORT || 10003;

/**Config DB */
const FileDB = require("lowdb/adapters/FileSync");
const adapter = new FileDB("db.json");
const db  = low(adapter);

db.defaults({articulos:[]}).write();

const app = express();
app.db = db;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/articulos",articuloRouter);

const options = {
    definition: {
        openapi: "3.0.0",
        info:{
            title:"APIs - ventas",
            version:"1.0.0",
            description:"Demo librería de APIs de ventas",
        },
        servers:[
            {
                url:"http://localhost:"+PORT,
            },
        ]
    },
    apis:["./routes/*.js"]   
}

const specs = swaggerJsDoc(options);
app.use("/docs",swaggerUI.serve,swaggerUI.setup(specs));
app.listen(PORT,() => console.log(`El servidor está corriendo en el puerto ${PORT}`));
