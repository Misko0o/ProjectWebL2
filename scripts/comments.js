window.onload = () => {
    
    const params   = new URLSearchParams(window.location.search);
    const newsId   = params.get("id");
    const listBox  = document.getElementById("comments-list");
  
    
    function renderComments(arr) {
      listBox.replaceChildren();           
      arr.forEach(c => {
        const div = document.createElement("div");
        div.className = "comment-item";
        div.innerHTML = `<p><strong>${c.user}</strong> <em>${c.ts}</em></p><p>${c.text}</p>`;
        listBox.appendChild(div);
      });
    }
  
    
    async function loadComments() {
      try {
        const res  = await fetch(`../php_files/comments.php?id=${newsId}&json=1`);
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json();     
        renderComments(data);
      } catch (err) {
        console.error("Ошибка загрузки комментариев:", err);
      }
    }
    loadComments();
    const poller = setInterval(loadComments, 5000); 
  
    
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
          loadComments();  
        } catch (err) {
          console.error("Ошибка отправки комментария:", err);
        }
      });
    }
  
    
    window.addEventListener("beforeunload", () => clearInterval(poller));
  };
  