

function getPlaylistContainer(){
    return document.querySelector("ytd-app #content ytd-page-manager ytd-browse ytd-two-column-browse-results-renderer #primary ytd-rich-grid-renderer #contents")
}

function getLists(){
    const PlaylistContainer = getPlaylistContainer();
    if (!PlaylistContainer) return null;
    const playlists=PlaylistContainer.querySelectorAll("ytd-rich-item-renderer");
    console.log(playlists)
    let nameplaylists=[];
    playlists.forEach(element => {
        console.log(element)
        nameplaylists.push(element.querySelector("yt-lockup-metadata-view-model div h3").textContent);
    });
    return nameplaylists
}

function importbutton(){
    // Create the "Import Lists" button element
    const importButton = document.createElement("button");
    importButton.id = "yt-import-lists-btn";
    importButton.textContent = "Import Lists";

    // Night-mode friendly style
    Object.assign(importButton.style, {
    position: "fixed",
    top: "80px",
    right: "20px",
    zIndex: "10000",
    backgroundColor: "#272727", // dark gray like YouTube's dark theme
    color: "#fff",
    border: "1px solid #3f3f3f",
    borderRadius: "20px",
    padding: "8px 16px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
    transition: "background 0.2s ease, transform 0.1s ease",
    fontFamily: "Roboto, Arial, sans-serif",
    });

    // Hover / focus styles to match dark mode
    importButton.onmouseenter = () => {
        importButton.style.backgroundColor = "#383838";
        importButton.style.transform = "translateY(-1px)";
    };
    importButton.onmouseleave = () => {
        importButton.style.backgroundColor = "#272727";
        importButton.style.transform = "none";
    };

    importButton.onclick = async () => {
        //touch the Owned button so only you will be able to import to true lists not created by youtube
        await document.querySelector("chip-bar-view-model div:nth-of-type(4) chip-view-model chip-shape button").click()
        await new Promise(resolve => setTimeout(resolve, 1000));
        pickerModel(getLists());
    }


    const playlistcontainer=getPlaylistContainer();
    playlistcontainer.appendChild(importButton);

}

function pickerModel(optionsplaylist){
    const box = document.createElement("div");
    box.id = "yt-json-import-box";

    // === Close button ===
    const closeBtn = document.createElement("span");
    closeBtn.textContent = "×"; // Unicode multiply symbol
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "6px";
    closeBtn.style.right = "10px";
    closeBtn.style.fontSize = "18px";
    closeBtn.style.fontWeight = "bold";
    closeBtn.style.color = "#aaa";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.transition = "color 0.2s ease";
    closeBtn.onmouseenter = () => (closeBtn.style.color = "#fff");
    closeBtn.onmouseleave = () => (closeBtn.style.color = "#aaa");
    closeBtn.onclick = () => box.remove();

    // === Label: Select Playlist ===
    const labelSelect = document.createElement("label");
    labelSelect.htmlFor = "yt-playlist-selector";
    labelSelect.textContent = "Select Playlist:";
    labelSelect.style.display = "block";
    labelSelect.style.marginBottom = "6px";
    labelSelect.style.fontSize = "13px";
    labelSelect.style.fontWeight = "500";
    labelSelect.style.color = "#aaa";

    // === Selector ===
    const select = document.createElement("select");
    select.id = "yt-playlist-selector";
    select.style.width = "100%";
    select.style.backgroundColor = "#303030";
    select.style.color = "#fff";
    select.style.border = "1px solid #444";
    select.style.borderRadius = "6px";
    select.style.padding = "6px 8px";
    select.style.fontSize = "13px";
    select.style.marginBottom = "12px";
    select.style.outline = "none";
    select.style.boxSizing = "border-box";
    select.style.cursor = "pointer";

    // Options
    const optDefault = document.createElement("option");
    optDefault.textContent = "Choose a playlist...";
    optDefault.disabled = true;
    optDefault.selected = true;
    select.append(optDefault);

    console.log(optionsplaylist);
    optionsplaylist.forEach(element => {
    const option = document.createElement("option");
    option.value = element;
    option.textContent = element;
    select.appendChild(option);
    });

    // === Label: JSON File ===
    const labelFile = document.createElement("label");
    labelFile.htmlFor = "yt-json-file";
    labelFile.textContent = "Import JSON File:";
    labelFile.style.display = "block";
    labelFile.style.marginBottom = "6px";
    labelFile.style.fontSize = "13px";
    labelFile.style.fontWeight = "500";
    labelFile.style.color = "#aaa";

    // === File input ===
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.id = "yt-json-file";
    fileInput.accept = ".json";
    fileInput.style.width = "100%";
    fileInput.style.backgroundColor = "#303030";
    fileInput.style.color = "#fff";
    fileInput.style.border = "1px solid #444";
    fileInput.style.borderRadius = "6px";
    fileInput.style.padding = "6px 8px";
    fileInput.style.fontSize = "13px";
    fileInput.style.marginBottom = "12px";
    fileInput.style.outline = "none";
    fileInput.style.boxSizing = "border-box";
    fileInput.style.cursor = "pointer";

    // === Start button ===
    const startBtn = document.createElement("button");
    startBtn.textContent = "Start";
    startBtn.style.width = "100%";
    startBtn.style.backgroundColor = "#303030";   // dark gray like YT dark mode buttons
    startBtn.style.color = "#fff";
    startBtn.style.border = "1px solid #444";
    startBtn.style.borderRadius = "6px";
    startBtn.style.padding = "8px 12px";
    startBtn.style.fontSize = "14px";
    startBtn.style.fontWeight = "500";
    startBtn.style.cursor = "pointer";
    startBtn.style.transition = "background 0.2s, box-shadow 0.2s, transform 0.1s";
    startBtn.style.display = "none"; // hidden until conditions met
    startBtn.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
    startBtn.style.fontFamily = "Roboto, Arial, sans-serif";

    startBtn.onmouseenter = () => {
        startBtn.style.backgroundColor = "#383838";
        startBtn.style.boxShadow = "0 4px 10px rgba(0,0,0,0.4)";
        startBtn.style.transform = "translateY(-1px)";
    };

    startBtn.onmouseleave = () => {
        startBtn.style.backgroundColor = "#303030";
        startBtn.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
        startBtn.style.transform = "none";
    };

    startBtn.addEventListener("click",c=>{
        startImport(fileInput.files,select.value)
    })

    // === Show "Start" only when both selected ===
    function updateButtonVisibility() {
    if (select.value && fileInput.files.length > 0) {
        startBtn.style.display = "block";
    } else {
        startBtn.style.display = "none";
    }
    }
    select.addEventListener("change", updateButtonVisibility);
    fileInput.addEventListener("change", updateButtonVisibility);

    // === Container styling ===
    box.style.position = "fixed";
    box.style.top = "100px";
    box.style.right = "20px";
    box.style.backgroundColor = "#212121";
    box.style.color = "#fff";
    box.style.padding = "24px 20px 20px 20px";
    box.style.borderRadius = "12px";
    box.style.boxShadow = "0 4px 12px rgba(0,0,0,0.4)";
    box.style.zIndex = "10000";
    box.style.fontFamily = "Roboto, Arial, sans-serif";
    box.style.width = "240px";
    box.style.overflow = "hidden";
    box.style.boxSizing = "border-box";

    // === Append everything ===
    box.appendChild(closeBtn);
    box.appendChild(labelSelect);
    box.appendChild(select);
    box.appendChild(labelFile);
    box.appendChild(fileInput);
    box.appendChild(startBtn);


    const container=document.querySelector("ytd-app");
    container.appendChild(box);
}


