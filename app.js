const url = require("url")
const http = require("http")
const port = 10000
const fs = require("fs")
const arls = 80

function checkb(type, reqd) {
    if (type == 1) {
        // Assume the sender is paying to recipcent 
        if (reqd["sc"].len() != 5) {
            return "-5"
        } else if (reqd["sc"].toString() == "undefined") {
            return "-6"
        } else if (reqd["sc"] == "") {
            return "-6"
        } else if (isNaN(reqd["sc"]) == true) {
            return "-7"
        } else if (reqd["reciever"] == "") {
            return "-8"
        } else if (reqd["reciever"].toString() == "undefined") {
            return "-8"
        } else if (isNaN(reqd["cardn"]) == true) {
            return "-4"
        } else if (isNaN(reqd["amount"]) == true) {
            return "-3"
        } else {
            return "1"
        }
    }
}
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
            res.write("Good");
            res.end();
        } else if (path == "/assets/style.css") {
            sendf(res, "assets/style.css")
            res.end();
        }
    } else if (req.method == "POST") {
        if (path == "/payment/send") {
            reqb = [];
            
            req.on("data", (ck) => {
                reqb.push(ck);
            });
            
            req.on('end', () => {
                const cdatab = Buffer.concat(reqb).toString();
                console.log("Processed request data body: ", cdatab);
                res.writeHead(200);
                res.write(checkb(1, JSON.parse(cdatab).toString()));
            });
            
            req.on('error', (err) => {
                res.write("-100 -> ", err);
                res.end();
            });
        }
    }
}).listen(port);

function sendf(res, file) {
    res.write(fs.readFileSync(__dirname + "/" + file));
    res.end();
}
