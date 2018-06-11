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
            main.close_main_window();
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
let prevX;
let prevY;

let resizing = 0;



canvas.addEventListener('mousedown', function (event) {

    // console.log(event);
    prevX = event.screenX;
    prevY = event.screenY;
    if (insideSelection()) {
        dragging = true;
        

    } else if (atTopBorder() && atLeftBorder()) {
        resizing = 1;
    } else if (atTopBorder() && atRightBorder()) {
        resizing = 2;
    } else if (atBottomBorder() && atRightBorder()) {
        resizing = 3;

    } else if (atBottomBorder() && atLeftBorder()) {
        resizing = 4;
    }
    else if (atTopBorder()) {
        resizing = 5;
    }
    else if (atBottomBorder()) {
        resizing = 6;
    }
    else if (atLeftBorder()) {
        resizing = 7;
    }
    else if (atRightBorder()) {
        resizing = 8;
    }
    else {
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
    
    dragging = false;
    resizing = 0;

    


});

canvas.addEventListener("mousemove", function (event) {
    let deltaX = event.screenX - prevX;
    let deltaY = event.screenY - prevY;
    if (new_selection) {
        selection.x2 = event.screenX;
        selection.y2 = event.screenY;
    } else if (dragging) {
        

        selection.x1 += deltaX;
        selection.y1 += deltaY;
        selection.x2 += deltaX;
        selection.y2 += deltaY;

        

    } else if( resizing != 0)
    {
        // if(resizing == 1)
        // {

        // }
        // if(resizing == 2)
        // {

        // }
        // if(resizing == 3)
        // {

        // }
        // if(resizing == 4)
        // {

        // }
        if(resizing == 5 || resizing == 1 || resizing == 2)
        {
            if(selection.y1 > selection.y2)
            {    
                selection.y2 += deltaY;

            }else
            {
                selection.y1 += deltaY;
                

            }

        }
        if(resizing == 6 || resizing == 3 || resizing == 4)
        {
            if(selection.y1 < selection.y2)
            {    
                selection.y2 += deltaY;

            }else
            {
                selection.y1 += deltaY;
                

            }

        }
        if(resizing == 7 || resizing == 1 || resizing == 4)
        {

            if(selection.x1 > selection.x2)
            {    
                selection.x2 += deltaX;

            }else
            {
                selection.x1 += deltaX;
                

            }


        }
        if(resizing == 8 || resizing == 2 || resizing == 3)
        {

            if(selection.x1 < selection.x2)
            {    
                selection.x2 += deltaX;

            }else
            {
                selection.x1 += deltaX;
                

            }

        }
        






    }

    prevX = event.screenX;
    prevY = event.screenY;

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

    if (selection.y2 < selection.y1) {
        selection.y1 -= 1;
    }
    else {
        selection.y2 -= 1;
    }

});


Mousetrap.bind('shift+down', function () {

    if (selection.y2 < selection.y1) {
        selection.y1 += 1;
    }
    else {
        selection.y2 += 1;
    }

});


Mousetrap.bind('shift+right', function () {

    if (selection.x2 < selection.x1) {
        selection.x1 += 1;
    }
    else {
        selection.x2 += 1;
    }

});

Mousetrap.bind('shift+left', function () {

    if (selection.x2 < selection.x1) {
        selection.x1 -= 1;
    }
    else {
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

    if (insideSelection()) {
        console.log('Change cursor')
        canvas.style.cursor = 'move';
    } else if ((atTopBorder() && atLeftBorder()) || (atBottomBorder() && atRightBorder())) {
        canvas.style.cursor = 'nwse-resize';
    } else if ((atBottomBorder() && atLeftBorder()) || (atTopBorder() && atRightBorder())) {
        canvas.style.cursor = 'nesw-resize';

    }
    else if (atTopBorder() || atBottomBorder()) {
        canvas.style.cursor = 'ns-resize';
    }
    else if (atLeftBorder() || atRightBorder()) {
        canvas.style.cursor = 'ew-resize';
    }
    else {
        canvas.style.cursor = 'crosshair';
    }




}

let border_width = 5;

function insideSelection() {

    return ((selection.x1 + border_width < lastMouseX && lastMouseX < selection.x2 - border_width) || (selection.x2 + border_width < lastMouseX && lastMouseX < selection.x1 - border_width)) && ((selection.y1 + border_width < lastMouseY && lastMouseY < selection.y2 - border_width) || (selection.y2 + border_width < lastMouseY && lastMouseY < selection.y1 - border_width))

}

function atTopBorder() {
    let topBorderY = Math.min(selection.y1, selection.y2);
    let minX = Math.min(selection.x1, selection.x2);
    let maxX = Math.max(selection.x1, selection.x2);

    return ((minX - border_width < lastMouseX && lastMouseX < maxX + border_width) && Math.abs(lastMouseY - topBorderY) <= border_width);
}


function atBottomBorder() {
    let bottomBorderY = Math.max(selection.y1, selection.y2);
    let minX = Math.min(selection.x1, selection.x2);
    let maxX = Math.max(selection.x1, selection.x2);

    return ((minX - border_width < lastMouseX && lastMouseX < maxX + border_width) && Math.abs(lastMouseY - bottomBorderY) <= border_width);
}


function atLeftBorder() {
    let leftBorderX = Math.min(selection.x1, selection.x2);
    let minY = Math.min(selection.y1, selection.y2);
    let maxY = Math.max(selection.y1, selection.y2);

    return ((minY - border_width < lastMouseY && lastMouseY < maxY + border_width) && Math.abs(lastMouseX - leftBorderX) <= border_width);
}

function atRightBorder() {
    let rightBorderX = Math.max(selection.x1, selection.x2);
    let minY = Math.min(selection.y1, selection.y2);
    let maxY = Math.max(selection.y1, selection.y2);

    return ((minY - border_width < lastMouseY && lastMouseY < maxY + border_width) && Math.abs(lastMouseX - rightBorderX) <= border_width);
}
