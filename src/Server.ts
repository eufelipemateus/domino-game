import app from './App';


const port = parseInt(process.env.PORT, 10);
app.debug = !!+process.env.DEBUG;

app.server.listen(port, 'localhost', () => {
    console.info(`Server running in  http://localhost:${port}...`);
});
