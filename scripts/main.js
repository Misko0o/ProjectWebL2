carouselImages =[
    "https://images.radio-canada.ca/q_auto,w_1250/v1/ici-info/16x9/accident-collision-becancour-autoroute-30.jpg",
    "https://www.washingtonpost.com/wp-apps/imrs.php?src=https%3A%2F%2Farc-anglerfish-washpost-prod-washpost%252Es3%252Eamazonaws%252Ecom%2Fpublic%2FHR4SV7STTQZOUPLGBYGC4GQLGM_size-normalized%252EJPG&w=992&h=662",
    "https://www.washingtonpost.com/wp-apps/imrs.php?src=https%3A%2F%2Farc-anglerfish-washpost-prod-washpost%252Es3%252Eamazonaws%252Ecom%2Fpublic%2F7U3ATAHS4UI6VABFLU2IS5UKZA%252Ejpg&w=992&h=662",
    "https://www.washingtonpost.com/wp-apps/imrs.php?src=https%3A%2F%2Farc-anglerfish-washpost-prod-washpost%252Es3%252Eamazonaws%252Ecom%2Fpublic%2FRI5G7YWTEEI63LELZV62AULI5E_size-normalized%252Ejpg&w=992&h=662",
    "https://www.washingtonpost.com/wp-apps/imrs.php?src=https%3A%2F%2Farc-anglerfish-washpost-prod-washpost%252Es3%252Eamazonaws%252Ecom%2Fpublic%2F7SPM5SHZULAYCB5HCCGSOGOV44%252Ejpg&w=992&h=662"
]

imageText = [
    "Accident majeur à Bécancour : trois morts et deux blessés",
    "Is Bougainville the next battleground between China and the U.S.?",
    "Trump condamné pour outrage, menacé d'incarcération' à son procès à New York",
    "Quatre suspects mis en examen pour terrorisme après l'attentat en Russie",
    "Pourquoi les moulins à vent ont-ils disparu ?"
]

controlImagesOptions = [
    "../images/not_colored_circle.png",
    "../images/color_circle.png"
]

currencyNames = ["EUR", "USD", "GBP", "CHF"];

function fetchAndDisplayNews(searchStr) {
    fetch(`../php_files/publication_news.php?search=${searchStr}&theme=${localStorage.getItem("theme")}`)
        .then(response => response.json()) 
        .then(data => {

            const container = document.getElementById('content-container');
            var articles = container.querySelectorAll('.article');
            let infoDiv = document.getElementById("noResults");

            articles.forEach(function(article) {
                container.removeChild(article);
            });
            
            if (data.length == 0){
                infoDiv.innerText = "Sorry, your search returned no results :(";
                infoDiv.style.display = "block";
            }
            else{
                infoDiv.style.display = "none";
            }

            let i = 0;
            data.forEach(news => {
                const article = document.createElement('div');
                article.className = 'article';
                article.id = news.id;

                const imgContainer = document.createElement('div');
                imgContainer.className = 'img-container';

                const img = document.createElement('img');
                img.src = news.image;
                imgContainer.appendChild(img);



                img.addEventListener("click", function() {
                    fetch(`../php_files/news.php?id=${news.id}`)
                        .then(response => {
                            if (response.ok) {
                                window.location.href = response.url;
                            } else {
                                console.error('erreur');
                            }
                        })
                        .catch(error => console.error('erreur', error));
                });
                
               
            
                const articleText = document.createElement('div');
                articleText.className = "article-text";
                
                const h2 = document.createElement('h3');
                h2.className = "title";
                h2.textContent = news.title;


                h2.addEventListener('click', () => {
                    fetch(`../php_files/news.php?id=${news.id}`)
                        .then(response => {
                            if (response.ok) {
                                window.location.href = response.url;
                            } else {
                                console.error('erreur');
                            }
                        })
                        .catch(error => console.error('erreur', error));
                });


                const desc = document.createElement('p');
                desc.className = "desc";
                desc.textContent = news.content;

                const dateAndBtn = document.createElement("div");
                dateAndBtn.id = "date-and-btn";
                const date = document.createElement('p');
                date.textContent = news.date;
                date.style.marginTop = "0px";
                const commentBtn = document.createElement("button");
                commentBtn.innerText = "View comments";
                commentBtn.style.height = "2em";

                dateAndBtn.appendChild(date);
                dateAndBtn.appendChild(commentBtn);
                dateAndBtn.style.display = "flex";
                dateAndBtn.style.justifyContent = "space-between";
                dateAndBtn.style.alignContent = "center";
                commentBtn.addEventListener("click", () => {
                    window.location = `../php_files/comments.php?id=${article.id}`;
                });
                
                articleText.appendChild(h2);
                articleText.appendChild(desc);
                articleText.appendChild(dateAndBtn);
                
                article.appendChild(imgContainer);
                article.appendChild(articleText);

                container.appendChild(article)
                i++;
            });
        })
        .catch(error => console.error('Ошибка загрузки новостей:', error));
}

