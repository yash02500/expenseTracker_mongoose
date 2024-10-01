const token =localStorage.getItem('token');

document.addEventListener('DOMContentLoaded', function () {

if(!token){
    alert("You need to login!!")
    window.location.href = "login.html";
}

showData();

const decode= parseJwt(token);
console.log(decode);
const isPremiumuser =decode.isPremiumuser;

if(isPremiumuser){
 premiumUser();
 showLeaderboard();
 userBalance();
}

const expForm= document.getElementById('expForm');
expForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const amount= document.getElementById('amt').value;
    const description= document.getElementById('dec').value;
    const category= document.getElementById('choose').value;
    const typeIsExp= document.getElementById('expense').checked;
    const typeIsInc= document.getElementById('income').checked;

    const expenseData={
        description: description,
        category: category,
        income: typeIsInc ? amount : 0,
        expense: typeIsExp ? amount : 0,

    };

    try{
        await axios.post('http://localhost:3000/expense/addingExpense', expenseData, {headers: {'Authorization': token }});
        showData();
        userBalance();
    }catch(error){
        console.log(error);
    }

    document.getElementById('amt').value = '';
    document.getElementById('dec').value = '';
    document.getElementById('choose').value = '';
    document.getElementById('expense').checked ='';
    document.getElementById('income').checked ='';
  })
});


// Fetch expenses
function getExpenses(){
    return axios.get(`http://localhost:3000/expense/getExpenses`, {headers: {'Authorization': token }})
    .then(response=>{
        return response.data.expenses;
    }).catch(error=>{
        console.log(error);
    });
};


// parse jwt
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


// display expenses on the page
function showData(){
    getExpenses()
    .then(data=>{
        const tableBody= document.getElementById('expTable');
        tableBody.innerHTML='';

        if(data && data.length > 0){
            data.forEach(exp=>{
                const newExp= document.createElement('tr');
                newExp.dataset.id= exp._id;
                newExp.innerHTML=`
                    <td>${exp.description}</td>
                    <td>${exp.category}</td>
                    <td>${exp.income}</td>
                    <td>${exp.expense}</td>
                    <td><button class="btn btn-danger delete-btn">Delete</button></td>`;
                    tableBody.appendChild(newExp);
            });
        }
        else{
            console.log('Expense data missing');
        }
        
    }).catch(error=>{
        console.log(error);
    });
}


// premium membership message
function premiumUser() {
    document.getElementById('premium').style.display = 'none';
    document.getElementById('download').style.display = 'list-item';
    document.getElementById('downloadList').style.display = 'list-item';

    //const navBar = document.getElementById('navbar'); 
    const logoutButton = document.querySelector('.navbar-nav.ml-auto'); 
    const premiumUnlocked = document.createElement('strong');
    premiumUnlocked.className = 'nav-link';
    premiumUnlocked.textContent = 'Premium✅';
    logoutButton.insertBefore(premiumUnlocked, logoutButton.firstChild);
}


// Download reports
async function downloadReports(){
    try {
        const res = await axios.get('http://localhost:3000/premiumFeature/downloadReport', {headers: {'Authorization': token }});
        if(res.status === 200){
            var a = document.createElement('a');
            a.href = res.data.fileURL;
            a.download = 'myexpense.csv';
            a.click();   
        }
        else{
            alert('File not found');
        }

    } catch (error) {
        alert("File not found");
        console.error(error);
    }
}


// Download List
async function downloadList() {
    const downList = document.getElementById('downloadList');
    downList.innerHTML = ''; 
    try {
        const res = await axios.get('http://localhost:3000/premiumFeature/downloadList', { headers: { 'Authorization': token } });
        console.log(res.data);
        res.data.forEach(lists => {
            const newList = document.createElement('li');
            const link = document.createElement('a');
            link.setAttribute('href', lists.fileUrl); // Set the href attribute to the file URL
            link.setAttribute('download', ''); // Optional: if you want the file to be downloaded on click
            link.textContent = lists.fileUrl; // Text to display for the download link
            newList.appendChild(link); // Append the anchor to the list item
            downList.appendChild(newList); // Append the list item to the list
        });

    } catch (err) {
        console.error('List not found', err);
        downList.innerHTML += '<h3>List Not Found</h3>';
    }
}


