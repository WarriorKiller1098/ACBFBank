const url = require("url")
const http = require("http")
const port = 10000
const fs = require("fs")
http.createServer(function(req, res) {
    const urlpath = url.parse(req.url, true)
    const parsedpath = urlpath.path
    let query = urlpath.query
    const path = parsedpath.split("?")[0]
    if (path.charAt(path.length - 1) == "?") {
        query = parsedpath.split("?")[1].replace("?", "");
    }
    console.log("Method requested: " + req.method + ", with endpoint " + path);
    if (req.method == "POST") {
        if (path == "/") {
            sendf(res, "index.html");
        } else if (path == "/status") {
            res.write("1");
            res.end();
        } else if (path == "/assets/style.css") {
            sendf(res, "assets/style.css")
            res.end();
        }
    } else if (req.method == "POST") {
        reqb = [];
        
        req.on("data", (ck) => {
            reqb.push(ck);
        });
        
        req.on('end', () => {
            const cdatab = Buffer.concat(reqb).toString()
            console.log("Processed request data body")
            res.writeHead(200)
            res.write(JSON.stringify({
                status: "1",
                data: cdatab
            }));
        });
        
        req.on('error', (err) => {
            res.write(err);
            res.end();
        });
        
    }
}).listen(port);

function sendf(res, file) {
    res.write(fs.readFileSync(__dirname + "/" + file));
    res.end();
}