fetch('http://10.0.2.2:8000/menu')
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error(error));