function waitForElement(selector, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const interval = 100;
    let elapsed = 0;

    const timer = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(timer);
        resolve(el);
      } else if (elapsed >= timeout) {
        clearInterval(timer);
        reject(`Element not found: ${selector}`);
      }
      elapsed += interval;
    }, interval);
  });
}

async function getYouTubeChipContainer() {
  try {
    // Wait for the <iron-selector id="chips"> element to appear
    const chipsContainer = await waitForElement('iron-selector#chips');
    console.log("✅ Found chips container:", chipsContainer);
    // Get all chip buttons inside
    //const chips = chipsContainer.querySelectorAll('yt-chip-cloud-chip-renderer');
    //console.log("✅ Found chips:", chips);

    return chipsContainer;
  } catch (err) {
    console.warn("❌", err);
  }
}


async function createYoutubeNewChip(){
    // Create a single yt-chip-cloud-chip-renderer element
    const chip = document.createElement('yt-chip-cloud-chip-renderer');
    chip.id="custom-reverse-chip";

    // Set attributes and classes
    chip.setAttribute('chip-style', 'STYLE_DEFAULT');
    chip.className = 'style-scope ytd-feed-filter-chip-bar-renderer';

    // Fill its inner HTML to match the structure you provided
    chip.innerHTML = `
    <div id="chip-shape-container" class="style-scope yt-chip-cloud-chip-renderer">
        <chip-shape class="ytChipShapeHost">
        <button class="ytChipShapeButtonReset" role="tab" aria-selected="false">
            <div class="ytChipShapeChip ytChipShapeInactive ytChipShapeOnlyTextPadding">
            Reverse
            <yt-touch-feedback-shape aria-hidden="true"
                class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response">
                <div class="yt-spec-touch-feedback-shape__stroke" style="border-radius: 8px;"></div>
                <div class="yt-spec-touch-feedback-shape__fill" style="border-radius: 8px;"></div>
            </yt-touch-feedback-shape>
            </div>
        </button>
        </chip-shape>
    </div>
    `;

    chip.addEventListener('click', () => {
        whenclickedchip();
    })

    return chip;
}


async function AddNewChipToYoutubeChipContainer(){
    const chipcontainer=await getYouTubeChipContainer();
    if(chipcontainer){
        const newchip=await createYoutubeNewChip();
        chipcontainer.appendChild(newchip);
        console.log("✅ New chip added:", newchip);
    }else{
        console.warn("❌ Chip container not found, cannot add new chip.");
    }
}

async function getnumberofvideos(){
    const container = document.querySelector(
        'div.metadata-stats.style-scope.ytd-playlist-byline-renderer'
    );
    console.log(container)
    if (!container) return null;

    // Grab the first span inside yt-formatted-string, which contains the number
    const numberSpan = container.querySelector('yt-formatted-string').querySelector('span:first-child').textContent;
    console.log(numberSpan)

    const splitnumber=numberSpan.split(",");
    const finalnumber=splitnumber[0]+splitnumber[1];

    if(finalnumber){
        return parseInt(finalnumber)
    }else{
        return null
    }
}




async function whenclickedchip(){
    const nvideos=await getnumberofvideos();
    console.log(nvideos)
    const numscrolls=(nvideos/100)+1
    console.log("clicado")
    for (let i = 0; i < numscrolls; i++) {
        // Scroll to the bottom
        document.scrollingElement.scrollTop = document.scrollingElement.scrollHeight;

        console.log(`Scroll ${i + 1} done`);

        // Wait 3 seconds
        await new Promise(resolve => setTimeout(resolve, 3000));
    }


    getInfoVideosFromPlaylist()

}



function getInfoVideosFromPlaylist(){
    const div=document.getElementById("contents");
    const videos=div.querySelectorAll("ytd-playlist-video-renderer");
    const videodata=[];

    videos.forEach((video) => {
        const index=video.querySelector("#index").innerText.trim();
        const title=video.querySelector("#video-title").innerText.trim();
        const duration=video.querySelector("span.ytd-thumbnail-overlay-time-status-renderer").innerText.trim();
        const thumbnail=video.querySelector("#thumbnail img").src;
        const url=video.querySelector("#thumbnail a").href;
        videodata.push({
            index: index,
            title: title,
            duration: duration,
            thumbnail: thumbnail,
            url: url
        });
    });

    console.log(videodata);
}

window.addEventListener('yt-navigate-finish', () => {
  console.log('🔁 YouTube navigation detected, reinserting chip');
  AddNewChipToYoutubeChipContainer("Shorts");
});

// content.js
function injectFetchInterceptor() {
    const script = document.createElement('script');
    script.textContent = `
        (function() {
            const originalFetch = window.fetch;
            window.fetch = async (...args) => {
                const response = await originalFetch(...args);

                if (args[0].includes("/youtubei/v1/browse?prettyPrint=false")) {
                    try {
                        const clone = response.clone();
                        const data = await clone.json();
                        console.log("✅ Intercepted YouTube browse response:", data);
                    } catch (err) {
                        console.error("Failed to parse JSON:", err);
                    }
                }

                return response;
            };
        })();
    `;
    document.documentElement.appendChild(script);
    script.remove();
}

injectFetchInterceptor();