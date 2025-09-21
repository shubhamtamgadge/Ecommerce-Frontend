// const BASE_URL = "http://localhost:8080";

let cart = JSON.parse(localStorage.getItem("cart")) || [];

cart.splice


function addToCart(id, name, price, imageUrl, description){

    price = parseFloat(price);

    let itemIndex = cart.findIndex((item) => item.id === id);
    if(itemIndex === -1){
        cart.push(
            {
                id:id,
                name:name,
                price:price,
                imageUrl:imageUrl,
                description:description,
                quantity:1
            }
        );
    }
    else{
        cart[itemIndex].quantity+=1;
    }

    localStorage.setItem("cart" , JSON.stringify(cart));
    updateCartCounter();

}


function loadCart(){
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let allItems = document.querySelector(".allItems");
    if(!allItems){
        return;
    }
    let totalAmount = 0;
    allItems.innerHTML="";

    cart.forEach((item,index) => {
        let itemTotal = item.price * item.quantity;
        totalAmount+=itemTotal;

        allItems.innerHTML += `
            <div class="w-[90%] h-44 flex border-b border-gray-300 py-2 px-2 ">
                    <div class="w-60 h-[159px] overflow-hidden">
                        <img class="w-60 h-auto object-cover "
                        src="${item.imageUrl}" alt="">
                      
                    </div>
                    <div class="product ml-7 mt-2">
                        <h4 class="text-[18px] font-semibold mt-1">${item.name} </h4>
                        <p class="truncate my-0">${item.description}</p>
                        <p class="font-semibold mb-1">₹${item.price}</p>

                        <div class="w-[100%] flex  items-end ">

                            <div class="flex w-32 bg-[#238306] mt-4 items-center rounded-[3px]">
                                <button onclick="changeQuantity(${index}, -1)" class="px-3 border-r text-white  font-bold text-lg ">-</button>
                                <div id="quantity" class="px-6 text-white py-1 font-semibold text-lg">${item.quantity}</div>
                                <button onclick="changeQuantity(${index}, 1)" class="px-3 border-l text-white  font-bold text-lg ">+</button>
                            </div>

                            <button class="w-24 h-7 ml-6 left-[450px] bg-[#e21f1fe5]  text-white rounded-[3px]"
                            onclick="removeFromCart(${index})">REMOVE</button>

                        </div>

                    </div>
                </div>
        `;

  
    });

    document.querySelector(".totalAmount").innerText = ` - ₹ ${totalAmount}`;
    updateCartCounter();
}


function updateCartCounter(){
    document.querySelector("#items").innerText = cart.length;

        if(cart.length === 0){
            let cartItems = document.querySelector('.cartItems');
            cartItems.style.display = "none";
        }
        else{
           cartItems.style.removeProperty("display"); 
        }

        if(cart.length === 0){
            let placeOrder = document.querySelector(".placeOrder");

            if (placeOrder) {

                placeOrder.innerHTML = '';
                placeOrder.style.justifyContent = "center";
                placeOrder.innerHTML+=`
                <div class="text-center text-[16px]">No Items in Cart</div>
                `;

            }
            
        }

    console.log("updating counter" , cart.length);
    
}


function changeQuantity(index, change){
    cart[index].quantity+=change;
    if(cart[index].quantity <=0 ) cart.splice(index,1);
    localStorage.setItem("cart" , JSON.stringify(cart));


    loadCart();
    updateCartCounter();
}


function removeFromCart(index){

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.splice(index,1);
    localStorage.setItem("cart" , JSON.stringify(cart));

    updateCartCounter();
    loadCart();
    location.reload();
    

}



async function placeOrder(){

    const BASE_URL = "http://localhost:8080";
    const token = localStorage.getItem("jwtToken");

    try{
        
        let totalamount = document.querySelector(".totalAmount").textContent;
        let arr = totalamount.split(" ");
        amount = arr[arr.length-1];

        const PaymentOrder = {
            name: "shubham",
            email: "shubhamtamgadge80@gmail.com",
            phone : "9146531650",
            amount : amount
        };

        const response = await fetch(`${BASE_URL}/api/payment/create-order`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },

            //js object into JSON
            body: JSON.stringify(PaymentOrder)
        })
  
        const data = await response.json();

        const razorpayOrderId = data.id;

        var options = {
            "key": "rzp_test_R8sFaWIhbczqjp", 
            "amount": PaymentOrder.amount,           
            "currency": "INR",
            "name": "Shopify",
            "description": "order placing...",
            "order_id": razorpayOrderId, 
            "handler": function (response){
                alert("Payment successful. Payment ID: " + response.razorpay_payment_id);
                
                fetch(`${BASE_URL}/api/payment/update-order?orderId=${data?.id}&status=SUCCESS`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },

                });
            },
            "prefill": {
                "name": PaymentOrder.name,
                "email": PaymentOrder.email,
                "contact": PaymentOrder.phone
            },
            "theme": {
                "color": "#3399cc"
            },
           
        };

        var rzp1 = new Razorpay(options);
        rzp1.open();

        saveOrderItems(razorpayOrderId);
        
    }
    catch(error){
        window.location.href = "loginForm.html";
        localStorage.removeItem("jwtToken");
        console.log("error in placing order " , error);
    }
    
    localStorage.removeItem("cart");
    loadCart();
    
    
}

async function saveOrderItems(razorpayOrderId){

    let cartItem = JSON.parse(localStorage.getItem("cart")) || [];


    try{
     
        const BASE_URL = "http://localhost:8080";

        const responce = await fetch(`${BASE_URL}/orders/saveOrder`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(cartItem)
            })

            if(responce.ok){
                console.log("OrderItems saved successfully")
            }
            else{
                console.log("error in saving orderItems");
            }
    }
    catch(error){
        console.log("somthing went wrong in saving orderItems" , error);
    }

}

document.addEventListener("DOMContentLoaded" , loadCart);
document.addEventListener("DOMContentLoaded" , updateCartCounter);
