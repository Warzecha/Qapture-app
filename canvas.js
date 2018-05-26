// let Jimp = require('jimp')
// var remote = require('electron').remote;  
var canvas = document.querySelector('canvas');

// let path = 'myfile.png'


   
// // console.log(remote.getGlobal('sharedObj').prop1);
// let img_obj = remote.getGlobal('sharedObj').prop1
// img_obj.image.toString('base64')   
// console.log(img_obj.width)



// // Create a new blank image, same size as Robotjs' one
// let jimg = new Jimp(img_obj.width, img_obj.height);
// for (var x=0; x<img_obj.width; x++) {
//         for (var y=0; y<img_obj.height; y++) {
//                 // hex is a string, rrggbb format
//                 var hex = img_obj.colorAt(x, y);
//                 // Jimp expects an Int, with RGBA data,
//                 // so add FF as 'full opaque' to RGB color
//                 var num = parseInt(hex+"ff", 16)
//                 // Set pixel manually
//                 jimg.setPixelColor(num, x, y);
//         }
//     }

// // console.log(jimg)
// //jimg.write(path)




canvas.width = window.innerWidth;
canvas.height = window.innerHeight; 

canvas.className = "fullscreen"

document.body.scrollTop = 0; // <-- pull the page back up to the top
document.body.style.overflow = 'hidden'; // <-- relevant addition


// var ctx = canvas.getContext('2d');

// ctx.drawImage(img_obj.image, 0, 0, img_obj.width, img_obj.height);