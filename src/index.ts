import app from "./app.js";
import { dbConnection } from "./config/db.js";
const PORT = process.env.PORT || 3000;

app.get('/health-check', (req, res) => {
    res.send(`server is running fine on port ${PORT}.`)
})

app.listen(PORT, async () => {
    await dbConnection();
    console.log(`Server running on port ${PORT}`)
})
