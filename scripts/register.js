function transformToDict(pureForm){
    var selectElement = document.getElementById("security-question");
    var formData = new FormData(pureForm);
    var formDataObject = {};
    formData.forEach(function(value, key){
        formDataObject[key] = value;
    });
    formDataObject["selectedOption"] = selectElement.selectedIndex;

    return formDataObject;
}

function validatePassword(password){
    var regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/;
    return regex.test(password);
}

function cleanErrorDiv(errorDiv) {
    while (errorDiv.firstChild) {
        errorDiv.removeChild(errorDiv.firstChild);
    }
}

function validateFormObject(formObject){
    errorObj = {};
    for(var key in formObject){
        if(key === "name"){
            if(formObject[key].length < 2){
                errorObj[key] = "Name length should be more than 2 characters!";
            }
        }
        if(key === "surname"){
            if(formObject[key].length < 2){
                errorObj[key] = "Surname length should be more than 2 characters!";
            }
        }
        if(key === "email"){
            if(formObject[key].length < 2){
                errorObj[key] = "Email length should be more than 2 characters!";
            }
            else if (!formObject[key].includes('@') || !formObject[key].includes('.')){
                errorObj[key] = "Invalid email!";
            }
        }
        if(key === "password"){
            if(!validatePassword(formObject[key])){
                errorObj[key] = "Invalid password. Password should contain one uppercase letter, one lowercase letter, one special character, one digit and the length should be 8 character minimum.";
            }
        }
        if(key === "Repeat password"){
            var password = formObject["password"];
            var repPassword = formObject[key];
            if(password !== repPassword){
                errorObj[key] = "This field should be equal to password field!";
            }
        }
        if (key === "Security answer"){
            if (formObject[key] === ""){
                errorObj[key] = "This field cannot be empty!";
            }
        }
    }

    return errorObj;
}

function displayErrors(errorObj){
    var errorDiv = document.getElementById("invalidCredentials");
    cleanErrorDiv(errorDiv);
    
    errorDiv.style.display = "flex";
    errorDiv.style.width = "85%";
    errorDiv.style.height = "auto";
    for(var key in errorObj){
        var newErr = document.createElement("div");
        newErr.innerText = key + ": " + errorObj[key];
        
        errorDiv.appendChild(newErr);
    }
}

async function sendRequest(valuesList, errorObj){
    console.log(valuesList);
    var uri = "../php_files/register.php";
    try{
        await fetch(uri, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: valuesList
        })
        .then((response) => {
            if(!response.ok){
                return response.json().then((errorData) => {
                    throw new Error(errorData.error);
                });
            }
            document.getElementById("invalidCredentials").style.display = "none";
            return response.json();
        })
        .then((data) => {
            window.location.replace("../html/login.html");
        });
    }
    catch(error){
        if(error.message.includes("Email")){
            errorObj["email"] = error.message;
        }
    }
    
}

window.onload = () => {
    var securitySelect = document.getElementById("security-question");
    var securityInput = document.getElementById("security-answer");
    var form = document.getElementById("registerForm");

    securitySelect.addEventListener("change", () => {
        document.getElementById("answerInput").value = "";
        securityInput.style.display = "inline-block";
    })

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        
        var dataDict = transformToDict(form);
        var errorObj = validateFormObject(dataDict);
        
        if (Object.keys(errorObj).length > 0){
            displayErrors(errorObj);
        }
        else{
            delete dataDict["Repeat password"];
            var obj = {
                "vals" : Object.values(dataDict)
            }
            await sendRequest(JSON.stringify(obj), errorObj);
            if (Object.keys(errorObj).length > 0){
                displayErrors(errorObj);
            }
        }
    })
}   