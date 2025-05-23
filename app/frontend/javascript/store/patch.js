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
    const data = {
        store_name: document.getElementById('store-name').value,
        student_discount: document.getElementById('student-discount').value,
        store_description: document.getElementById('store-description').value
    };

    const response = await fetch('/store-info-edit', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    if (result.redirect) {
        window.location.href = result.redirect;
    } else {
        alert(result.msg || '更新に失敗しました');
    }
});

});
