const electron = require('electron');
const url = require('url');
const path = require('path');


const fs = require('fs');
const os = require('os');


const ipcMain = require('electron').ipcMain;
const nativeImage = require('electron').nativeImage;
const clipboard = require('electron').clipboard;

const { app, BrowserWindow, Menu, globalShortcut, Tray } = electron;


let mainWindow = null;
let captureWindow = null;
let aboutWindow = null;
let tray = null


const menuTemplate = []







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



  tray = new Tray('./assets/images/tray_icon.png')
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Take screenshot',
      click() {
        takeScreenshot();
      }
    },
    {
      label: 'About',
      click() {

        aboutWindow = new BrowserWindow({
          skipTaskbar: true,
          resizable: false

        })

        aboutWindow.loadURL(url.format({
          pathname: path.join(__dirname, 'aboutWindow.html'),
          protocol: 'file:',
          slashes: true
        }));

        // aboutWindow.webContents.openDevTools();

      }
    },
    {
      label: 'Quit',
      click() { app.quit()}
    }
  ])
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)




  // Register a 'CommandOrControl+Insert' shortcut listener.
  const ret = globalShortcut.register('CommandOrControl+Insert', () => {

    takeScreenshot()

  })

  if (!ret) {
    console.log('registration failed')
  }

  // Check whether a shortcut is registered.
  console.log(globalShortcut.isRegistered('CommandOrControl+Insert'))




  function takeScreenshot() {

    captureWindow.webContents.send('take', 'take_screen_shot');

    console.log('CommandOrControl+Insert is pressed')

    mainWindow = new BrowserWindow({
      minimizable: true,
      fullscreen: true,
      skipTaskbar: true,
      frame: false,
      show: false,



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

    mainWindow.once('ready-to-show', () => {
      mainWindow.show()
      
      mainWindow.focus()
    })
    // mainWindow.webContents.openDevTools();


  }




});


app.on('will-quit', () => {
  // Unregister a shortcut.
  globalShortcut.unregister('CommandOrControl+Insert')

  // Unregister all shortcuts.
  globalShortcut.unregisterAll()
})

exports.copy_cropped = () => {

  console.log('copy-cropped-image');
  let img_path = path.join(os.tmpdir(), 'cropped.png');
  console.log(img_path);
  let n_img = nativeImage.createFromPath(img_path);
  console.log(n_img);
  console.log(n_img.getSize())
  clipboard.writeImage(n_img);

}

exports.close_main_window = () => {

  mainWindow.close();

  mainWindow.on('closed', () => {
    mainWindow = null;
  })
  let original_img_path = path.join(os.tmpdir(), 'screenshot.png');
  let cropped_img_path = path.join(os.tmpdir(), 'cropped.png');
  fs.unlink(original_img_path, (err) => { });
  fs.unlink(cropped_img_path, (err) => { });


}





