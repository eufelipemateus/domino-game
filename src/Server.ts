import app from "./App";
import { Server } from 'http';

const port = process.env.PORT || app.PORT;

app.debug = false; 

app.server.listen(port, function () {
    console.info(`Server running in  ${port}...`);
});