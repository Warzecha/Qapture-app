const electron = require('electron');
const url = require('url');
const path = require('path');


const fs = require('fs');
const os = require('os');


const { ipcMain } = require('electron');



const { app, BrowserWindow, Menu, globalShortcut } = electron;


let mainWindow;
let captureWindow;


const menuTemplate = [ ]







//Listen if app is ready

app.on('ready', function () {

  const electronScreen = electron.screen;

  const screenSize = electronScreen.getPrimaryDisplay().size;

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  captureWindow = new BrowserWindow({
    show: false
  })

  captureWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'captureWindow.html'),
    protocol: 'file:',
    slashes: true
  }));



  // Register a 'CommandOrControl+Insert' shortcut listener.
  const ret = globalShortcut.register('CommandOrControl+Insert', () => {




    captureWindow.webContents.send('take', 'take_screen_shot');

    console.log('CommandOrControl+Insert is pressed')

    mainWindow = new BrowserWindow({
      minimizable: true,
      fullscreen: true,
      skipTaskbar: true,
      frame: false,
      show: true,
      
      

      // enableLargerThanScreen: true,
      width: screenSize.width,
      height: screenSize.height,

      titleBarStyle: 'hidden'
    });

    mainWindow.loadURL(url.format(
      {
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true

      }));

      // mainWindow.setMenu(menu);
      mainWindow.webContents.openDevTools();


    // captureWindow.close();











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




