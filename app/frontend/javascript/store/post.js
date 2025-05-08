document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('storeForm');
    const res = document.getElementById('msg');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // フォーム送信によるページリロードを防ぐ

        const store_name = document.getElementById('store_name').value;
        const store_address = document.getElementById('store_address').value;
        const contact_name = document.getElementById('contact_name').value;
        const phone_number = document.getElementById('phone_number').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const user_info = {
            "store_name":store_name,
            "store_address":store_address,
            "contact_name":contact_name,
            "phone_number":phone_number,
            "email":email,
            "password":password
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
