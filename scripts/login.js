function transformToJSON(pureForm){
    var formData = new FormData(pureForm);
    var formDataObject = {};
    formData.forEach(function(value, key){
        formDataObject[key] = value;
    });

    return formDataObject;
}

window.onload = () => {
    var form = document.getElementById("loginForm");

    form.addEventListener("submit", async function(event) {
        event.preventDefault();
        var dictData = transformToJSON(form);
        var jsonData = JSON.stringify(dictData);

        await fetch("../php_files/login.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: jsonData
        })
        .then(function(response) {
            if (!response.ok){
                throw new Error("Server error!");
            }
            return response.json();
        })
        .then(function(data){
            var res = data["credentialsOk"];
            var incorrectCredentials = document.getElementById("invalidCredentials");
            if (res == 0){
                incorrectCredentials.style.display = "flex";
            }
            else{
                incorrectCredentials.style.display = "none";
                localStorage.setItem("loggedin", "true");
                localStorage.setItem("user", dictData["email"]);
                window.location.replace("../html/main.html");
            }
        })
    })
}
