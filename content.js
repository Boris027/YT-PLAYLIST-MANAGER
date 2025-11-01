
//Create and Reverse Youtube Playlist Chips
async function getYouTubeChipContainer() {
  try {
    const chipsContainer = document.querySelector('div.play-menu.spaced-row.wide-screen-form.style-scope.ytd-playlist-header-renderer');
    chipsContainer.style.display="flex";
    chipsContainer.style.flexDirection="inherit";
    chipsContainer.style.gap="10px";
    console.log("✅ Found chips container:", chipsContainer);
    return chipsContainer;
  } catch (err) {
    console.warn("❌", err);
  }
}

async function getYoutubeVideosContainer() {
    const container = document.querySelector(
    'ytd-browse[page-subtype="playlist"] ytd-two-column-browse-results-renderer #primary ytd-section-list-renderer #contents ytd-item-section-renderer #contents ytd-playlist-video-list-renderer #contents'
    );
    return container;
}

async function createYoutubeReverseChip(){
    // Create a single yt-chip-cloud-chip-renderer element
    const chip = document.createElement('div');
    chip.id="reverse-chip";
    chip.textContent="Reverse";
    chip.style.backgroundColor="rgba(255, 255, 255, 0.09)";
    chip.style.padding="10px";
    chip.style.borderRadius="16px";
    chip.style.cursor="pointer";
    chip.style.color="White";
    chip.style.fontWeight="bold";
    chip.style.textAlign="center";
    chip.style.borderRadius="20px";
    chip.style.padding="12px"
    chip.style.fontSize="14px";
    chip.style.margin="3px"
    chip.style.marginTop="0px"
    chip.style.marginBottom="0px";
    chip.style.backdropFilter="blur(10px)";

    chip.addEventListener('click', () => {
        whenclickedchip();
    })

    chip.addEventListener('mouseover', () => {
        chip.style.backgroundColor="rgba(255, 255, 255, 0.19)";
    })

    chip.addEventListener('mouseout', () => {
        chip.style.backgroundColor="rgba(255, 255, 255, 0.09)";
    })

    return chip;
}



async function createYoutubeExportChip(){
    // Create a single yt-chip-cloud-chip-renderer element
    const chip = document.createElement('div');
    chip.id="export-chip";
    chip.textContent="Export";
    chip.style.backgroundColor="rgba(255, 255, 255, 0.09)";
    chip.style.padding="10px";
    chip.style.borderRadius="16px";
    chip.style.cursor="pointer";
    chip.style.color="White";
    chip.style.fontWeight="bold";
    chip.style.textAlign="center";
    chip.style.borderRadius="20px";
    chip.style.padding="12px"
    chip.style.fontSize="14px";
    chip.style.margin="3px"
    chip.style.marginTop="0px"
    chip.style.backdropFilter="blur(10px)";

    chip.addEventListener('click', () => {
        GetData();
    })

    chip.addEventListener('mouseover', () => {
        chip.style.backgroundColor="rgba(255, 255, 255, 0.19)";
    })

    chip.addEventListener('mouseout', () => {
        chip.style.backgroundColor="rgba(255, 255, 255, 0.09)";
    })

    return chip;
}


async function AddNewChipToYoutubeChipContainer(){
    const chipcontainer=await getYouTubeChipContainer();
    if(chipcontainer){
        if(!document.getElementById("reverse-chip")){
            const newchip=await createYoutubeReverseChip();
            chipcontainer.appendChild(newchip);
            console.log("✅ New chip added:", newchip);
        }

        if(!document.getElementById("export-chip")){
            const exportchip=await createYoutubeExportChip();
            chipcontainer.appendChild(exportchip);
            console.log("✅ New export chip added:", exportchip);
        }
        
        
    }else{
        console.warn("❌ Chip container not found, cannot add new chip.");
    }
}







async function whenclickedchip(){
    // Select the parent first
    //const container = document.getElementById("contents").querySelector("ytd-item-section-renderer [id='contents']").querySelector("ytd-item-section-renderer [id='contents']");
    const container = await getYoutubeVideosContainer();
    container.style.display="flex";


    if(container.style.flexDirection==="column-reverse"){
        container.style.flexDirection="column";
    }else{
        container.style.flexDirection="column-reverse";
    }
}


//Exort Data Functionality
async function GetData(){
    const nvideos=await getnumberofvideos();
    const numscrolls=(nvideos/100)+1
    for (let i = 0; i < numscrolls; i++) {
        // Scroll to the bottom
        document.scrollingElement.scrollTop = document.scrollingElement.scrollHeight;

        console.log(`Scroll ${i + 1} done`);

        // Wait 3 seconds
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
    const videodata=await getInfoVideosFromPlaylist()
    downloadJSON(JSON.stringify(videodata),getnamePlaylist());
}


async function getnumberofvideos(){
    /*const container = document.querySelector(
        'div.metadata-stats.style-scope'
    );
    console.log(container)
    if (!container) return null;

    // Grab the first span inside yt-formatted-string, which contains the number
    const numberSpan = container.querySelector('yt-formatted-string').querySelector('span:first-child').textContent;*/

    const numberSpan = document.querySelector(
    'ytd-browse[page-subtype="playlist"] ytd-playlist-header-renderer div div:nth-of-type(2) div:nth-of-type(1) .metadata-wrapper .metadata-action-bar .metadata-text-wrapper ytd-playlist-byline-renderer div yt-formatted-string'
    ).textContent;

    const splitnumber=numberSpan.split(",");
    const finalnumber=splitnumber[0]+splitnumber[1];

    if(finalnumber){
        return parseInt(finalnumber)
    }else{
        return null
    }
}

function getnamePlaylist(){
    return document.title;
}



async function getInfoVideosFromPlaylist(){
    const div=await getYoutubeVideosContainer();
    const videos=div.querySelectorAll("ytd-playlist-video-renderer");
    const videodata=[];

    videos.forEach((video) => {
        const index=video.querySelector("#index-container yt-formatted-string").innerText.trim();
        const title=video.querySelector("#content #container #meta h3").innerText.trim();
        const duration=video.querySelector("span.ytd-thumbnail-overlay-time-status-renderer").innerText.trim();
        const thumbnail=video.querySelector("#thumbnail img").src;
        const url=video.querySelector("#thumbnail a").href;
        videodata.push({
            index: index,
            title: title,
            duration: duration,
            url: url
        });
    });

    return videodata;
}


function downloadJSON(data, filename = "data.json") {
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url); 
}



// Listen for YouTube navigation events to update and put the options
window.addEventListener('yt-navigate-finish', async () => {
    if (!location.href.startsWith("https://www.youtube.com/playlist")) {
        console.log("⚠️ Not on a playlist page — skipping reverse.");
        return;
    }else{
        console.log('🔁 YouTube navigation detected, reinserting chip');
        await new Promise(r => setTimeout(r, 500));
            // Adjust playlist video container in a normal state, every time the page loads
        try {
            const container = document.getElementById("contents").querySelector("ytd-item-section-renderer [id='contents']").querySelector("ytd-item-section-renderer [id='contents']");
            container.style.flexDirection="column";
        } catch (error) {
        }
        // Check if chip already exists, if not, add it
        AddNewChipToYoutubeChipContainer("Shorts");
    }
});

