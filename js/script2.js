const hourEl = document.querySelector('.hour');
const inputEl = document.querySelector('.search-input');
const bttnsearch = document.querySelector('.search-btn');
const apiKey = "1322b05d970deb80c22a18f440749452";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const apiUrlh = "https://www.timeapi.io/api/time/current/coordinate?";
const Bg = document.getElementById("bg-vd"); 
let data;

// Evento ativado pelo botão search
bttnsearch.addEventListener("click", async () => {
    const city = inputEl.value;
    const data = await tempo(city);
    if (data) {
        const currentHour = await hora(data);
        setInterval(() => hora(data), 60000);
        setBack(data, currentHour.hour);
        setInterval(() => setBack(data, currentHour.hour), 60000);
    }
});

// Função para buscar as informações meteorológicas da cidade
async function tempo(city) {
    const resposta = await fetch(apiUrl + city + `&appid=${apiKey}`);
    if (!resposta.ok) {
        alert("Cidade não encontrada. Tente novamente.");
        return null;
    }
    data = await resposta.json();

    document.querySelector('.city').innerHTML = data.name;

    document.querySelector('.temp').innerHTML = Math.round(data.main.temp) + 'ºC';

    document.querySelector('.wind-value').innerHTML = (data.wind.speed * 3.6).toFixed(1) + ' km/h';

    document.querySelector('.humidity-value').innerHTML = data.main.humidity + '%';

    document.querySelector('.cloud-value').innerHTML = data.weather[0].description;

    localStorage.setItem('cidadeSalva', city);
    return data;
}

// Função para buscar a hora baseada na coordenada
async function hora(data) {
    const lat = data.coord.lat;
    const lon = data.coord.lon;

    const res = await fetch(`${apiUrlh}latitude=${lat}&longitude=${lon}`);
    const hour = await res.json();
    
    // Formatação da hora
    hourEl.innerHTML = `${String(hour.hour).padStart(2, '0')}:${String(hour.minute).padStart(2, '0')} - ${hour.dayOfWeek}, ${hour.month}/${hour.day}/${hour.year}`;
    console.log(data.weather[0].description)
    return hour;
}
//Acredito ter redundancia no caminho (path), mas ainda assim acredito que seria zerado o path e so mudar quando coincidir com a condicao  nesse caso apenas vai atualizar quando mudado

// Função para alterar o background com base no clima e na hora
/* 
async function setBack(data, hour) {
    
    if ((data.weather[0].description === 'clear sky' || data.weather[0].description === 'few clouds') && hour >= 4 && hour < 18) {
        Bg.src = "/video/dayClearsky.mp4";
    } 

    else if ((data.weather[0].description === 'clear sky' || data.weather[0].description === 'broken clouds') && (hour >= 18 || hour < 4)) {
        Bg.src = "/video/nightClearsky.mp4";
    } 

    else if ((data.weather[0].description === 'clear sky' || data.weather[0].description === 'broken clouds') && hour === 17) {
        Bg.src = "/video/sunset.mp4";
    }    

    else if ((data.weather[0].description === 'light rain' || data.weather[0].description === 'rain') && hour >= 4 && hour < 18) {
        Bg.src = "/video/rainday.mp4";
    } 

    else if (data.weather[0].description === 'rain' && (hour >= 18 || hour < 4)) {
        Bg.src = "/video/rainnight.mp4";
    }

    else if (data.weather[0].description === 'thunderstorm') {
        Bg.src = "/video/thunderstorm.mp4";
    } 

    else if (data.weather[0].description === 'scattered clouds' && (hour >= 18 || hour < 6)) {
        Bg.src = "/video/scattered.mp4";
    }

}*/

// Carrega a cidade salva ao carregar a página
window.addEventListener("load", async () => {
    const cidadeSalva = localStorage.getItem("cidadeSalva");
    if (cidadeSalva) {
        inputEl.value = cidadeSalva;

        const data = await tempo(cidadeSalva);
        if (data) {
            const currentHour = await hora(data);
            setInterval(() => hora(data), 60000);
            setBack(data, currentHour.hour);
        }
    }
});
