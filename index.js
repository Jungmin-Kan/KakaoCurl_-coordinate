const app = require("express")();
const { loadSetter } = require("./mapPosition");

app.get('/', async(req,res) => {
    let destination = [];
    Object.entries(req.query).forEach(([key, value]) => {
       console.log(key, value)
       destination.push(decodeURIComponent(value))
    });
    let temp = await loadSetter(destination);
    let tempJson = {temp};
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.json(tempJson);
    console.log(`-------------`)
}).listen(3000, () => console.log("Server running on port 3000"));

/* 
// res.send(`<body><a id='click' href='${temp}'>${temp}</a></body>`);
http://192.168.1.105:3000/?rt1=압구정현대백화점&rt2=올림픽공원&rt3=코엑스
<script>setTimeout(()=>{ document.getElementById('click').click();},2000)</script>
nmap://route/car
?slat=37.3595953
&slng=127.1053971
&sname=%EA%B7%B8%EB%A6%B0%ED%8C%A9%ED%86%A0%EB%A6%AC
&secoords=37.359761,127.10527
&dlng=127.1267772
&dlat=37.4200267
&dname=%EC%84%B1%EB%82%A8%EC%8B%9C%EC%B2%AD
&decoords=37.4189564,127.1256827
&v1lng=126.9522394
&v1lat=37.464007
&v1name=%20%EC%84%9C%EC%9A%B8%EB%8C%80%ED%95%99%EA%B5%90
&v1ecoords=37.466358,126.948357
&appname=com.example.myapp


'nmap://route/car?slat=37.3595953&slng=127.1053971&sname=그린팩토리&secoords=37.359761,127.10527&dlng=127.1267772&dlat=37.4200267&dname=성남시청&decoords=37.4189564,127.1256827&v1lng=126.9522394&v1lat=37.464007&v1name= 서울대학교&v1ecoords=37.466358,126.948357&v2lng=126.6578437&v2lat=37.6164711&v2name= 현대아울렛&v2ecoords=37.6164711,126.6578437&appname=com.example.myapp'



*/