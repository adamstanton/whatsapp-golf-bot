var createCurvePath = function(start, end, elevation) {
    var start3 = globe.translateCordsToPoint(start.latitude, start.longitude);
    var end3 = globe.translateCordsToPoint(end.latitude, end.longitude);
    var mid = (new LatLon(start.latitude, start.longitude)).midpointTo(new LatLon(end.latitude, end.longitude));
    var middle3 = globe.translateCordsToPoint(mid.lat(), mid.lon(), elevation);

    var curveQuad = new THREE.QuadraticBezierCurve3(start3, middle3, end3);
    //   var curveCubic = new THREE.CubicBezierCurve3(start3, start3_control, end3_control, end3);

    var cp = new THREE.CurvePath();
    cp.add(curveQuad);
    //   cp.add(curveCubic);
    return cp;
}