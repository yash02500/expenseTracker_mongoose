        
async function addUser(event){
    try{
        event.preventDefault();

        const userName = document.getElementById('uname').value;
        const userEmail = document.getElementById('uemail').value;
        const userPass = document.getElementById('upass').value;

        await axios.post('http://localhost:3000/user/signup', {
            name: userName,
            email: userEmail,
            password: userPass
        });

        window.location.href= "login.html";
        console.log("User added");
       
        document.getElementById('uname').value = '';
        document.getElementById('uemail').value = '';
        document.getElementById('upass').value = '';

    } catch(error){
        document.body.innerHTML=document.body.innerHTML+'<h4>Something Went Wrong</h4>';
        console.log(error);
    }
}
