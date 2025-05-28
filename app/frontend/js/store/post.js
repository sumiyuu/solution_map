async function get_latitude_and_longitude(address) {
    const accessToken = 'pk.eyJ1IjoiaXdhbW90b29vIiwiYSI6ImNtNW5pMjc3cDBiMXEya29qaXJrZG15eG4ifQ.WFLmzlqHPdPSYi-mzHGnMg';
    const encodedAddress = encodeURIComponent(address);

    const response = await fetch(
        `https://api.mapbox.com/search/searchbox/v1/forward?q=${encodedAddress}&access_token=${accessToken}&country=JP&language=ja`
    );
    const data = await response.json();

    if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].geometry.coordinates;
        console.log(`緯度: ${lat}, 経度: ${lng}`);
        return [lng, lat];
    } else {
        return "該当の住所が見つかりませんでした";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('storeForm');
    const res = document.getElementById('msg');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // フォーム送信によるページリロードを防ぐ

        let longitude = 0;
        let latitude = 0;

        const store_name = document.getElementById('store_name').value;
        const store_address = document.getElementById('store_address').value;
        const contact_name = document.getElementById('contact_name').value;
        const phone_number = document.getElementById('phone_number').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            [longitude, latitude] = await get_latitude_and_longitude(store_address);

        } catch(e){
            console.error(e);
        }


        const user_info = {
            "store_name":store_name,
            "store_address":store_address,
            "contact_name":contact_name,
            "phone_number":phone_number,
            "email":email,
            "password":password,
            "latitude":latitude,
            "longitude":longitude
        };

        for (const item in user_info) {
            if (user_info[item] == "") {
                res.textContent = "全ての項目を入力してください";
                res.style.color = "red";
                return;
            }
        }

        const url = "http://localhost:8080/store-register";

        fetch(url,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user_info)
        })
        .then(response => {
            if(!response.ok) {
                throw new Error(`HTTPエラー! ステータス: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data["status"] == "error") {
                res.textContent = data["msg"];
                res.style.color = "red";

            } else {
                res.textContent = "登録が完了しました";
                window.location.href = data.redirect;

            }
            res.textContent = data["msg"]
        })
        .catch(error => {
            console.error('エラー:', error.message);
        })
    });
});
