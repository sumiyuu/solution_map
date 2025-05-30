document.addEventListener('DOMContentLoaded', () => {
    const raw = sessionStorage.getItem('store_info');
    if (!raw) {
        alert("store情報が見つかりません。");
        return;
    }

    const data = JSON.parse(raw);

    // フォームに表示
    document.getElementById('store-name').value = data.store_name;
    document.getElementById('store-address').value = data.store_address;
    document.getElementById('student-discount').value = data.student_discount;
    document.getElementById('store-description').value = data.description;

    document.getElementById('submit-button').addEventListener('click', async () => {
        const form_data = new FormData();

        form_data.append("store_name",document.getElementById('store-name').value);
        form_data.append("student_discount",document.getElementById('student-discount').value);
        form_data.append("store_description",document.getElementById('store-description').value);
        
        
        const image_file = document.getElementById('store-image').files[0];

        if (image_file) {
            form_data.append("image", image_file);
        }

        
        const response = await fetch('/store-info-edit', {
            method: 'POST',
            // headers: { 'Content-Type': 'application/json' },
            body: form_data
        });

        const result = await response.json();
        
        if (result.redirect) {
            window.location.href = result.redirect;
        } else {
            alert(result.msg || '更新に失敗しました');
        }
    });
});
