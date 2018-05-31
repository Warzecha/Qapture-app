var canvas = document.querySelector('canvas');


const electron = require('electron');


var Mousetrap = require('mousetrap');

const nativeImage = require('electron').nativeImage;
const ipc = require('electron').ipcRenderer;

const path = require('path');
const fs = require('fs');
const os = require('os');

let selection = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0
}




Mousetrap.bind('ctrl+c', function () {


    let x = Math.min(selection.x1, selection.x2);
    let y = Math.min(selection.y1, selection.y2);
    let width = Math.abs(selection.x1 - selection.x2);
    let height = Math.abs(selection.y1 - selection.y2);

    let cropped_image_path = path.join(os.tmpdir(), 'cropped.png');
    let img_path = path.join(os.tmpdir(), 'screenshot.png');





    // console.log(img_path);
    let n_img = nativeImage.createFromPath(img_path);
    let cropped_img = n_img.crop({
        x: x,
        y: y,
        width: width,
        height: height
    })

    fs.writeFile(cropped_image_path, cropped_img.toPNG(), function (err) {
        if (err) return console.log(err.message);
        else {
            ipc.send('copy-cropped');
        }
    })



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


Mousetrap.bind('up', function () {
    selection.y1 -= 1;
    selection.y2 -= 1;
});

Mousetrap.bind('down', function () {
    selection.y1 += 1;
    selection.y2 += 1;
});

Mousetrap.bind('left', function () {
    selection.x1 -= 1;
    selection.x2 -= 1;
});

Mousetrap.bind('right', function () {
    selection.x1 += 1;
    selection.x2 += 1;
});

Mousetrap.bind('shift+up', function () {

    if(selection.y2 < selection.y1)
    {
        selection.y1 -= 1;
    }
    else
    {
        selection.y2 -= 1;
    }

});


Mousetrap.bind('shift+down', function () {

    if(selection.y2 < selection.y1)
    {
        selection.y1 += 1;
    }
    else
    {
        selection.y2 += 1;
    }

});


Mousetrap.bind('shift+right', function () {

    if(selection.x2 < selection.x1)
    {
        selection.x1 += 1;
    }
    else
    {
        selection.x2 += 1;
    }

});

Mousetrap.bind('shift+left', function () {

    if(selection.x2 < selection.x1)
    {
        selection.x1 -= 1;
    }
    else
    {
        selection.x2 -= 1;
    }

});


Mousetrap.bind('ctrl+a', function () {
    selection.x1 = 0;
    selection.y1 = 0;
    selection.x2 = canvas.width;
    selection.y2 = canvas.height;
});

Mousetrap.bind('esc', function () {
    ipc.send('close_main_window');
});







function animate() {
    requestAnimationFrame(animate);



    ctx.drawImage(image, 0, 0, image.width, image.height);

    ctx.fillStyle = 'rgba(0,0,0,0.5)'
    ctx.fillRect(0, 0, Math.min(selection.x1, selection.x2), canvas.height);
    ctx.fillRect(Math.max(selection.x1, selection.x2), 0, canvas.width, canvas.height);
    ctx.fillRect(Math.min(selection.x1, selection.x2), 0, Math.abs(selection.x2 - selection.x1), Math.min(selection.y1, selection.y2));
    ctx.fillRect(Math.min(selection.x1, selection.x2), Math.max(selection.y1, selection.y2), Math.abs(selection.x2 - selection.x1), canvas.height);






}
