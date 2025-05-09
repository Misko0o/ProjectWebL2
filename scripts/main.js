// ================== main.js (weather removed, football highlight added) ==================

/* --------------------------------------------------------------------------
 *  Static data (carousel images & captions, currency names)
 * --------------------------------------------------------------------------*/
const carouselImages = [
    "https://images.rtl.fr/~c/770v513/rtl/www/1693008-leon-marchand-avec-sa-medaille-d-or-du-200-m-brasse-le-31-juillet-2024-a-paris-la-defense.jpg",
    "https://media.ouest-france.fr/v1/pictures/MjAyNTA1Y2FiZWVjYjNkZjMwMDUxMTQzMTA3Mjg2YWE4ZWY2NTU?width=630&height=354&focuspoint=50%2C25&cropresize=1&client_id=bpeditorial&sign=9dd4f95237b78e35ea3f867c54d81635c1cbd1edc64c0144b93ba2bf912bb2b3",
    "https://img.centrefrance.com/suCPCazmGeZgtz2rJaKldlt9V38ACrDPEnQdgXs83sc/rs:fit:657:438:1:0/bG9jYWw6Ly8vMDAvMDAvMDcvMzcvNDUvMjAwMDAwNzM3NDUwMw.webp",
    "https://les-as-de-l-info.s3.amazonaws.com/images/1746475776_F1%20LEGO%20%232.png_960_540.png",
    "https://images.ladepeche.fr/api/v1/images/view/681a00d4c984a794cf060432/large/image.jpg?v=1"
  ];
  
  const imageText = [
    "Fatigué, battu pour sa rentrée... Léon Marchand accuse-t-il le coup des Jeux olympiques ?",
    "Le Beaulieu Sport Football inaugure sa section féminine loisir",
    "Retrouvez tous les résultats sportifs du 2 au 4 mai en Eure-et-Loir",
    "Les As du sport: Des Formules 1 en Lego!",
    "Asthme : les 3 conditions pour faire du sport en toute sécurité"
  ];
  
  const controlImagesOptions = ["../images/not_colored_circle.png", "../images/color_circle.png"];
  const currencyNames = ["EUR", "USD", "GBP", "CHF"];
  
/* --------------------------------------------------------------------------
 * 2. Demo match stats (keyed по id новости)
 * --------------------------------------------------------------------------*/
const demoMatchStats = {
  // пример: id новости 1
  1: {
    score: "Paris SG 3 – 1 Marseille",
    possession: "62% / 38%",
    shots: "15 / 9 (On target 7 / 3)",
    mvp: {
      name: "Kylian Mbappé",
      stats: "2 гола · 1 голевая · 4 ударов в створ"
    }
  },
  2: {
    score: "Chelsea 2 – 2 Liverpool",
    possession: "48% / 52%",
    shots: "12 / 14 (On target 5 / 6)",
    mvp: {
      name: "Mohamed Salah",
      stats: "1 гол · 1 пас · 90% пас точность"
    }
  }
  // добавь остальные id при желании
};


  /* --------------------------------------------------------------------------
 * 3. News fetch & render (клик по картинке → expand stats)
 * --------------------------------------------------------------------------*/
function fetchAndDisplayNews(searchStr = "") {
  fetch(`../php_files/publication_news.php?search=${searchStr}&theme=${localStorage.getItem("theme")}`)
    .then(r => r.json())
    .then(data => {
      const container = document.getElementById("content-container");
      container.querySelectorAll(".article").forEach(a => a.remove());
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

        // toggle stats expansion on click
        img.addEventListener("click", () => toggleStats(article, news.id));

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

function toggleStats(articleEl, newsId) {
  let statsDiv = articleEl.querySelector(".match-stats");
  if (statsDiv) {
    // already rendered → toggle
    statsDiv.hidden = !statsDiv.hidden;
    return;
  }
  // create new
  const data = demoMatchStats[newsId];
  if (!data) return; // nothing to show

  statsDiv = document.createElement("div");
  statsDiv.className = "match-stats";
  statsDiv.innerHTML = `
    <hr>
    <p><strong>Score:</strong> ${data.score}</p>
    <p><strong>Possession:</strong> ${data.possession}</p>
    <p><strong>Shots:</strong> ${data.shots}</p>
    <p><strong>MVP:</strong> ${data.mvp.name}</p>
    <p>${data.mvp.stats}</p>`;
  articleEl.appendChild(statsDiv);
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
 * 5. Demo odds widget (instead of currency converter)
 * --------------------------------------------------------------------------*/
const demoOdds = [
    { match: "Man City vs Real Madrid",  home: 1.95, draw: 3.80, away: 3.60 },
    { match: "Arsenal vs Bayern",       home: 2.20, draw: 3.50, away: 3.10 },
    { match: "Barcelona vs PSG",        home: 2.05, draw: 3.70, away: 3.40 },
    { match: "Juventus vs Liverpool",   home: 2.80, draw: 3.30, away: 2.45 }
  ];
  
  function renderOdds() {
    const tbl = document.getElementById("odds-table");
    if (!tbl) return;
    demoOdds.forEach(o => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${o.match}</td><td>${o.home.toFixed(2)}</td><td>${o.draw.toFixed(2)}</td><td>${o.away.toFixed(2)}</td>`;
      tbl.appendChild(tr);
    });
  }
  
/* --------------------------------------------------------------------------
 * 6. Matches feed (demo data with collapsible stats)
 * --------------------------------------------------------------------------*/
const demoMatches = [
  { id: 1, home: "Man City", away: "Real Madrid", time: "Sat 19:30" },
  { id: 2, home: "Bayern",   away: "Juventus",   time: "Sun 21:45" },
  { id: 3, home: "PSG",      away: "Barcelona",  time: "Mon 20:00" }
];

const demoStats = {
  1: { possession: "55 / 45", shots: "15 / 8", xg: "2.3 / 1.0" },
  2: { possession: "58 / 42", shots: "12 / 11", xg: "1.9 / 1.5" },
  3: { possession: "49 / 51", shots: "10 / 13", xg: "1.1 / 1.6" }
};

function loadMatches() {
  const feed = document.getElementById("matches-feed");
  if (!feed) return;
  demoMatches.forEach(m => {
    const card = document.createElement("div");
    card.className = "match-card";
    card.innerHTML = `
      <div class="match-head"><span>${m.home}</span><span>${m.time}</span><span>${m.away}</span></div>
      <div class="match-stats" id="stats-${m.id}" hidden></div>`;
    card.querySelector(".match-head").addEventListener("click", () => toggleStats(m.id));
    feed.appendChild(card);
  });
}

function toggleStats(id) {
  const box = document.getElementById(`stats-${id}`);
  if (box.hasAttribute("hidden")) {
    if (!box.hasAttribute("data-loaded")) {
      const st = demoStats[id];
      box.innerHTML = `<p>Possession: ${st.possession}</p><p>Shots: ${st.shots}</p><p>xG: ${st.xg}</p>`;
      box.setAttribute("data-loaded", "1");
    }
    box.removeAttribute("hidden");
  } else {
    box.setAttribute("hidden", "true");
  }
}


  // -----------------------------------------------------------------------------
  // 7. Main entry
  // -----------------------------------------------------------------------------
  
  window.onload = () => {
    if (!localStorage.getItem("theme")) localStorage.setItem("theme", "Toutes");
  
    carouselStart();
    fetchAndDisplayNews("");
    embedHighlight();
    renderOdds();
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