import app from "./app";
import { dbConnection } from "./config/db";
const PORT = process.env.PORT || 3000;

app.get('/health-check', (req, res) => {
    res.send(`server is running fine on port ${PORT}.`)
})

app.listen(PORT, async () => {
    await dbConnection();
    console.log(`Server running on port ${PORT}`)
})
