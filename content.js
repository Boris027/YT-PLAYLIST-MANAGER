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


async function whenclickedchip(){
    console.log("clicado")
}

window.addEventListener('yt-navigate-finish', () => {
  console.log('🔁 YouTube navigation detected, reinserting chip');
  AddNewChipToYoutubeChipContainer("Shorts");
});


