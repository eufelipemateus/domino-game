import * as dotenv from 'dotenv';
import app from './App';

dotenv.config();

const port = parseInt(process.env.PORT, 10);
app.debug = !!+process.env.DEBUG;

app.server.listen(port, 'localhost', () => {
    console.info(`Server running in  http://localhost:${port}...`);
});
