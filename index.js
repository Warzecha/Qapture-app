const electron = require('electron');
const url = require('url');
const path = require('path');


const fs = require('fs');
const os = require('os');


const {ipcMain} = require('electron');



const {app, BrowserWindow, Menu, globalShortcut} = electron;


let mainWindow;
let captureWindow;





//Listen if app is ready

app.on('ready', function(){
	
mainWindow = new BrowserWindow({
        minimizable: true,
        // alwaysOnTop: true,
        // fullscreen: true,
        skipTaskbar: true,
        frame: false,
        show: false,
        // backgroundColor: '#000000',
        //opacity: 0.5,
        // transparent: true,
        titleBarStyle: 'hidden'
      });

      mainWindow.loadURL(url.format(
      {
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:'
        //slashes: ture

      }));


// Register a 'CommandOrControl+Insert' shortcut listener.
    const ret = globalShortcut.register('CommandOrControl+Insert', () => {
      
      console.log('CommandOrControl+Insert is pressed')

      


      


      mainWindow.webContents.send('take','take_screen_shot');


      mainWindow.show();


      
    


    //   captureWindow = new BrowserWindow({
    //   minimizable: true,
    //   skipTaskbar: true,
    //   frame: false,
    //   show: false,
      
      
    // });

    // captureWindow.loadURL(url.format(
    // {
    //   pathname: path.join(__dirname, 'captureWindow.html'),
    //   protocol: 'file:'
    //   //slashes: ture

    // }));

      









      // mainWindow.show()

      
    })
  
    if (!ret) {
      console.log('registration failed')
    }
  
    // Check whether a shortcut is registered.
    console.log(globalShortcut.isRegistered('CommandOrControl+Insert'))
    


});


app.on('will-quit', () => {
    // Unregister a shortcut.
    globalShortcut.unregister('CommandOrControl+Insert')
  
    // Unregister all shortcuts.
    globalShortcut.unregisterAll()
  })




