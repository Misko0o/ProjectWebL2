// ================== main.js (weather removed, football highlight added) ==================

/* --------------------------------------------------------------------------
 *  Static data (carousel images & captions, currency names)
 * --------------------------------------------------------------------------*/
const carouselImages = [
    "https://images.radio-canada.ca/q_auto,w_1250/v1/ici-info/16x9/accident-collision-becancour-autoroute-30.jpg",
    "https://www.washingtonpost.com/wp-apps/imrs.php?src=https%3A%2F%2Farc-anglerfish-washpost-prod-washpost%252Es3%252Eamazonaws%252Ecom%2Fpublic%2FHR4SV7STTQZOUPLGBYGC4GQLGM_size-normalized%252EJPG&w=992&h=662",
    "https://www.washingtonpost.com/wp-apps/imrs.php?src=https%3A%2F%2Farc-anglerfish-washpost-prod-washpost%252Es3%252Eamazonaws%252Ecom%2Fpublic%2F7U3ATAHS4UI6VABFLU2IS5UKZA%252Ejpg&w=992&h=662",
    "https://www.washingtonpost.com/wp-apps/imrs.php?src=https%3A%2F%2Farc-anglerfish-washpost-prod-washpost%252Es3%252Eamazonaws%252Ecom%2Fpublic%2FRI5G7YWTEEI63LELZV62AULI5E_size-normalized%252Ejpg&w=992&h=662",
    "https://www.washingtonpost.com/wp-apps/imrs.php?src=https%3A%2F%2Farc-anglerfish-washpost-prod-washpost%252Es3%252Eamazonaws%252Ecom%2Fpublic%2F7SPM5SHZULAYCB5HCCGSOGOV44%252Ejpg&w=992&h=662"
  ];
  
  const imageText = [
    "Accident majeur à Bécancour : trois morts et deux blessés",
    "Is Bougainville the next battleground between China and the U.S.?",
    "Trump condamné pour outrage, menacé d'incarcération à son procès à New York",
    "Quatre suspects mis en examen pour terrorisme après l'attentat en Russie",
    "Pourquoi les moulins à vent ont-ils disparu ?"
  ];
  
  const controlImagesOptions = ["../images/not_colored_circle.png", "../images/color_circle.png"];
  const currencyNames = ["EUR", "USD", "GBP", "CHF"];
  
  /* --------------------------------------------------------------------------
   *  News fetch & render
   * --------------------------------------------------------------------------*/
  function fetchAndDisplayNews(searchStr) {
    fetch(`../php_files/publication_news.php?search=${searchStr}&theme=${localStorage.getItem("theme")}`)
      .then(r => r.json())
      .then(data => {
        const container = document.getElementById("content-container");
        container.querySelectorAll(".article").forEach(a => container.removeChild(a));
        const infoDiv = document.getElementById("noResults");
        if (!data.length) {
          infoDiv.textContent = "Sorry, your search returned no results :(";
          infoDiv.style.display = "block";
          return;
        }
        infoDiv.style.display = "none";
  
        data.forEach(news => {
          const article = document.createElement("div");
          article.className = "article";
          article.id = news.id;
  
          const imgContainer = document.createElement("div");
          imgContainer.className = "img-container";
          const img = document.createElement("img");
          img.src = news.image;
          img.loading = "lazy";
          imgContainer.appendChild(img);
          imgContainer.addEventListener("click", () => window.location = `../php_files/news.php?id=${news.id}`);
  
          const articleText = document.createElement("div");
          articleText.className = "article-text";
          const h2 = document.createElement("h3");
          h2.className = "title";
          h2.textContent = news.title;
          h2.addEventListener("click", () => window.location = `../php_files/news.php?id=${news.id}`);
          const desc = document.createElement("p");
          desc.className = "desc";
          desc.textContent = news.content;
          const dateAndBtn = document.createElement("div");
          dateAndBtn.id = "date-and-btn";
          const date = document.createElement("p");
          date.textContent = news.date;
          const commentBtn = document.createElement("button");
          commentBtn.textContent = "View comments";
          commentBtn.addEventListener("click", () => window.location = `../php_files/comments.php?id=${news.id}`);
          dateAndBtn.append(date, commentBtn);
  
          articleText.append(h2, desc, dateAndBtn);
          article.append(imgContainer, articleText);
          container.appendChild(article);
        });
      })
      .catch(err => console.error("Ошибка загрузки новостей:", err));
  }
  
  /* --------------------------------------------------------------------------
   *  Carousel
   * --------------------------------------------------------------------------*/
  function createControlImages() {
    const ctrl = document.getElementById("image-controller");
    carouselImages.forEach((_, i) => {
      const dot = document.createElement("img");
      dot.src = controlImagesOptions[0];
      dot.className = "control-img";
      dot.id = `img${i}`;
      ctrl.appendChild(dot);
    });
  }
  
  function createInterval(start, items, dots) {
    let index = start;
    return setInterval(() => {
      const next = (index + 1) % carouselImages.length;
      items[index].classList.remove("active");
      items[index].style.opacity = "0";
      dots[index].src = controlImagesOptions[0];
      items[next].classList.add("active");
      items[next].style.opacity = "1";
      dots[next].src = controlImagesOptions[1];
      index = next;
    }, 5000);
  }
  
  function carouselStart() {
    const carousel = document.getElementById("carousel");
    carouselImages.forEach((src, i) => {
      const item = document.createElement("div");
      item.className = "carousel-item";
      const img = document.createElement("img");
      img.src = src;
      img.loading = "lazy";
      const caption = document.createElement("div");
      caption.className = "carousel-caption";
      caption.innerHTML = `<h2>${imageText[i]}</h2>`;
      item.append(img, caption);
      carousel.appendChild(item);
    });
  
    createControlImages();
    const items = carousel.querySelectorAll(".carousel-item");
    const dots = document.getElementsByClassName("control-img");
    items[0].classList.add("active");
    items[0].style.opacity = "1";
    dots[0].src = controlImagesOptions[1];
    let interval = createInterval(0, items, dots);
  
    Array.from(dots).forEach((dot, i) => {
      dot.addEventListener("click", () => {
        clearInterval(interval);
        Array.from(items).forEach((it, j) => {
          it.classList.toggle("active", j === i);
          it.style.opacity = j === i ? "1" : "0";
          dots[j].src = controlImagesOptions[j === i ? 1 : 0];
        });
        interval = createInterval(i, items, dots);
      });
    });
  }
  
  /* --------------------------------------------------------------------------
   *  Football highlight (replaces weather)
   * --------------------------------------------------------------------------*/
  function embedHighlight() {
    const box = document.getElementById("highlight-container");
    if (!box) return;
    const YT_ID = "-H8tvnWaYs4"; // Chelsea – Liverpool 05‑May‑2025 highlight
    box.innerHTML = `<iframe width="100%" height="315" src="https://www.youtube.com/embed/${YT_ID}" title="Football highlight" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  }
  
  /* --------------------------------------------------------------------------
   *  Currency converter (unchanged)
   * --------------------------------------------------------------------------*/
  function createCurrencies() {
    const images = [
      "../images/eu.webp",
      "../images/US.svg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/1200px-Flag_of_the_United_Kingdom_%281-2%29.svg.png",
      "https://uxwing.com/wp-content/themes/uxwing/download/flags-landmarks/switzerland-flag-icon.png"
    ];
    const symbols = ["€", "$", "£", "SFr"];
    const container = document.getElementById("currency-container");
    currencyNames.forEach((code, i) => {
      const cur = document.createElement("div");
      cur.className = "currency";
      cur.innerHTML = `
        <div><img src="${images[i]}" alt="${code}"><p>${code}</p></div>
        <div><input id="currency${i}"><p>${symbols[i]}</p></div>`;
      container.appendChild(cur);
    });
  }
  
  function getCurrencyFromAPI(from, to, amount) {
    return fetch(`https://api.fastforex.io/convert?from=${from}&to=${to}&amount=${amount}&api_key=6f04750422-4082314d17-scjrs9`)
      .then(r => r.json())
      .then(r => r.result[to]);
  }
  
  function createEventHandlers() {
    const inputs = document.querySelectorAll(".currency input");
    inputs.forEach((inp, i) => {
      inp.addEventListener("input", () => {
        const val = inp.value || "1";
        if (!/^[0-9]+$/.test(val)) return;
        inputs.forEach((other, j) => {
          if (j === i) return;
          getCurrencyFromAPI(currencyNames[i], currencyNames[j], val).then(res => other.value = res);
        });
      });
    });
  }
  
  
  function createEventHandlers() {
    const inputs = document.querySelectorAll(".currency input");
    inputs.forEach((inp, i) => {
      inp.addEventListener("input", () => {
        const base = i;
        let val = inp.value;
        if (!val) val = inp.value = "1";
        if (!/^[0-9]+$/.test(val)) return;
  
        inputs.forEach((destInp, j) => {
          if (j === base) return;
          getCurrencyFromAPI(currencyNames[base], currencyNames[j], val).then(
            (v) => (destInp.value = v)
          );
        });
      });
    });
  }
  
  function getCurrencyPrices() {
    createCurrencies();
    const inputs = document.querySelectorAll(".currency input");
    inputs[0].value = 100;
    currencyNames.slice(1).forEach((name, idx) => {
      getCurrencyFromAPI(currencyNames[0], name, 100).then((v) =>
        (inputs[idx + 1].value = v)
      );
    });
    createEventHandlers();
  }
  
  // -----------------------------------------------------------------------------
  // 6. Main entry
  // -----------------------------------------------------------------------------
  
  window.onload = () => {
    if (!localStorage.getItem("theme")) localStorage.setItem("theme", "Toutes");
  
    carouselStart();
    fetchAndDisplayNews("");
    embedHighlight();
    getCurrencyPrices();
  
    // search bar ---------------------------------------------------------------
    document.getElementById("searchInput").addEventListener("input", (e) => {
      fetchAndDisplayNews(e.target.value);
    });
  
    // scroll to news -----------------------------------------------------------
    const contentContainer = document.getElementById("content-container");
    document
      .getElementById("contentSearchBtn")
      .addEventListener("click", () => {
        contentContainer.scrollIntoView({ behavior: "smooth", block: "start" });
      });
  
    // theme filter -------------------------------------------------------------
    document.querySelectorAll("#themes-container p").forEach((p) => {
      p.addEventListener("click", () => {
        localStorage.setItem("theme", p.innerText);
        fetchAndDisplayNews("");
        contentContainer.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  
    // auth / add news ----------------------------------------------------------
    const loginBtn = document.getElementById("btn");
    const addBtn = document.getElementById("addArticle");
    let isLogged = localStorage.getItem("loggedin") === "true";
  
    if (isLogged) {
      loginBtn.innerText = "Logout";
      loginBtn.style.cssText = "background-color:#EDDA3C;color:black";
    } else {
      addBtn.style.display = "none";
    }
  
    loginBtn.addEventListener("click", () => {
      if (isLogged) {
        localStorage.clear();
        window.location.reload();
      } else {
        window.location.replace("../html/login.html");
      }
    });
  
    addBtn.addEventListener("click", () => {
      window.location.replace("../html/create_post_page.html");
    })
}