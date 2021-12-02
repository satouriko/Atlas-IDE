const { ipcMain, app, BrowserWindow, MessageChannelMain } = require('electron')
const fs = require('fs')
const { startReceiveTweet } = require('./ReceiveTweet.js')
const { executeStatement } = require('./intepreter.js');
const { captureRejectionSymbol } = require('events');
const path = require('path');

let mainWindow;

/*
let AppList = {
  appName: {
    appName: '',
    statementList: [],
    xml: '',
    canExecute: boolean
  },
  appName2...
}
*/
let AppList = {};

let tweetInfo = {
  Identity_Language: {},
  Identity_Entity: {},
  Identity_Thing: {},
  Service: {},
  Relationship: {}
};

ipcMain.on('tweetMessage', (event, arg) => {
  // When we receive a MessagePort in the main process, it becomes a
  // MessagePortMain.
  // console.log(arg);
  event.sender.send('tweetMessage-reply', tweetInfo);
})

/*
let appInfo = {
  appName: '',
  statementList: []
}
*/
ipcMain.on('runApp', async (event, appInfo) => {
  AppList[appInfo.appName] = appInfo;
  AppList[appInfo.appName]['canExecute'] = true;
  for(let i = 0; i < AppList[appInfo.appName].statementList.length; i++){
    if(AppList[appInfo.appName]['canExecute']){
      await executeStatement(tweetInfo, AppList[appInfo.appName].statementList[i]);
    }
    event.sender.send('runApp-finish', i);
  }
})

ipcMain.on('stopApp', (event, appName)=>{
  AppList[appName]['canExecute'] = false;
  event.sender.send('stopApp-finish', null);
})
/*
let appInfo = {
  appName: '',
  fileName: '',
  statementList: [],
  xml: ''
}
*/

ipcMain.on('saveApp', (event, appInfo) => {
  if(AppList[appInfo.appName] === undefined){
    AppList[appInfo.appName] = {
      appName: appInfo.appName,
      statementList: [],
      canExecute: true
    };
  }
  AppList[appInfo.appName].statementList = appInfo.statementList;
  AppList[appInfo.appName].xml = appInfo.xml;
  try {
    fs.writeFile(appInfo.fileName, JSON.stringify(AppList[appInfo.appName]), function (err) {
      if (err) throw err;
      console.log('File is created successfully.');
      event.sender.send('saveApp-finish', null);
    });
  } catch (err) {
    console.error(err)
  }
})

ipcMain.on('loadApp', (event, fileName) => {
  try {
    fs.readFile(fileName, (err, data)=>{
      if (err) throw err;
      targetApp = JSON.parse(data);
      AppList[targetApp.appName] = targetApp;
      event.sender.send('loadApp-finish', targetApp.appName);
    });
  } catch (err) {
    console.error(err);
  }
})

ipcMain.on('getApp', (event)=>{
  event.sender.send('getApp-reply', AppList);
})

ipcMain.on('syncApp', (event, appInfo)=>{
  if(AppList.hasAttribute(appInfo.appName)){
    AppList[appInfo.appName].statementList = appInfo.statementList;
    event.sender.send('syncApp-finish', null);
  }
})

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      allowRunningInsecureContent: true,
      enableRemoteModule: true
    }
  })

  // load the index.html from a url
  win.loadURL('http://localhost:3000')

  // Open the DevTools.
  win.webContents.openDevTools()

  startReceiveTweet(tweetInfo)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.

  if (BrowserWindow.getAllWindows().length === 0) {
    console.log(1);
    mainWindow = createWindow()
  }
})