function createControlImages(){
    var imageController = document.getElementById("image-controller");
    for(var i = 0; i < carouselImages.length; i++){
        var img = document.createElement("img");
        img.src = controlImagesOptions[0];
        img.className = "control-img";
        img.id = "img" + i;
        imageController.appendChild(img);
    }
}

function createInterval(startIndex, items, controlButtons){
    index = startIndex;
    return setInterval(() => {
        const nextIndex = (index + 1) % carouselImages.length;
        items[index].classList.remove("active");
        items[index].style.opacity = "0";
        controlButtons[index].src = "../images/not_colored_circle.png";

        items[nextIndex].classList.add("active");
        items[nextIndex].style.opacity = "1";
        controlButtons[nextIndex].src = "../images/color_circle.png";
        
        index = nextIndex;
    }, 5000);
}

function carouselStart(){
    const carousel = document.getElementById("carousel");
    let index = 0;

    for(var i = 0; i < carouselImages.length; i++){
        let carouselItem = document.createElement("div");
        carouselItem.className = "carousel-item";
        carouselItem.id = i;
        let img = document.createElement("img");
        let carouselCaption = document.createElement("div");
        carouselCaption.className = "carousel-caption";
        let title = document.createElement("h2");
        
        img.src = carouselImages[i];
        title.innerText = imageText[i];

        carouselCaption.appendChild(title);
        carouselItem.appendChild(img);
        carouselItem.appendChild(carouselCaption);
        carousel.appendChild(carouselItem);
    }

    createControlImages();
    const items = carousel.querySelectorAll(".carousel-item");
    const controlButtons = document.getElementsByClassName("control-img");
    items[0].classList.add("active");
    items[0].style.opacity = "1";
    controlButtons[0].src = "../images/color_circle.png";


    interval = createInterval(0, items, controlButtons);

    for(var i = 0; i < controlButtons.length; i++){
        let btn = controlButtons[i];
        btn.addEventListener("click", () => {
            clearInterval(interval);
            btnId = btn.id;
            index = Number(btnId[btnId.length - 1])
            
            for(var i = 0; i < controlButtons.length; i++){
                items[i].classList.remove("active");
                items[i].style.opacity = "0";
                controlButtons[i].src = controlImagesOptions[0];
            }
            items[index].classList.add("active");
            items[index].style.opacity = "1";
            btn.src = controlImagesOptions[1];
            interval = createInterval(index, items, controlButtons);
        });
    }
}



function getWeather(){
    const apiKey = "3d0aff593cca92ccdfa004fe4da93edf";
    const city = document.getElementById("city").value;

    if (!city){
        alert("Please enter a city");
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data)
        })
        .catch(error => {
            console.error("Error fetching current weather data: ", error);
            alert("Error fetching current weather data. Please try again");
        });
    
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list)
        })
        .catch(error => {
            console.error("Error fetching hourly forecast data: ", error);
            alert("Error fetching hourly forecast data. Please try again");
        })
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273,15);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHTML = `
            <p>${temperature}°C</p>
        `;

        const weatherHtml = `
            <p>${cityName}</p>
            <p>${description}</p>
        `;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        showImage();
    }
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    const next24Hours = hourlyData.slice(0, 8);

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273,15);
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block';
}

