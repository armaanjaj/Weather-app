const express = require("express");
const bodyParser = require("body-parser");
const keys = require(__dirname+"/keys.js");
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
const https = require("https");
const port = 80;
const weather_key = keys.getWeatherKey();
const time_key = keys.getTimeKey();

app.get("/", (req, res)=>{
    res.sendFile(__dirname+"/index.html")
})

app.get("/weather", (req, res)=>{

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${req.query.city}&units=metric&appid=${weather_key}`;
    https.get(url, (response)=>{
        
        response.on('data', (data)=>{
            const timeUrl = `https://timezone.abstractapi.com/v1/current_time/?api_key=${time_key}&location=${JSON.parse(data).name}, ${JSON.parse(data).sys.country}`;
            
            https.get(timeUrl, (newRes)=>{
                newRes.on('data', (newData)=>{

                    // res.write(xyz...z) can also be used in the way->
                    // res.write(abc..); ....res.write();
                    // res.send();

                    res.send(`<p><a href="/">Home</a></p><h1 style="display: inline;">${JSON.parse(data).name}</h1> <p style="display: inline;">${JSON.parse(data).sys.country}</p><p><img src="https://openweathermap.org/img/w/${JSON.parse(data).weather[0].icon}.png"></p><p>Sky: ${JSON.parse(data).weather[0].main} (${JSON.parse(data).weather[0].description})</p><p>Temperature: ${JSON.parse(data).main.temp}&deg;C</p><p>Feels like: ${JSON.parse(data).main.feels_like}&deg;C</p><p>Wind speed: ${JSON.parse(data).wind.speed} Km/hr</p><p>Local datetime: ${JSON.parse(newData).datetime.substr(11)} ${JSON.parse(newData).datetime.substr(0, 10)}</p><p><a href="https://www.google.com/maps/search/?api=1&query=${JSON.parse(newData).latitude},${JSON.parse(newData).longitude}" target="_blank">Visit</a></p>`)

                })
            })
        })
    })
    // res.send("Hello world!");
})

app.post("/weather", (req, res)=>{

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${req.body.city}&units=metric&appid=${weather_key}`;
    
    https.get(url, (response)=>{
        
        response.on('data', (data)=>{

            if(JSON.parse(data).cod == 404){
                res.send("Oops! Wrong name.");
            }

            const timeUrl = `https://timezone.abstractapi.com/v1/current_time/?api_key=${time_key}&location=${JSON.parse(data).name}, ${JSON.parse(data).sys.country}`;
            
            https.get(timeUrl, (newRes)=>{
                newRes.on('data', (newData)=>{

                    res.send(`<p><a href="/">Home</a></p><h1 style="display: inline;">${JSON.parse(data).name}</h1> <p style="display: inline;">${JSON.parse(data).sys.country}</p><p><img src="https://openweathermap.org/img/w/${JSON.parse(data).weather[0].icon}.png"></p><p>Sky: ${JSON.parse(data).weather[0].main} (${JSON.parse(data).weather[0].description})</p><p>Temperature: ${JSON.parse(data).main.temp}&deg;C</p><p>Feels like: ${JSON.parse(data).main.feels_like}&deg;C</p><p>Wind speed: ${JSON.parse(data).wind.speed} Km/hr</p><p>Local datetime: ${JSON.parse(newData).datetime.substr(11)} ${JSON.parse(newData).datetime.substr(0, 10)}</p><p><a href="https://www.google.com/maps/search/?api=1&query=${JSON.parse(newData).latitude},${JSON.parse(newData).longitude}" target="_blank">Visit</a></p>`)

                })
            })
        })
    })
    // res.send("Hello world!");
})

app.use((req, res)=>{
    res.status(404).send("This is not the page your are lookin' for!");
})

app.listen(port, ()=>{
    console.log(`Server running at port number ${port}`);
})