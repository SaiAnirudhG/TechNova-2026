const{app, BrowserWindow} = require("electron");
let win;
function createWindow(){
    win = new BrowserWindow({
        width: 1200,
        height: 700,
        icon: "./images/technova.png"
    });
    win.loadFile("index.html");

}
app.whenReady().then(createWindow);
app.on("window-all-closed", ()=>{
    if (process.platform !== "darwin"){
        app.quit();
    }
});
