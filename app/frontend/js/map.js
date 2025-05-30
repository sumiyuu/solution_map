async function getData(url) {
    try {
        const response = await fetch(url); // modeはデフォルトの 'cors'
        if (!response.ok) {
            throw new Error(`レスポンスステータス: ${response.status}`);
        }
        const json = await response.json();
        return json;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiaXdhbW90b29vIiwiYSI6ImNtNW5pMjc3cDBiMXEya29qaXJrZG15eG4ifQ.WFLmzlqHPdPSYi-mzHGnMg';

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/iwamotooo/cm5x9weho00ry01rdc8xvctwu',
        center: [139.6976, 35.6940],
        zoom: 15
    });

    const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        marker: false,
        countries: 'JP',
        language: 'ja'
    });

    document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

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
                        [20, 100]
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
    });

    const json = await getData("http://localhost:8080/map/stores-info");
    // console.log(json);
    const keys = Object.keys(json);
    
    keys.forEach( key => {
        const info = json[key];
        let id = info["store_users_id"];

        let store_pin = new mapboxgl.Marker()
        .setLngLat([info["longitude"],info["latitude"]])
        .addTo(map);

        let el = store_pin.getElement();
        el.id = id;

        el.addEventListener('click', async () => {
            const infoArea = document.querySelector('.store-info-area');
            infoArea.style.display = 'block';

            const store_info = await getData(`http://localhost:8080/store-info?id=${id}`)

            document.getElementById('store-name').textContent = store_info["store_name"];
            document.getElementById('store-address').textContent = store_info["store_address"];
            document.getElementById('student-discount').textContent = store_info["student_discount"];
            document.getElementById('store-description').textContent = store_info["description"];
            if (store_info["category_id"] === null) {
                document.getElementById("image").src = "";
            } else {
                document.getElementById("image").src = `/uploaded_image/${store_info["category_id"]}`;
            }

        });
    });
    
    document.getElementById('close-button').addEventListener('click', () => {
        document.querySelector('.store-info-area').style.display = 'none';
    });
    
    document.getElementById('store-info-edit').addEventListener('click', () => {
        const storeData = {
            store_name: document.querySelector('#store-name').textContent,
            store_address: document.querySelector('#store-address').textContent,
            description: document.querySelector('#store-description').textContent,
            student_discount: document.querySelector('#student-discount').textContent
        };

        sessionStorage.setItem('store_info', JSON.stringify(storeData));

        window.location.href = '/store-info-edit';
    });
});
