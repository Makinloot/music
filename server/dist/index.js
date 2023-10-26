import http from "http";
import { app } from "./app.js";
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
startServer();
function startServer() {
    server.listen(PORT, () => {
        console.log(`Running at ${PORT}`);
    });
}
//# sourceMappingURL=index.js.map