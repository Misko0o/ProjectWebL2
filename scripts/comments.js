// ===================== comments.js (live update version) =====================
//  ► Предполагается, что comments.php по URL
//      ../php_files/comments.php?id=123&json=1
//    отдаёт JSON-массив вида [{user:"mail@ex", text:"…", ts:"2025‑05‑08 10:22"}, …]
//  ► В HTML‑шаблоне comments.php должен быть контейнер:
//      <div id="comments-list"></div>
// -----------------------------------------------------------------------------

window.onload = () => {
    /* ----------------------------------------------------------
     * 0.  Получаем id новости из query‑string
     * --------------------------------------------------------*/
    const params   = new URLSearchParams(window.location.search);
    const newsId   = params.get("id");
    const listBox  = document.getElementById("comments-list");
  
    /* ----------------------------------------------------------
     * 1.  Рендер списка комментариев
     * --------------------------------------------------------*/
    function renderComments(arr) {
      listBox.replaceChildren();           // очистить
      arr.forEach(c => {
        const div = document.createElement("div");
        div.className = "comment-item";
        div.innerHTML = `<p><strong>${c.user}</strong> <em>${c.ts}</em></p><p>${c.text}</p>`;
        listBox.appendChild(div);
      });
    }
  
    /* ----------------------------------------------------------
     * 2.  Загрузка с сервера + polling каждые 5 сек
     * --------------------------------------------------------*/
    async function loadComments() {
      try {
        const res  = await fetch(`../php_files/comments.php?id=${newsId}&json=1`);
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json();     // [{user,text,ts}, …]
        renderComments(data);
      } catch (err) {
        console.error("Ошибка загрузки комментариев:", err);
      }
    }
    loadComments();
    const poller = setInterval(loadComments, 5000); // 5 сек
  
    /* ----------------------------------------------------------
     * 3.  Отправка нового комментария (только если авторизован)
     * --------------------------------------------------------*/
    if (localStorage.getItem("user")) {
      const container = document.getElementById("create-comment-container");
      container.style.display = "flex";
      const input = container.querySelector("input");
      const btn   = container.querySelector("button");
  
      btn.addEventListener("click", async () => {
        const txt = input.value.trim();
        if (!txt) return;
        const payload = {
          vals: [newsId, txt, localStorage.getItem("user")]
        };
        try {
          await fetch("../php_files/addComment.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          input.value = "";
          loadComments();  // мгновенно подтягиваем список
        } catch (err) {
          console.error("Ошибка отправки комментария:", err);
        }
      });
    }
  
    /* ----------------------------------------------------------
     * 4.  Очистка при уходе со страницы
     * --------------------------------------------------------*/
    window.addEventListener("beforeunload", () => clearInterval(poller));
  };
  