const electron = require('electron')

const path = require('path');
const fs = require('fs');
const os = require('os');


const desktopCapturer = electron.desktopCapturer;
const shell = electron.shell;
const electronScreen = electron.screen;

const { ipcRenderer } = require('electron')

// var ipc = require('ipc');



ipcRenderer.on('take', function (arg) {
    
   
    const thumbSize = determineScreenShot();
    let options = {
        types: ['screen'],
        thumbnailSize: thumbSize
    }

    
    
    
    desktopCapturer.getSources(options, function (error, sources) {
        if (error) return console.log(error.message);

        
        
        sources.forEach(function (source) {
            console.log(source.name);
            if (source.name === 'Entire screen' || source.name === 'Screen 1') {
                // console.log('Got source');
                
                // console.log(source);

                const screenshotPath = path.join(os.tmpdir(), 'screenshot.png');
                fs.writeFile(screenshotPath, source.thumbnail.toPNG(), function (err) {
                    if (err) return console.log(err.message);
                    // console.log(screenshotPath)
                    // shell.openExternal('file://' + screenshotPath);
                    document.getElementById("ScreenShotImage").src = screenshotPath;

                })

            }
        })

    });
    



})


function determineScreenShot() {
    const screenSize = electronScreen.getPrimaryDisplay().size;
    console.log(electronScreen.getPrimaryDisplay());
    const maxDimensions = Math.max(screenSize.width, screenSize.height);
    return {
        width: maxDimensions * window.devicePixelRatio,
        height: maxDimensions * window.devicePixelRatio
    }
}