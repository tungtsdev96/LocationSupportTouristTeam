'use strict';

const fs = require('fs');
const path =  './tungts20182/vn_city_province.json';

// let rawdata = fs.readFileSync(path);  

fs.readFile(path, (err, data) => {  
    if (err) throw err;
    let city_province = JSON.parse(data);  

    var rs = [];

    city_province.forEach(item => {
        var tmp = {};
        tmp.id = item.id;
        tmp.name = item.name;
        tmp.code = item.code;
        
        console.log(tmp);

        rs.push(tmp);
    })


    // console.log(rs);

    fs.writeFile('vn_city_province.json', JSON.stringify(rs), (err) => {  
        if (err) throw err;
        console.log('Data written to file');
    });

});