function createCurrencies(){
    let images = ["../images/eu.webp", "../images/US.svg", "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/1200px-Flag_of_the_United_Kingdom_%281-2%29.svg.png", "https://uxwing.com/wp-content/themes/uxwing/download/flags-landmarks/switzerland-flag-icon.png"];
    let currencySymbols = ["€", "$", "£", "SFr"];

    let container = document.getElementById("currency-container");
    for(let i = 0; i < 4; i++){
        let currency = document.createElement("div");
        currency.className = "currency";

        let frstDiv = document.createElement("div");
        let img = document.createElement("img");
        img.src = images[i];
        let currencyName = document.createElement("p");
        currencyName.innerText = currencyNames[i];
        frstDiv.appendChild(img);
        frstDiv.appendChild(currencyName);

        let secDiv = document.createElement("div");
        let sumInput = document.createElement("input");
        sumInput.id = "currency" + i;
        let currencySymbol = document.createElement("p");
        currencySymbol.innerText = currencySymbols[i];
        secDiv.appendChild(sumInput);
        secDiv.appendChild(currencySymbol);

        currency.appendChild(frstDiv);
        currency.appendChild(secDiv);
        container.appendChild(currency);
    }
}

function getCurrencyFromAPI(from, to, amount){
    const options = {method: 'GET', headers: {accept: 'application/json'}};
    return fetch(`https://api.fastforex.io/convert?from=${from}&to=${to}&amount=${amount}&api_key=6f04750422-4082314d17-scjrs9`, options)
    .then(response => response.json())
    .then(response => {
        if (to == "EUR"){
            return response.result.EUR
        }
        else if (to == "USD"){
            return response.result.USD
        }
        else if (to == "GBP"){
            return response.result.GBP
        }
        else if (to == "CHF"){
            return response.result.CHF
        }
    })
    .catch(err => console.error(err));
}


function createEventHandlers(){
    let inputs = document.querySelectorAll(".currency input");

    for(let i = 0; i < 4; i++){
        const options = {method: 'GET', headers: {accept: 'application/json'}};

        inputs[i].addEventListener("input", () => {
            let id = inputs[i].id;
            let baseCurrency = Number(id[8]);

            let value = inputs[i].value;
            if (value == ""){
                inputs[i].value = "1";
                value = 1;
            }
            else if (/^\d+$/.test(value) == false){
                return;
            }
            

            for(let j = 0; j < 4; j++){
                if (j != baseCurrency){
                    getCurrencyFromAPI(currencyNames[baseCurrency], currencyNames[j], value)
                    .then(res => inputs[j].value = res);
                }
            }
        });
    }
}


function getCurrencyPrices(){
    createCurrencies();
    let inputs = document.querySelectorAll(".currency input");
    inputs[0].value = 100;

    for(let j = 1; j < 4; j++){
        getCurrencyFromAPI(currencyNames[0], currencyNames[j], 100)
        .then(val => inputs[j].value = val);
    }
    
    createEventHandlers();
}


window.onload = () => {
    if (!localStorage.getItem("theme")){
        localStorage.setItem("theme", "Toutes");
    }

    carouselStart();
    fetchAndDisplayNews("");
    var cityInput = document.getElementById("city");
    cityInput.value = "Nice";
    getWeather();
    getCurrencyPrices();


    var searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", () => {
        let txt = searchInput.value;
        fetchAndDisplayNews(txt);
    });


    let contentContainer = document.getElementById("content-container");
    document.getElementById("contentSearchBtn").addEventListener("click", () => {
        contentContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });


    let themes = document.querySelectorAll("#themes-container p");
    
    for(let theme of themes){
        theme.addEventListener("click", () => {
            let txt = theme.innerText;
            console.log(txt);
            localStorage.setItem("theme", txt);
            fetchAndDisplayNews("");
            contentContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }


    var loginBtn = document.getElementById("btn");
    var addNewsBtn = document.getElementById("addArticle");
    var isLoggedIn = localStorage.getItem("loggedin") === 'true';
    
    if(isLoggedIn){
        loginBtn.innerText = "Logout";
        loginBtn.style.backgroundColor = "#EDDA3C";
        loginBtn.style.color = "black";
    }
    else{
        addNewsBtn.style.display = "none";
    }

    loginBtn.addEventListener("click", () => {
        if(isLoggedIn){
            localStorage.clear();
            window.location.reload();
        }
        else{
            window.location.replace("../html/login.html");
        }
    });

    addNewsBtn.addEventListener("click", () => {
        window.location.replace("../html/create_post_page.html");
    })
}