const { app, BrowserWindow, ipcMain } = require('electron');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const rutaLibros = path.join(__dirname, 'libros.json');

function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile('index.html');
}

// 🟩 Abrir con Foxit
ipcMain.on('abrir-con-foxit', (event, filePath) => {
    const foxitPath = `"C:\\Program Files (x86)\\Foxit Software\\Foxit PDF Reader\\FoxitPDFReader.exe"`;
    const command = `${foxitPath} "${filePath}"`;

    exec(command, (error) => {
        if (error) {
            console.error(`Error al abrir con Foxit: ${error.message}`);
        }
    });
});

// 🟩 Leer libros.json
ipcMain.handle('leer-libros', async () => {
    if (!fs.existsSync(rutaLibros)) {
        fs.writeFileSync(rutaLibros, '[]');
    }
    const data = fs.readFileSync(rutaLibros, 'utf-8');
    return JSON.parse(data);
});

// 🟩 Guardar libro
ipcMain.on('guardar-libro', (event, libro) => {
    let libros = [];

    if (fs.existsSync(rutaLibros)) {
        libros = JSON.parse(fs.readFileSync(rutaLibros, 'utf-8'));
    }

    libros.push(libro);
    fs.writeFileSync(rutaLibros, JSON.stringify(libros, null, 2));
});

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
