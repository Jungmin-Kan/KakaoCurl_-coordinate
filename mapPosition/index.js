const exec = require('child_process').exec;
let SEQUENCE = 1, LOCAL = {}, URL = ``;

const resetGlobal = () => {
    SEQUENCE = 1;
    LOCAL = {};
    URL = ``;
}

/**
 * 
 * @param {String} value 
 * @returns 
 */
const makeLocalUrl = (value) => {
    let STR_ADDRESS = encodeURIComponent(value);
    return `curl 'https://search.map.kakao.com/mapsearch/map.daum?callback=jQuery18106437037214681931_1659729192607&q=${STR_ADDRESS}&msFlag=A&sort=0' \
    -H 'authority: search.map.kakao.com' \
    -H 'accept: */*' \
    -H 'accept-language: ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7' \
    -H 'cookie: webid=6f2a9728a38f45e98cceeb1d44ee2f0f; webid_ts=1658939060539; kd_lang=ko; _ga=GA1.2.1972692317.1659262640; _kadu=n8nsuyU1zqts9FQa_1659262647183; TIARA=E2wR3z9WglgcanAjhOO4Xw1OilC.PFhD66lk.g_sjKblgyH8SeGnSscHcYTjdAm8BjaLF4ZD2QBvHFN3HH_tGKjqn9r9gz.Qq79t9PWdLUw0; _kdt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkZXZlbG9wZXJfaWQiOjI4NjE0NSwidG9rZW4iOiI4MGMwMGQwZGMxMjZiNGQyYTBlYzJjOTMwZmYxMGViZDgxNjQ4NGU2NTM4MzIwNjFkNjc5YmY1YWRjOTkxNDRkIn0.7leKL8zMmjOdbgYHkbw1zYjpdiK4KUmtykXpCdeKhas; _pfdl=y; _karb=ZiBtW5K3eEm6HA8m_1659508708696; __T_=1; _kawlt=6einLo-3fBhhpMgL3ex5vxnl3bMmr7LWOnYnp7Asf3lfW3Gt2N3BtTb9YmcRlIe1Rcu-x6J4GY19Ds0dIGTiw824uuVGttu8zeLWHFzmNZBOQ7zDD3h9LCdGtxAxeV5q; _kawltea=1659804589; _karmt=brii29FYeIaETTpNkXYuNGWGi_Pp3hNkjbLywFN6pT5nA0a0vpJSnP8mL9aFbbGa; _karmtea=1659815389; _kahai=8a6cfcc21f43e099b4f587de6fb9478c3f36c8d1699f88facd473346afe91809; _T_ANO=kWrvpAEOVu2BtH4cXwAsjqLSSidhgOorCpub3zS5hRAq4CPdpH1ak7QAWbAQlUDY5hJsPnqYDARKv1jn2M/r2CwRA6bc0ML+7VMphlDJyATeHfdGaPpcg/THxVKM1ZpVlIjwIXm2bszZsxv68ukW/Mw1ugh0HyrI8Jf7p3fwHdJYUGD8DxMySKTP3jRfY5NEENkLhC9Ufr0lxeW9Eac6+pV0HMky/HQLlqyrVtuS6LCoJ7kMVARvz33LVUZIRzRxtnK6F9Na3z7fmz+Ewl73h5Ta+wNcHJetYfklkuFCY2onGnJYnga3vTuQSyZ6LxUxzhlEad+H6HcA3dFM4zamxA==' \
    -H 'referer: https://map.kakao.com/' \
    -H 'sec-ch-ua: ".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"' \
    -H 'sec-ch-ua-mobile: ?0' \
    -H 'sec-ch-ua-platform: "macOS"' \
    -H 'sec-fetch-dest: script' \
    -H 'sec-fetch-mode: no-cors' \
    -H 'sec-fetch-site: same-site' \
    -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36' \
    --compressed`;
}
const findLocation = async (value) => {
    exec(value, (error, stdout, stderr) => {
        let getObj = parseAtFilter(stdout);
        LOCAL[SEQUENCE] = getObj;
        SEQUENCE += 1;
        if (error !== null) { console.log('exec error: ' + error); }
    });
}
const parseAtFilter = (stdout) => {
    let filter = "/**/jQuery18106437037214681931_1659729192607";
    let temp = stdout.replace(filter, '').replace('({', '{').replace('});', '}');
    let pareToJson = JSON.parse(temp);
    let obj = {};
    // console.log(pareToJson);
    if (pareToJson.place.length) {
        obj._name = pareToJson.place[0].name;
        obj._x = pareToJson.place[0].x;
        obj._y = pareToJson.place[0].y;
        obj._confirmid = pareToJson.place[0].confirmid;
    } else {
        obj._name = pareToJson.address[0].addr;
        obj._x = pareToJson.address[0].x;
        obj._y = pareToJson.address[0].y;
    }
    return obj;
};
const makeNaviUrl = () => {
    // &carMode=SHORTEST_REALTIME : 최적거리
    // &carMode=SHORTEST_DIST  : 최단거리
    let url = `https://map.kakao.com/?map_type=TYPE_MAP&target=car&carMode=SHORTEST_DIST`, rt_kmap = `&rt=`, rt_name = ``;

    Object.entries(LOCAL).forEach(([key, value]) => {
        rt_kmap += `${value._x},${value._y},`;
        rt_name += `&rt${key}=${value._name}`;
    });
    url += rt_kmap;
    url += rt_name;
    url += `&rtTypes=`;
    for (let index = 1; index < SEQUENCE; index++) { url += `PLACE,` }
    
    URL = url;
    return new Promise((resolve, rejects) => {
        resolve(URL);
    });
    
}


const delayGetLocal = async (text, time) => {
    setTimeout(() => {
        findLocation(makeLocalUrl(text))
    }, time)
}

exports.loadSetter = async (arr) => {
    
    resetGlobal();
    console.log(SEQUENCE, LOCAL, URL)
    for (let index = 0; index < arr.length; index++) {
        await delayGetLocal(arr[index], 200 * index);
    }

    return await new Promise((resolve) =>
        setTimeout(async () => {
            let temp = await makeNaviUrl();
            resolve(temp);
        }, 400 * arr.length)
    );
}