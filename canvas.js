var canvas = document.querySelector('canvas');
const electron = require('electron');

const main = require('electron').remote.require('./index.js');

var Mousetrap = require('mousetrap');

const nativeImage = require('electron').nativeImage;
// const ipc = require('electron').ipcRenderer;

const path = require('path');
const fs = require('fs');
const os = require('os');

let lastMouseX;
let lastMouseY;


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
            main.copy_cropped();
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


let new_selection = false;

let dragging = false;
let drag_prevX;
let drag_prevY;



canvas.addEventListener('mousedown', function (event) {

    // console.log(event);

    if(insideSelection())
    {
        dragging = true;
        drag_prevX = event.screenX;
        drag_prevY = event.screenY;

    }
    else
    {
    selection.x1 = event.screenX;
    selection.y1 = event.screenY;
    selection.x2 = event.screenX;
    selection.y2 = event.screenY;
    new_selection = true;
    }
    





}, false);


canvas.addEventListener("mouseup", function (event) {


    if (new_selection) {
        selection.x2 = event.screenX;
        selection.y2 = event.screenY;
        new_selection = false;
    }
    else if(dragging)
    {
        dragging = false;

    }


});

canvas.addEventListener("mousemove", function (event) {

    if (new_selection) {
        selection.x2 = event.screenX;
        selection.y2 = event.screenY;
    } else if(dragging)
    {
        let deltaX = event.screenX - drag_prevX;
        let deltaY = event.screenY - drag_prevY;

        selection.x1 += deltaX;
        selection.y1 += deltaY;
        selection.x2 += deltaX;
        selection.y2 += deltaY;

        drag_prevX = event.screenX;
        drag_prevY = event.screenY;

    }

    lastMouseX = event.screenX;
    lastMouseY = event.screenY;
    



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
    console.log('want to close')
    main.close_main_window()
});







function animate() {
    requestAnimationFrame(animate);



    ctx.drawImage(image, 0, 0, image.width, image.height);

    ctx.fillStyle = 'rgba(0,0,0,0.5)'
    ctx.fillRect(0, 0, Math.min(selection.x1, selection.x2), canvas.height);
    ctx.fillRect(Math.max(selection.x1, selection.x2), 0, canvas.width, canvas.height);
    ctx.fillRect(Math.min(selection.x1, selection.x2), 0, Math.abs(selection.x2 - selection.x1), Math.min(selection.y1, selection.y2));
    ctx.fillRect(Math.min(selection.x1, selection.x2), Math.max(selection.y1, selection.y2), Math.abs(selection.x2 - selection.x1), canvas.height);

    if(insideSelection())
    {
        console.log('Change cursor')
        canvas.style.cursor = 'move';
    }else if((atTopBorder() && atLeftBorder()) || (atBottomBorder() && atRightBorder()))
    {
        canvas.style.cursor = 'nwse-resize';
    }else if((atBottomBorder() && atLeftBorder()) || (atTopBorder() && atRightBorder()))
    {
        canvas.style.cursor = 'nesw-resize';
        
    }
    else if(atTopBorder() || atBottomBorder())
    {
        canvas.style.cursor = 'ns-resize';
    }
    else if(atLeftBorder() || atRightBorder())
    {
        canvas.style.cursor = 'ew-resize';
    }
    else
    {
        canvas.style.cursor = 'crosshair';
    }




}

let border_width = 5;

function insideSelection()
{
    
return ((selection.x1 + border_width < lastMouseX && lastMouseX < selection.x2 - border_width ) || (selection.x2 + border_width < lastMouseX && lastMouseX < selection.x1 - border_width )) && ((selection.y1 + border_width < lastMouseY && lastMouseY < selection.y2 - border_width ) || (selection.y2 + border_width < lastMouseY && lastMouseY < selection.y1 - border_width ))

}

function atTopBorder()
{
    let topBorderY = Math.min(selection.y1, selection.y2);

    return ((selection.x1 < lastMouseX && lastMouseX < selection.x2 ) && Math.abs(lastMouseY - topBorderY) <= border_width);
}


function atBottomBorder()
{
    let bottomBorderY = Math.max(selection.y1, selection.y2);

    return ((selection.x1 < lastMouseX && lastMouseX < selection.x2 ) && Math.abs(lastMouseY - bottomBorderY) <= border_width);
}


function atLeftBorder()
{
    let leftBorderX = Math.min(selection.x1, selection.x2);

    return ((selection.y1< lastMouseY && lastMouseY < selection.y2 ) && Math.abs(lastMouseX - leftBorderX) <= border_width);
}

function atRightBorder()
{
    let rightBorderX = Math.max(selection.x1, selection.x2);

    return ((selection.y1< lastMouseY && lastMouseY < selection.y2 ) && Math.abs(lastMouseX - rightBorderX) <= border_width);
}
