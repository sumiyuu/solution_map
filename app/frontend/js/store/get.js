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


