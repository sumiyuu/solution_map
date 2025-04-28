document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('userForm');
    const res = document.getElementById('msg');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // フォーム送信によるページリロードを防ぐ

        const display_name = document.getElementById('display_name').value;
        const first_name = document.getElementById('first_name').value;
        const last_name = document.getElementById('last_name').value;
        const birth = document.getElementById('birth').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const user_info = {
            "display_name":display_name,
            "first_name":first_name,
            "last_name":last_name,
            "birth":birth,
            "phone":phone,
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

        const url = "http://localhost:8080/user-register";

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
