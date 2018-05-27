const electron = require('electron');
const url = require('url');
const path = require('path');


const fs = require('fs');
const os = require('os');


const { ipcMain } = require('electron');



const { app, BrowserWindow, Menu, globalShortcut } = electron;


let mainWindow;






//Listen if app is ready

app.on('ready', function () {

  const electronScreen = electron.screen;

  const screenSize = electronScreen.getPrimaryDisplay().size;


  mainWindow = new BrowserWindow({
    //minimizable: true,
    //fullscreen: true,
    //skipTaskbar: true,
    frame: false,
    show: false,

    enableLargerThanScreen: true,
    width: screenSize.width,
    height: screenSize.height,
    // backgroundColor: '#000000',
    //opacity: 0.5,
    transparent: true,
    titleBarStyle: 'hidden'
  });

  mainWindow.loadURL(url.format(
    {
      pathname: path.join(__dirname, 'mainWindow.html'),
      protocol: 'file:'
      //slashes: ture

    }));

  mainWindow.setSize(screenSize.width, screenSize.height);


  console.log(mainWindow.getSize());
  // mainWindow.setFullScreen(true);
  // mainWindow.hide();


  // Register a 'CommandOrControl+Insert' shortcut listener.
  const ret = globalShortcut.register('CommandOrControl+Insert', () => {

    console.log('CommandOrControl+Insert is pressed')
    mainWindow.webContents.send('take', 'take_screen_shot');




    // mainWindow.maximize();
    // mainWindow.setPosition(0,0);
    // mainWindow.center();
    mainWindow.setFullScreen(true);
    mainWindow.show()
    // mainWindow.setBounds({
    //   x: 0,
    //   y: 0,
    //   width: screenSize.width,
    //   height: screenSize.height
    // });


    console.log(mainWindow.getSize());











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




