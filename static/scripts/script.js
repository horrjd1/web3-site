$(document).ready(function () {
    $.get('/api/countries', function (data) {
        console.log("Ajax testing")
        console.log(JSON.stringify(data))
    }).fail(function () {
        alert("No Data Found")
    });
});

/*

Get single item
change <country name>

$.get('/api/countries/<country_name>', function (data) {
    console.log("Ajax testing")
    console.log(JSON.stringify(data))
}).fail(function () {
    alert("No Data Found")
});


Post

$.post()

*/