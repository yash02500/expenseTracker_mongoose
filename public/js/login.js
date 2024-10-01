
// User login

async function login(event) {
    event.preventDefault();
    const userEmail = document.getElementById('lemail').value;
    const userPass = document.getElementById('lpass').value;

    try {
        const response = await axios.post('http://localhost:3000/user/login', {
            email: userEmail,
            password: userPass
        });
    
        alert(response.data.message);
        console.log("Login success");
        localStorage.setItem('token', response.data.token);
        window.location.href = "addExpense.html";
    
    } catch (error) {
        alert("Wrong email or password");
        document.body.innerHTML += '<center><h4>Something Went Wrong</h4></center>';
        console.error(error);
    }

    // Clear the input fields
    document.getElementById('lemail').value = '';
    document.getElementById('lpass').value = '';
};


// Logout
function logOut() {
    localStorage.removeItem('token');
    window.location.href = "login.html"; 
}


//Forgot password
async function passwordResetLink(event) {
    event.preventDefault();
    const Email = document.getElementById('email').value;

    try {
        const response = await axios.post('http://localhost:3000/user/password/sendResetLink', {
            email: Email
        });

        alert(response.data.message);
        console.log("Email submitted");
        window.location.href = "login.html";

    } catch (error) {
        console.error('Error occurred:', error.response ? error.response.data : error);
        alert(error.response.data.message);
        document.body.innerHTML += '<center><h4>Something Went Wrong</h4></center>';
    }
}


// This function extracts the UUID from the current URL
async function getUUIDFromUrl() {
    const pathArray = window.location.pathname.split('/');
    const uuid = pathArray[pathArray.length - 1];

    if (uuid && uuid.length === 36) {
        localStorage.setItem('uuid', uuid);

        try {
            const res = await axios.get(`http://localhost:3000/user/password/forgotpassword/${uuid}`);
            console.log(res.data.message);
        } catch (error) {
            // Consider using a dedicated error element instead of innerHTML
            console.error(error);
        }
    } 
}

// Call the function
getUUIDFromUrl();


// Update password request
async function updatePassword(event){
    try{
        event.preventDefault();
        const newPass = document.getElementById('npass').value;
        const confirmPass = document.getElementById('cpass').value;
        const uuid = localStorage.getItem('uuid');
        
        if(newPass===confirmPass){
                await axios.post(`http://localhost:3000/user/password/forgotpassword/update/${uuid}`,{
                password: newPass
            });    
            console.log('Passwords submit');

                alert('Password updated successfully');
                window.location.href = "/login.html";
3           }
           else{
            alert('Passwords do not match');
           }
        
        } catch(error){
            console.error('Error occured in reseting password', error);
        }
};

