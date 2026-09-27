const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs/promises');

function createWindow() {
  const win = new BrowserWindow({
    width: 900, 
    height: 600,
    webPreferences: { 
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});


ipcMain.handle('list-dir', async (event, dir) => {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries.map(e => ({ 
      name: e.name, 
      isDir: e.isDirectory(),
      fullPath: path.resolve(dir, e.name)
    }));
  } catch (error) {
    console.error("Ошибка чтения каталога:", error);
    return [];
  }
});

ipcMain.handle('open-file', async (event, filePath) => {
  const errorMessage = await shell.openPath(filePath);
  if (errorMessage) {
    console.error("Ошибка открытия файла:", errorMessage);
  }
});