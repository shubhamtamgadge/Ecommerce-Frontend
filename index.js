let bannerWrapper = document.querySelector("#bannerWrapper");
let imageContainer = document.querySelector("#imageContainer");
let banners = document.querySelectorAll(".banners");
let prevButton = document.querySelector("#prevButton");
let nextButton = document.querySelector("#nextButton");

let imageIndex = 0;
let intervalId = 0;
let totalBanners = 4;

const autoSlide = () =>{
intervalId = setInterval(() =>slideImage(imageIndex++), 2000);
}

autoSlide();

slideImage = () =>{
    
    imageIndex = (imageIndex === banners.length) ? 0 : (imageIndex < 0 ) ? banners.length -1 : imageIndex ;

    imageContainer.style.transform = `translate(-${imageIndex * 100}%)`;

    updateBanner(imageIndex);
}

const prevBanner = (e) =>{
    clearInterval(intervalId);

    imageIndex-=1;
    slideImage(imageIndex);  
}

const nextBanner = (e) =>{
    clearInterval(intervalId);

    imageIndex+=1;
    slideImage(imageIndex); 
}

function updateBanner(imageIndex){

    let b1 = document.querySelector('.b1');
    let b2 = document.querySelector('.b2');
    let b3 = document.querySelector('.b3');
    let b4 = document.querySelector('.b4');

    let arr = [b1,b2,b3,b4];

    arr.forEach((banner)=>{
        banner.style.cssText+= "height:8px; width:8px; background-color:#9ca3af;";
    })

    if(imageIndex==0) b1.style.cssText += "height:10px; width:10px; background-color:#6b7280;";
    else if(imageIndex==1) b2.style.cssText += "height:10px; width:10px; background-color:#6b7280;";
    else if(imageIndex==2) b3.style.cssText += "height:10px; width:10px; background-color:#6b7280;";
    else if(imageIndex==3) b4.style.cssText += "height:10px; width:10px; background-color:#6b7280;";
}

prevButton.addEventListener("click", prevBanner);
nextButton.addEventListener( 'click', nextBanner);

bannerWrapper.addEventListener('mouseover' , () => clearInterval(intervalId));
bannerWrapper.addEventListener('mouseleave' , autoSlide);
