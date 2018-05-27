var canvas = document.querySelector('canvas');

console.log(window.innerHeight);


canvas.width = window.outerWidth;
canvas.height = window.outerHeight;
console.log(window) 

 console.log("document.body");
 console.log(document.body)

  





canvas.className = "fullscreen"

document.body.scrollTop = 0; // <-- pull the page back up to the top
document.body.style.overflow = 'hidden'; // <-- relevant addition


// var ctx = canvas.getContext('2d');

// let path = document.getElementById("ScreenShotImagePath");
// let image = new Image();//

// image.src = path;

//ctx.drawImage(img_obj.image, 0, 0, img_obj.width, img_obj.height);