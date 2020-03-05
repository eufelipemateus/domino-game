import * as dotenv from 'dotenv';
import app from './App';
import { Server } from 'http';

dotenv.config();

const port = process.env.PORT;
app.debug = !!+process.env.DEBUG;

app.server.listen(port, () => {
    console.info(`Server running in  http://localhost:${port}...`);
});
