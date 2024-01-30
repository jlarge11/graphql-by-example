async function fetchGreeting() {
    const response = await fetch('http://localhost:9000', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },

        body: JSON.stringify({
            query: 'query { greeting }',
        }),
    });

    const { data } = await response.json();

    return data.greeting;
}

async function main() {
    const greeting = await fetchGreeting();
    document.getElementById('greeting').textContent = greeting;
}

main();