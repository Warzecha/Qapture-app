const electron = require('electron')

const path = require('path');
const fs = require('fs');
const os = require('os');


const desktopCapturer = electron.desktopCapturer;
const shell = electron.shell;
const electronScreen = electron.screen;

const { ipcRenderer } = require('electron')


let screenshotPath = '';

ipcRenderer.on('take', function (arg) {

    console.log("jestem rendererem");
   
    
   
    const thumbSize = determineScreenShot();
    let options = {
        types: ['screen'],
        thumbnailSize: thumbSize
    }

    
    
    
    desktopCapturer.getSources(options, function (error, sources) {
        if (error) return console.log(error.message);

        
        
        sources.forEach(function (source) {
            // console.log(source.name);
            if (source.name === 'Entire screen' || source.name === 'Screen 1') {
                // console.log('Got source');
                
                // console.log(source);

                screenshotPath = path.join(os.tmpdir(), 'screenshot.png');
                fs.writeFile(screenshotPath, source.thumbnail.toPNG(), function (err) {
                    if (err) return console.log(err.message);
                    // console.log(screenshotPath)
                    // shell.openExternal('file://' + screenshotPath);


                })

            }
        })

    });
    



})


function determineScreenShot() {
    const screenSize = electronScreen.getPrimaryDisplay().size;
    const maxDimensions = Math.max(screenSize.width, screenSize.height);
    return {
        width: maxDimensions * window.devicePixelRatio,
        height: maxDimensions * window.devicePixelRatio
    }
}


// console.log('Wykona sie canvas')

// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight; 

// canvas.className = "fullscreen"

// document.body.scrollTop = 0; // <-- pull the page back up to the top
// document.body.style.overflow = 'hidden'; // <-- relevant addition


// var ctx = canvas.getContext('2d');
// let image = new Image();//

// image.src = screenshotPath;

// ctx.drawImage(image,0,0);