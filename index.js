const http = require("http");
const fs = require("fs");
var requests = require('requests');
//const { listenerCount } = require("process");

const homefile = fs.readFileSync("home.html","utf-8");
let temperature;
const replaceval = (_tempval,orgval) =>{

   temperature = _tempval.replace("{%tempval%}",orgval.main.temp);
   temperature = temperature.replace(" {%tempmin%}",orgval.main.temp_min);
   temperature = temperature.replace(" {%tempmax%}",orgval.main.temp_max);
   temperature = temperature.replace("{%location%}",orgval.name);
  temperature = temperature.replace("{%tempstatus%}",orgval.weather.main);
  temperature = temperature.replace("{%country%}",orgval.sys.country);
  return temperature;
};


const server = http.createServer((req,res)=>{
    if(req.url == "/")
    {
        requests("https://api.openweathermap.org/data/2.5/weather?lat=20.9578&lon=76.3594&appid=4dfa2d13574e361672b754e8973ded79&units=metric")
.on('data', (chunk) => {
  const objdata = JSON.parse(chunk);
    
    const arrdata = [objdata];
    // console.log(arrdata[1].main.temp);
    const realtimedata = arrdata.map((val)=>
        replaceval(homefile,val))
        .join("");
        res.write(realtimedata);
})
.on('end',  (err)=> {
  if (err) return console.log('connection closed due to errors', err);
  res.end();

});
    }
});

server.listen(3000,"127.0.0.1");