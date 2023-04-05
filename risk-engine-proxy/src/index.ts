
import express from "express";
import { router } from "./risk";

const app = express();

app.use(express.json());

app.use('/risk', router);

/*
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    next();
});
*/

app.listen(process.env.PORT || 3000, () => {
    console.log(`The main entry point: http://127.0.0.1:3000`);
});
