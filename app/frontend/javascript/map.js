document.addEventListener('DOMContentLoaded', async () => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiaXdhbW90b29vIiwiYSI6ImNtNW5pMjc3cDBiMXEya29qaXJrZG15eG4ifQ.WFLmzlqHPdPSYi-mzHGnMg';
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/iwamotooo/cm5x9weho00ry01rdc8xvctwu',
        center: [139.7454, 35.6586],
        zoom: 10
    });
    const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        marker: false
    });
    document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
    let marker;
    function addMarkerAndArea(lngLat) {
        if (marker) marker.remove();
        marker = new mapboxgl.Marker()
            .setLngLat(lngLat)
            .addTo(map);
        map.getSource('area').setData({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [lngLat.lng, lngLat.lat]
            }
        });
        map.flyTo({
            center: lngLat,
            zoom: 13
        });
    }
    map.on('load', () => {
        map.addSource('area', {
            type: 'geojson',
            data: {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [0, 0]
                }
            }
        });
        map.addLayer({
            id: 'area-layer',
            type: 'circle',
            source: 'area',
            paint: {
                'circle-radius': {
                    stops: [
                        [0, 0],
                        [20, metersToPixelsAtMaxZoom(1000, 35.6586)]
                    ],
                    base: 2
                },
                'circle-color': 'red',
                'circle-opacity': 0.3
            }
        });
        geocoder.on('result', (e) => {
            if (marker) marker.remove();
            marker = new mapboxgl.Marker()
                .setLngLat(e.result.center)
                .addTo(map);
            map.getSource('area').setData({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: e.result.center
                }
            });
            map.flyTo({
                center: e.result.center,
                zoom: 13
            });
        });
        map.on('click', (e) => {
            addMarkerAndArea(e.lngLat);
        });
    });
    function metersToPixelsAtMaxZoom(meters, latitude) {
        const earthCircumference = 40075017;
        const latitudeRadians = latitude * (Math.PI / 180);
        return (meters / earthCircumference) * Math.cos(latitudeRadians) * Math.pow(2, 20) * 256;
    }
    var sampleShop = new mapboxgl.Marker()
    .setLngLat([139.697699,35.69405])
    .addTo(map);
    var popup = new mapboxgl.Popup({ offset: 25 })
    .setText('店舗名: 焼肉ライク\n学割内容: コーラ無料、おかわり無料');
    sampleShop.setPopup(popup);

});
