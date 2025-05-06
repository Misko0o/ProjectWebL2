window.onload = () => {
    if (localStorage.getItem("user")){
        let div = document.getElementById("create-comment-container");
        div.style.display = "flex";
        
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');

        let btn = document.querySelector("#create-comment-container button");
        btn.addEventListener("click", () => {
            let comment = document.querySelector("#create-comment-container input").value;
            let data = {
                "vals" : [id, comment, localStorage.getItem("user")]
            }

            fetch("../php_files/addComment.php", {
                method: "POST",
                headers: {
                    "Content-type" : "application/json"
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => window.location.reload());
        });
    }
};