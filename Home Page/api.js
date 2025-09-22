
const BASE_URL = "http://localhost:8080";

async function loadProducts() {
    
    try{ 
        const responce = await fetch(`${BASE_URL}/products`);
        const products = await responce.json();

        
        let TrendingItems = document.querySelector("#TrendingItems");
        let ClothingItems = document.querySelector("#ClothingItems");
        let ElectronisItems = document.querySelector("#ElectronisItems");

        ElectronisItems.innerHTML = '';
        ClothingItems.innerHTML = '';
        TrendingItems.innerHTML = '';

        products.forEach(product => {
            let productCart = `
                <div class="size-96 bg-white  flex flex-col items-center max-sm:w-[85%] h-auto">
                    
                    <div class="w-[90%] bg-white flex flex-col mt-2">

                    <div class="h-[228px] w-[100%]  overflow-hidden " >
                        <img class="object-cover hover:scale-105 transition duration-150 ease-in-out" 
                        src="${product.imageUrl}" alt="">
                    </div>
                        

                        <h4 class="text-[18px] font-semibold mt-1">${product.name}</h4>
                        <p class="truncate my-0">${product.description}</p>
                        <p class="font-semibold mb-1">₹${product.price}</p>
                        <button class=" w-[100%] bg-blue-500 py-1 mb-2 rounded-md text-white hover:bg-blue-600"
                        onclick="addToCart(${product.id}, '${product.name}','${product.price}','${product.imageUrl}','${product.description}')">Add To Cart</button>
                    </div>

                        
                </div>
            `;

            if(product.category === "Clothing"){
                
                ClothingItems.innerHTML+=productCart;  
            
            }
            else if(product.category === "Electronics"){

                ElectronisItems.innerHTML+=productCart;
        
            }
            else if(product.category === "Gadgets"){

                TrendingItems.innerHTML+=productCart;
    
            }

            // console.log(product);

       
        });

    }
    catch(error){
        console.log("error fetching products " + error); 
    }

}


async function registerUser() {

    if(document.querySelector("#loginButton").innerText ==="Login"){
        loginUser();
        return;
    }
    document.querySelector("#loginButton").innerText ="Sign up";
    
    try{ 
    
        // normal js object
        const user = {
            name: document.getElementById("username").value,
            email: document.getElementById("email").value,
            password : document.getElementById("password").value
        };

        const response = await fetch(`${BASE_URL}/users/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },

            //js object into JSON
            body: JSON.stringify(user)
        });

        // get response object into json format
        const data = await response.json();

        document.getElementsByClassName("input").value = ""; 
         window.location.href = "loginForm.html";
        // alert("registration successfully!");

    }
    catch(error){
        console.log("error in registration " + error); 
    }

}


async function login() {

    let username= document.getElementById("email").value;
    let password = document.getElementById("password").value;

    localStorage.removeItem("jwtToken");

    console.log("here in login");

    try{
        const response = await fetch("http://localhost:8080/users/login", {
            method: "POST",

            headers: {
                 "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: username,
                password: password
            })
        });

        if (response.ok) {
            console.log("user found!! Generating token");

            try {
               
                const token = await response.text();
                // let token = await response.json();

                console.log("✅ Token received:", token);

                localStorage.setItem("jwtToken", token);

                window.location.href = "/index.html";

            } catch (error) {
                console.error(" Error fetching token:", error);
            }
                
            // window.location.href = "/cart.html";
        } 
        else {
            console.log("user not found");
            document.querySelector('.InvalidCredentials').style.display = 'flex';
        }
    }
    catch(error){
        console.log("error in login..." , error);
    }
     
}


window.addEventListener("load", loadProducts);

