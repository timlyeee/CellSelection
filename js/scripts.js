//Set the polygons as it initialize
//1. Array for polygons
var polyCenters = [
    [51.505, -0.09],
    [51.522, - 0.09],
    [51.488, - 0.09],
    [51.5136, - 0.0659],
    [51.4966, - 0.0659],
    [51.5136, - 0.1141],
    [51.4966, - 0.1141]
];

//A path for the simulation
var Path = [
    [51.505, -0.09],
    [51.4966, -0.1141],
    [51.4966, -0.09],
    [51.488, -0.09]
]
var avatar;
var mymap;

function initialize(){

    mymap = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoibHllZWUiLCJhIjoiY2thNGYxbWQzMGNuODNvb2FidGc2cW5wMCJ9.rl6UKu71UtwYQKibnUG-Sg'
    }).addTo(mymap);

    //Draw the hexagones for GSM simulation, need a return value to save each hexagone layer.
    for (var center of polyCenters) {
        drawHexagone(center, L, 0.01, mymap);
    }

    //Initialize a path as the avatar is at the beginning point.
    drawPath(Path, L, mymap);
}

function drawHexagone(center, L, distance, mymap) {
    // create a red polygon from an array of LatLng points
    //伦敦纬度51°30′，cos=0.622，所有涉及经度的计算都需要除以0.622
    //center 为传参，外部遍历本函数做循环处理即可。
    var latlngs = [
        [center[0] + distance * 1.73 / 2, center[1] + distance / (2 * 0.622)],
        [center[0], center[1] + distance / 0.622],
        [center[0] - distance * 1.73 / 2, center[1] + distance / (2 * 0.622)],
        [center[0] - distance * 1.73 / 2, center[1] - distance / (2 * 0.622)],
        [center[0], center[1] - distance / 0.622],
        [center[0] + distance * 1.73 / 2, center[1] - distance / (2 * 0.622)]];
    var polygon = L.polygon(latlngs, { color: '#fd79a8' }).addTo(mymap);
    // zoom the map to the polygon
    //mymap.fitBounds(polygon.getBounds());

}
function drawPath(PathArrays, L, mymap) {
    var polyline = L.polyline(PathArrays, { color: '#0984e3' }).addTo(mymap);
}

//输入一个点的经纬度坐标，返回信号强度(为距离与0.01的比值)
//如果距离大于0.01，返回-1，表示无信号
//如果（0.01-距离）与0.01的比值在0-0.25，0.25-0.5，0.5-0.75，0.75-1之间，则信号强度分别为1，2，3，4
function signalIntensity(position, polyCenter) {
    var distance = Math.sqrt((position[0] - polyCenter[0]) ^ 2 + ((position[1] - polyCenter[1]) * 1.607) ^ 2);
    if (distance > 0.01) {
        return -1;
    }
    var ratio = (0.01 - distance) / 0.01;
    if (ratio > 0 && ratio <= 0.25) {
        return 1;
    }
    else if (ratio > 0.25 && ratio <= 0.5) {
        return 2;
    }
    else if (ratio > 0.5 && ratio <= 0.75) {
        return 3;
    }
    else if (ratio > 0.75 && ratio <= 1) {
        return 4;
    }
    //返回0则判断出错
    return 0;
}

window.onload = initialize;