async function startImport(file,nameplaylist){
    const fileobject=JSON.parse(await file[0].text())
    

    for (const element of fileobject) {
        
            
        
        const newWindow = window.open(element.url);
        await new Promise(resolve => {
            newWindow.onload = resolve;
        });

        try {
            // Wait for element to appear
            async function waitForElement(selector, root = newWindow.document, timeout = 10000) {
                const start = Date.now();
                while (Date.now() - start < timeout) {
                    const el = root.querySelector(selector);
                    if (el) return el;
                    await new Promise(r => setTimeout(r, 200));
                }
                throw new Error(`Element ${selector} not found in time`);
            }

            //open the 3 points button
            const optionsbutton = await waitForElement("#button-shape button");
            optionsbutton.click()
            
            //get the content with save and report button
            const listBox1 = await waitForElement(
                'ytd-menu-popup-renderer tp-yt-paper-listbox#items '
            );
            //try to get the save button from the ... options
            const listBox=listBox1.querySelectorAll("ytd-menu-service-item-renderer")
            if(listBox.length>1){
                const options=await waitForElement('tp-yt-paper-listbox ytd-menu-service-item-renderer')
                options.click();
            }else{
                //if that doesnt exists, it try to take it from the normal bar, where like, dislike, download are located
                const thirdButton = await waitForElement(
                    'ytd-menu-renderer #flexible-item-buttons yt-button-view-model:nth-of-type(2) button-view-model button'
                );
                thirdButton.click();
            }
            

            /*const thirdButton = document.querySelector(
                'ytd-menu-renderer #flexible-item-buttons yt-button-view-model:nth-of-type(2) button-view-model button'
            );*/

            const optionstosave=await waitForElement('yt-list-view-model')
            console.log(optionstosave)
            const options2=optionstosave.querySelectorAll("toggleable-list-item-view-model")
            for(const c of options2){
                const listname=c.querySelector("yt-list-item-view-model div .yt-list-item-view-model__text-wrapper div span").textContent

                if(listname==nameplaylist){
                    c.querySelector("yt-list-item-view-model").click();
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    newWindow.close()
                    break;
                }

            }

        } catch (error) {
            newWindow.close()
        }

        await new Promise(resolve => setTimeout(resolve, 3000));
    }

}


window.addEventListener('yt-navigate-finish', async () => {
    if (!location.href.startsWith("https://www.youtube.com/feed/playlists")) {
        //console.log("⚠️ Not on a playlist page — skipping reverse.");
        console.log("it wasnt possible to put the import button");
        return;
    }else{
        console.log('🔁 Inserting import button');
        await new Promise(r => setTimeout(r, 500));
        
        importbutton();
    }
});