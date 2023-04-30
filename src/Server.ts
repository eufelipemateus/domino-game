import { env, loadEnv } from './env';
import app from './App';

loadEnv()

const port =env.PORT;
app.debug = !!+env.DEBUG;

app.server.listen(port, 'localhost', () => {
    console.info(`Server running in  http://localhost:${port}...`);
});