// User balance
async function userBalance(){
    try{
        const res = await axios.get('http://localhost:3000/premiumFeature/balance', { headers: { 'Authorization': token } });
        const bal = document.getElementById('balance');
        bal.style.visibility = 'visible';
        let amount = res.data.balanceStr;

        if(amount > 0){
            bal.style.color = 'green'; // Set the color to green if the amount is positive
        } else {
            bal.style.color = 'red'; // Set the color to red if the amount is negative
        }

        bal.innerHTML = `Balance: ${'₹ '+amount}`;  

    }catch(error){
        console.log(error, 'error in fetching balance')
    }
}


//Users expense leaderboard
function showLeaderboard() {
    // Create a modal element
    const modal = document.createElement('div');
    modal.style.display = 'none';
    modal.style.position = 'fixed';
    modal.style.zIndex = '1';
    modal.style.left = '0';
    modal.style.top = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.overflow = 'auto';
    modal.style.backgroundColor = 'rgba(0,0,0,0.4)'; // Black w/ opacity

    // Modal content container
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = '#fefefe';
    modalContent.style.margin = '15% auto';
    modalContent.style.padding = '20px';
    modalContent.style.border = '1px solid #888';
    modalContent.style.width = '80%';

    // Close button for the modal
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.style.color = 'red';
    closeButton.style.float = 'right';
    closeButton.style.fontSize = '28px';
    closeButton.style.fontWeight = 'bold';
    closeButton.style.border = 'none';
    closeButton.style.background = 'none';
    closeButton.onclick = function() {
        modal.style.display = 'none';
    };

    // Append close button to modal content
    modalContent.appendChild(closeButton);

    // Leaderboard title
    const title = document.createElement('h2');
    title.innerText = 'Leaderboard';
    modalContent.appendChild(title);

    // Leaderboard list container
    const leaderboardList = document.createElement('ul');
    leaderboardList.id = 'leaderboard';
    leaderboardList.className = 'list-group';
    modalContent.appendChild(leaderboardList);

    // Append modal content to modal
    modal.appendChild(modalContent);

    // Append modal to document body
    document.body.appendChild(modal);

    // Button to show the leaderboard
    const inputElement = document.createElement("input");
    inputElement.type = "button";
    inputElement.className = "nav-link";
    inputElement.value = 'Leaderboard📶';
    inputElement.style.fontWeight = 'bold'; 
    inputElement.style.border = 'none';
    inputElement.style.background = 'none';
    inputElement.onclick = async () => {
        modal.style.display = 'block'; // Show the modal

        // Fetch leaderboard data
        const response = await axios.get('http://localhost:3000/premiumFeature/leaderboard', { headers: {"Authorization" : token} });
        const leaderboardData = response.data;

        // Clear previous leaderboard entries
        leaderboardList.innerHTML = '';

        // Add new leaderboard entries
        leaderboardData.forEach(userDetails => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.innerText = `Name: ${userDetails.name} => Total Expense: ${userDetails.total_cost || 0}`;
            leaderboardList.appendChild(listItem);
        });
    };

    // Append button to navbar
    document.getElementById("navbar").appendChild(inputElement);
}



// Deleting expense
document.getElementById("expTable").addEventListener("click", function (event) {
  if (event.target.classList.contains("delete-btn")) {
      const row = event.target.closest("tr");
      const expenseId = row.dataset.id; 
      axios.delete(`http://localhost:3000/expense/deleteExpense/${expenseId}`, {headers: {'Authorization': token}})
          .then(() => {
              row.remove();
              userBalance();
          })
          .catch(err => {
              console.error(err);
          });
  }
});


// Razorpay 
document.getElementById('premium').onclick = async function(e){
    const response = await axios.get('http://localhost:3000/premium/premiumMembership', {headers: {'Authorization': token }});
    console.log(response);

    var options = {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function(response){
            await axios.post('http://localhost:3000/premium/updateTransactionStatus', {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
        }, {headers: {'Authorization': token }});

        alert('You are now a premium member');
        premiumUser();
        localStorage.setItem('token', res.data.token)
    },
  };

  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on('payment.failed', function(response){
    console.log(response);
    alert('Payment failed');
  });
}


