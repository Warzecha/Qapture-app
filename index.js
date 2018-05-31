const electron = require('electron');
const url = require('url');
const path = require('path');


const fs = require('fs');
const os = require('os');


const ipcMain = require('electron').ipcMain;
const nativeImage = require('electron').nativeImage;
const clipboard = require('electron').clipboard;

const { app, BrowserWindow, Menu, globalShortcut } = electron;


let mainWindow;
let captureWindow;


const menuTemplate = []







//Listen if app is ready

app.on('ready', function () {

  console.log(process.versions.electron);


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

    ipcMain.on('copy-cropped', function () {
      console.log('copy-cropped-image');
      let img_path = path.join(os.tmpdir(), 'cropped.png');
      console.log(img_path);
      let n_img = nativeImage.createFromPath(img_path);
      console.log(n_img);
      console.log(n_img.getSize())
      clipboard.writeImage(n_img);





    })









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




