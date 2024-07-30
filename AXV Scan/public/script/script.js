async function startScan() {
  const directory = document.getElementById('directory').value;
  const response = await fetch('/scan', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ directory })
  });
  const results = await response.json();
  document.getElementById('result').innerText = results.join('\n');
}