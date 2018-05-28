var canvas = document.querySelector('canvas');


const electron = require('electron');

var Jimp = require('jimp');
var Mousetrap = require('mousetrap');
const { clipboard } = require('electron')
const nativeImage = require('electron').nativeImage


const path = require('path');
const fs = require('fs');
const os = require('os');

let selection = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0
}


console.log(Jimp)

Mousetrap.bind('ctrl+c', function () {


    let x = Math.min(selection.x1, selection.x2);
    let y = Math.min(selection.y1, selection.y2);
    let width = Math.abs(selection.x1 - selection.x2);
    let height = Math.abs(selection.y1 - selection.y2);

    let cropped_image_path = path.join(os.tmpdir(), 'cropped.png');
    let img_path = path.join(os.tmpdir(), 'screenshot.png');

    // Jimp.read(path.join(os.tmpdir(), 'screenshot.png'), function (err, img) {
    //     if (err) 
    //     {
    //         console.log(err)
    //     }
    //     return img.crop(x, y, width, height).
    //     img.write(cropped_image_path);
    // });

    let n_img = nativeImage.createFromPath(img_path);

    clipboard.writeImage(n_img);



    return false;
})







canvas.width = window.outerWidth;
canvas.height = window.outerHeight;
canvas.className = "fullscreen"
document.body.scrollTop = 0; // <-- pull the page back up to the top
document.body.style.overflow = 'hidden'; // <-- relevant addition


var ctx = canvas.getContext('2d');

let image = new Image();//
image.src = path.join(os.tmpdir(), 'screenshot.png');






image.addEventListener('load', function () {
    animate();
}, false);


let pressed = false;


canvas.addEventListener('mousedown', function (event) {

    // console.log(event);

    selection.x1 = event.screenX;
    selection.y1 = event.screenY;
    selection.x2 = event.screenX;
    selection.y2 = event.screenY;
    pressed = true;





}, false);


canvas.addEventListener("mouseup", function (event) {

    // The target of the event is always the document,
    // but it is possible to retrieve the locked element through the API
    //console.log(event);
    selection.x2 = event.screenX;
    selection.y2 = event.screenY;
    pressed = false;

});

canvas.addEventListener("mousemove", function (event) {

    if (pressed) {
        selection.x2 = event.screenX;
        selection.y2 = event.screenY;
    }


})






function animate() {
    requestAnimationFrame(animate);



    ctx.drawImage(image, 0, 0, image.width, image.height);

    ctx.fillStyle = 'rgba(0,0,0,0.5)'
    ctx.fillRect(0, 0, Math.min(selection.x1, selection.x2), canvas.height);
    ctx.fillRect(Math.max(selection.x1, selection.x2), 0, canvas.width, canvas.height);
    ctx.fillRect(Math.min(selection.x1, selection.x2), 0, Math.abs(selection.x2 - selection.x1), Math.min(selection.y1, selection.y2));
    ctx.fillRect(Math.min(selection.x1, selection.x2), Math.max(selection.y1, selection.y2), Math.abs(selection.x2 - selection.x1), canvas.height);






}
