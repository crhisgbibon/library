'use strict';

import $ from 'jquery';

const imagesContext = require.context('./images', true, /\.(png|jpg|jpeg|gif|ico|svg|webp)$/);
imagesContext.keys().forEach(imagesContext);

const playPath = imagesContext('./play.svg');
const pausePath = imagesContext('./pause.svg');

function CalculateVh() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', vh + 'px');
}

window.addEventListener('DOMContentLoaded', CalculateVh);
window.addEventListener('resize', CalculateVh);
window.addEventListener('orientationchange', CalculateVh);

// const topControl: HTMLElement = <HTMLElement>(
//   document.getElementById('topControl')
// );
// const controls: HTMLElement = <HTMLElement>document.getElementById('controls');
// const botControl: HTMLElement = <HTMLElement>(
//   document.getElementById('botControl')
// );
// const textDiv: HTMLElement = <HTMLElement>document.getElementById('textDiv');

const messageBoxHolder: HTMLElement = <HTMLElement>(
  document.getElementById('messageBoxHolder')
);
messageBoxHolder.onclick = function () {
  TogglePanel(messageBoxHolder);
};
const messageBox: HTMLElement = <HTMLElement>(
  document.getElementById('messageBox')
);

const libraryButton: HTMLElement = <HTMLElement>(
  document.getElementById('libraryButton')
);
libraryButton.onclick = function () {
  ToggleMenu(views, viewBs, 0);
};
const libraryMenu: HTMLElement = <HTMLElement>(
  document.getElementById('libraryMenu')
);
libraryMenu.style.display = 'none';

const optionsButton: HTMLElement = <HTMLElement>(
  document.getElementById('optionsButton')
);
optionsButton.onclick = function () {
  ToggleMenu(views, viewBs, 1);
};
const settingsMenu: HTMLElement = <HTMLElement>(
  document.getElementById('settingsMenu')
);
settingsMenu.style.display = 'none';

const views = [libraryMenu, settingsMenu];
const viewBs = [libraryButton, optionsButton];

const playButton: HTMLElement = <HTMLElement>(
  document.getElementById('playButton')
);
playButton.onclick = function () {
  PlayPauseResumeSpeech();
};
const iPlay: HTMLImageElement = <HTMLImageElement>(
  document.getElementById('iPlay')
);
const stopButton: HTMLElement = <HTMLElement>(
  document.getElementById('stopButton')
);
stopButton.onclick = function () {
  StopSpeech();
};
const locationNumber: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('locationNumber')
);
locationNumber.onchange = function () {
  locationIndex = parseInt(locationNumber.value);
};

const chapterSelect: HTMLSelectElement = <HTMLSelectElement>(
  document.getElementById('chapterSelect')
);
const loadSelected: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('loadSelected')
);
loadSelected.onclick = function () {
  StopSpeech();
  textArea.scrollTop = 0;
  LoadChapter('GETCHAPTER');
};
const lastChapter: HTMLElement = <HTMLElement>(
  document.getElementById('lastChapter')
);
lastChapter.onclick = function () {
  StopSpeech();
  textArea.scrollTop = 0;
  LoadChapter('LASTCHAPTER');
};
const nextChapter: HTMLElement = <HTMLElement>(
  document.getElementById('nextChapter')
);
nextChapter.onclick = function () {
  StopSpeech();
  textArea.scrollTop = 0;
  LoadChapter('NEXTCHAPTER');
};

const autoplayCheckbox: HTMLElement = <HTMLElement>(
  document.getElementById('autoplayCheckbox')
);
autoplayCheckbox.onchange = function () {
  autoplay = !autoplay;
  if (autoplay) MessageBox('Autoplay on.');
  else MessageBox('Autoplay off.');
};

const clearGenre: HTMLElement = <HTMLElement>(
  document.getElementById('clearGenre')
);
clearGenre.onclick = function () {
  FilterGenre(-1);
};
const clearAuthor: HTMLElement = <HTMLElement>(
  document.getElementById('clearAuthor')
);
clearAuthor.onclick = function () {
  FilterAuthor(-1);
};
let currentSourceDiv = document.getElementById('currentSourceDiv');
const sources: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName(
  'source'
) as HTMLCollectionOf<HTMLElement>;
const genres: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName(
  'genre'
) as HTMLCollectionOf<HTMLElement>;
const authors: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName(
  'author'
) as HTMLCollectionOf<HTMLElement>;

const toggleLibrary: HTMLElement = <HTMLElement>(
  document.getElementById('toggleLibrary')
);
toggleLibrary.onclick = function () {
  ToggleMenu(databasePanels, databasePanelBs, 0);
};
const toggleGenre: HTMLElement = <HTMLElement>(
  document.getElementById('toggleGenre')
);
toggleGenre.onclick = function () {
  ToggleMenu(databasePanels, databasePanelBs, 1);
};
const toggleAuthor: HTMLElement = <HTMLElement>(
  document.getElementById('toggleAuthor')
);
toggleAuthor.onclick = function () {
  ToggleMenu(databasePanels, databasePanelBs, 2);
};

const selectDocumentPanel: HTMLElement = <HTMLElement>(
  document.getElementById('selectDocumentPanel')
);
const genreFilterPanel: HTMLElement = <HTMLElement>(
  document.getElementById('genreFilterPanel')
);
const genreAuthorPanel: HTMLElement = <HTMLElement>(
  document.getElementById('genreAuthorPanel')
);
const databasePanels = [
  selectDocumentPanel,
  genreFilterPanel,
  genreAuthorPanel,
];
const databasePanelBs = [toggleLibrary, toggleGenre, toggleAuthor];
genreFilterPanel.style.display = 'none';
genreAuthorPanel.style.display = 'none';

const loadFile: HTMLElement = <HTMLElement>document.getElementById('loadFile');
loadFile.onclick = function () {
  if (currentSourceDiv === null) return;
  if (currentSourceDiv.dataset.value === null) {
    MessageBox('Please select a file.');
  } else {
    const s = currentSourceDiv.dataset.value
      ? currentSourceDiv.dataset.value.toString()
      : '';
    LoadNewText(s);
  }
};

const volumeSlider: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('volumeSlider')
);
volumeSlider.onchange = function () {
  ChangeVolume(parseFloat(volumeSlider.value));
};

const showVolume: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('showVolume')
);
showVolume.onchange = function () {
  ChangeVolume(parseFloat(showVolume.value));
};

const rateSlider: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('rateSlider')
);
rateSlider.onchange = function () {
  ChangeRate(parseFloat(rateSlider.value));
};

const showRate: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('showRate')
);
showRate.onchange = function () {
  ChangeRate(parseFloat(showRate.value));
};

const voiceSelect: HTMLSelectElement = <HTMLSelectElement>(
  document.getElementById('voiceSelect')
);
voiceSelect.onchange = function () {
  ChangeVoice();
};

const fontSize: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('fontSize')
);
fontSize.onchange = function () {
  textArea.style.fontSize = fontSize.value + 'px';
};

const fontStyle: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('fontStyle')
);
fontStyle.onchange = function () {
  textArea.style.fontFamily = fontStyle.value;
};

const textArea: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('textArea')
);
textArea.onkeyup = function () {
  FindTextEndNumber();
  NewText();
};
textArea.onblur = function () {
  FindTextEndNumber();
  NewText();
};
textArea.ondblclick = function () {
  ChangeLocationIndex(GetCaretPosition(textArea));
};

const hiddenText: HTMLElement = <HTMLElement>(
  document.getElementById('hiddenText')
);

const speech = new SpeechSynthesisUtterance();

let voices: SpeechSynthesisVoice[] = [];
let playing = false;
let locationIndex = 0;
let savedText = '';
let formattedText = '';
let currentSource = '';
let autoplay = false;

let timeOut: NodeJS.Timeout | null = null;
// let toggleView = false;

ToggleMenu(views, viewBs, 0);
ToggleMenu(databasePanels, databasePanelBs, 0);

const makecurrents: HTMLCollectionOf<HTMLElement> =
  document.getElementsByClassName(
    'makecurrents'
  ) as HTMLCollectionOf<HTMLElement>;
for (let i = 0; i < makecurrents.length; i++) {
  makecurrents[i].onclick = function () {
    MakeCurrent(makecurrents[i]);
  };
}

const filtergenres: HTMLCollectionOf<HTMLElement> =
  document.getElementsByClassName(
    'filtergenres'
  ) as HTMLCollectionOf<HTMLElement>;
for (let i = 0; i < filtergenres.length; i++) {
  filtergenres[i].onclick = function () {
    FilterGenre(filtergenres[i]);
  };
}

const filterauthors: HTMLCollectionOf<HTMLElement> =
  document.getElementsByClassName(
    'filterauthors'
  ) as HTMLCollectionOf<HTMLElement>;
for (let i = 0; i < filterauthors.length; i++) {
  filterauthors[i].onclick = function () {
    FilterAuthor(filterauthors[i]);
  };
}

// function ToggleView() {
//   toggleView = !toggleView;
//   if (toggleView) {
//     topControl.style.display = 'none';
//     controls.style.display = 'none';
//     botControl.style.display = 'none';

//     textDiv.style.height = 'calc(var(--vh) * 92)';
//     textDiv.style.maxHeight = 'calc(var(--vh) * 92)';

//     libraryMenu.style.height = 'calc(var(--vh) * 92)';
//     libraryMenu.style.maxHeight = 'calc(var(--vh) * 92)';

//     settingsMenu.style.height = 'calc(var(--vh) * 92)';
//     settingsMenu.style.maxHeight = 'calc(var(--vh) * 92)';
//   } else {
//     topControl.style.display = '';
//     controls.style.display = '';
//     botControl.style.display = '';

//     textDiv.style.height = 'calc(var(--vh) * 77)';
//     textDiv.style.maxHeight = 'calc(var(--vh) * 77)';

//     libraryMenu.style.height = 'calc(var(--vh) * 77)';
//     libraryMenu.style.maxHeight = 'calc(var(--vh) * 77)';

//     settingsMenu.style.height = 'calc(var(--vh) * 77)';
//     settingsMenu.style.maxHeight = 'calc(var(--vh) * 77)';
//   }
// }

function ToggleMenu(
  array: HTMLElement[],
  buttons: HTMLElement[],
  number: number
) {
  for (let i = 0; i < array.length; i++) {
    if (i === number) {
      if (array === databasePanels) {
        buttons[i].style.backgroundColor = 'var(--foregroundLight)';
        buttons[i].style.color = 'var(--grey)';
      } else if (array === views) {
        buttons[i].style.backgroundColor = 'var(--grey)';
      }
      if (array[i].style.display === '' && array !== databasePanels) {
        buttons[i].style.backgroundColor = 'var(--background)';
        array[i].style.display = 'none';
      } else {
        array[i].style.display = '';
      }
    } else {
      if (array === databasePanels) {
        buttons[i].style.backgroundColor = 'var(--grey)';
        buttons[i].style.color = 'var(--foregroundLight)';
      } else if (array === views) {
        buttons[i].style.backgroundColor = 'var(--background)';
      }
      array[i].style.display = 'none';
    }
  }
}

function PlayPauseResumeSpeech() {
  if (!playing) {
    speech.lang = 'en';

    if (
      hiddenText.innerText === null ||
      hiddenText.innerText === '' ||
      hiddenText.innerText === undefined
    ) {
      MessageBox('Please provide text to play.');
      return;
    }

    speech.text = hiddenText.innerText.substring(locationIndex);
    textArea.disabled = true;

    window.speechSynthesis.speak(speech);
    iPlay.src = pausePath;
    playing = true;
  } else if (playing && !window.speechSynthesis.paused) {
    window.speechSynthesis.pause();
    textArea.value = formattedText;
    textArea.disabled = false;
    iPlay.src = playPath;
  } else if (playing && window.speechSynthesis.paused) {
    speech.text = hiddenText.innerText.substring(locationIndex);
    window.speechSynthesis.resume();
    textArea.disabled = true;
    iPlay.src = pausePath;
  }
}

function ChangeLocationIndex(newValue: number) {
  locationIndex = newValue;
  locationNumber.value = locationIndex.toString();
}

function GetCaretPosition(ctrl: HTMLInputElement) {
  // IE < 9 Support
  // if(document.selection)
  // {
  //   ctrl.focus();
  //   let range = document.selection.createRange();
  //   let rangelen = range.text.length;
  //   range.moveStart('character', -ctrl.value.length);
  //   let start = range.text.length - rangelen;
  //   return start + rangelen;
  // }// IE >=9 and other browsers
  // else

  return ctrl.selectionStart ? <number>ctrl.selectionStart : 0;
}

function FindTextEndNumber() {
  locationNumber.max = hiddenText.innerText.length.toString();
}

function NewText() {
  if (!playing) {
    savedText = textArea.value;
    formattedText = textArea.value;
    hiddenText.innerText = savedText;
    locationIndex = 0;
    locationNumber.value = locationIndex.toString();
  }
}

function StopSpeech() {
  playing = false;
  window.speechSynthesis.cancel();
  textArea.value = formattedText.toString();
  locationIndex = 0;
  locationNumber.value = locationIndex.toString();
  textArea.disabled = false;
  iPlay.src = playPath;
}

function ChangeVolume(volume: number) {
  speech.volume = volume;
  volumeSlider.value = volume.toString();
  showVolume.value = volume.toString();
}

function ChangeRate(rate: number) {
  speech.rate = rate;
  rateSlider.value = rate.toString();
  showRate.value = rate.toString();
}

function ChangeVoice() {
  speech.voice = voices[voiceSelect.options.selectedIndex];
}

window.speechSynthesis.onvoiceschanged = () => {
  voices.length = 0;
  voices = speechSynthesis.getVoices();
  speech.voice = voices[0];

  if (voices.length == 0) return;

  for (let i = 0; i < voices.length; i++) {
    const newOption = document.createElement('option');
    newOption.innerHTML = voices[i].name;
    newOption.id = i.toString();
    voiceSelect.appendChild(newOption);
  }
};

window.onbeforeunload = function () {
  StopSpeech();
};

speech.onboundary = function (event) {
  const wordPos = <Array<number>>(
    GetWordPos(hiddenText.innerText, event.charIndex)
  );
  if (isFinite(wordPos[0])) {
    const wordLen = formattedText.length;
    const wordPerCent = (100 / wordLen) * wordPos[0];
    locationIndex = wordPos[0];
    locationNumber.value = wordPerCent.toFixed(2);
  }

  if (!window.speechSynthesis.paused) {
    textArea.value = formattedText.substring(0, wordPos[0] + wordPos[1]);
    textArea.scrollTop = textArea.scrollHeight;
  }
};

speech.addEventListener('end', function () {
  StopSpeech();
});

function GetWordPos(str: string, pos: number) {
  str = String(str);
  pos = Number(pos) >>> 0;

  const result: number[] = [];
  const left = str.slice(0, pos + 1).search(/\S+$/);
  const right = str.slice(pos).search(/\s/);
  result.push(left);
  if (right < 0) {
    return str.slice(left);
  }
  result.push(right);
  return result;
}

function FilterGenre(filter: number | HTMLElement) {
  let genreFilter = '';
  if (typeof filter === 'object') genreFilter = filter.innerHTML;
  for (let i = 0; i < sources.length; i++) {
    if (filter === -1) {
      sources[i].style.display = '';
      continue;
    }
    if (genreFilter != sources[i].dataset.genre) {
      sources[i].style.display = 'none';
      if (currentSourceDiv === sources[i]) currentSourceDiv = null;
    } else sources[i].style.display = '';
  }
  for (let i = 0; i < genres.length; i++) {
    if (filter === -1) {
      genres[i].style.backgroundColor = 'var(--white)';
      genres[i].style.color = '';
      continue;
    }
    if (filter === genres[i]) {
      genres[i].style.backgroundColor = 'var(--foregroundLight)';
      genres[i].style.color = 'var(--background)';
    } else {
      genres[i].style.backgroundColor = 'var(--white)';
      genres[i].style.color = '';
    }
  }
}

function FilterAuthor(filter: number | HTMLElement) {
  let authorFilter = '';
  if (typeof filter === 'object') authorFilter = filter.innerHTML;
  for (let i = 0; i < sources.length; i++) {
    if (filter === -1) {
      sources[i].style.display = '';
      continue;
    }
    if (authorFilter != sources[i].dataset.author) {
      sources[i].style.display = 'none';
      if (currentSourceDiv === sources[i]) currentSourceDiv = null;
    } else sources[i].style.display = '';
  }
  for (let i = 0; i < authors.length; i++) {
    if (filter === -1) {
      authors[i].style.backgroundColor = 'var(--white)';
      authors[i].style.color = '';
      continue;
    }
    if (filter === authors[i]) {
      authors[i].style.backgroundColor = 'var(--foregroundLight)';
      authors[i].style.color = 'var(--background)';
    } else {
      authors[i].style.backgroundColor = 'var(--white)';
      authors[i].style.color = '';
    }
  }
}

function MakeCurrent(source: HTMLElement) {
  currentSourceDiv = source;
  for (let i = 0; i < sources.length; i++) {
    if (source === sources[i]) {
      sources[i].style.backgroundColor = 'var(--foregroundLight)';
      sources[i].style.color = 'var(--background)';
    } else {
      sources[i].style.backgroundColor = 'var(--white)';
      sources[i].style.color = '';
    }
  }
}

function LoadNewText(source: string) {
  ToggleMenu(views, viewBs, -1);
  LoadText(source, 'GETTEXT');
}

function LoadText(source: string, trigger: string) {
  currentSource = source;
  console.log(currentSource, trigger);
  const csrfToken: string = <string>$('#csrf_token').val();
  console.log(csrfToken);
  // const path = '{{ path(' + trigger +') }}';

  $.ajax({
    method: 'POST',
    url: trigger,
    headers: {},
    data: {
      currentSource,
    },
    beforeSend: function(xhr) {
        xhr.setRequestHeader('X-CSRF-TOKEN', csrfToken);
    },
    success: function (result) {
      console.log(result);
      if (trigger === 'GETTEXT') {
        const volumes = result[0];
        const chapters = result[1];

        if (chapters.length != volumes.length) return;
        chapterSelect.options.length = 0;
        chapterSelect.dataset.total = (chapters.length - 1).toString();
        for (let i = 0; i < chapters.length; i++) {
          const opt = document.createElement('option');
          opt.dataset.number = i.toString();
          opt.dataset.volume = volumes[i];
          opt.dataset.chapter = chapters[i];
          opt.innerHTML = volumes[i] + '-' + chapters[i];
          chapterSelect.appendChild(opt);
        }
      }
    },
    error(result) {
      console.log(result);
    },
  });
}

function LoadChapter(trigger: string) {
  if (
    currentSource === null ||
    currentSource === '' ||
    currentSource === undefined
  ) {
    MessageBox('Please select a text to load.');
    return;
  }
  const index = chapterSelect.options[chapterSelect.selectedIndex].dataset.number;
  const total = chapterSelect.dataset.total;
  const csrfToken: string = <string>$('#csrf_token').val();
  console.log(csrfToken);
  // const path = '{{ path(' + trigger +') }}';

  $.ajax({
    method: 'POST',
    url: trigger,
    headers: {},
    data: {
      currentSource,
      index,
      total
    },
    beforeSend: function(xhr) {
        xhr.setRequestHeader('X-CSRF-TOKEN', csrfToken);
    },
    success: function (result) {
      // console.log(result);
      formattedText = result[0][0];
      savedText = result[0][1];
      textArea.value = formattedText;
      hiddenText.innerText = savedText;
      chapterSelect.selectedIndex = result[1];
      if (autoplay) {
        PlayPauseResumeSpeech();
      }
    },
    // error: function(result){
    //   console.log(result);
    // }
  });
}

function TogglePanel(panel: HTMLElement) {
  if (panel.style.display == 'none') panel.style.display = '';
  else panel.style.display = 'none';
}

function MessageBox(message: string) {
  messageBox.innerHTML = message;
  if (messageBoxHolder.style.display === 'none') TogglePanel(messageBoxHolder);
  AnimatePop(messageBox);
  if (timeOut != null) clearTimeout(timeOut);
  timeOut = setTimeout(AutoOff, 2500);
}

function AnimatePop(panel: HTMLElement) {
  panel.animate(
    [
      { transform: 'scale(110%, 110%)' },
      { transform: 'scale(109%, 109%)' },
      { transform: 'scale(108%, 108%)' },
      { transform: 'scale(107%, 107%)' },
      { transform: 'scale(106%, 106%)' },
      { transform: 'scale(105%, 105%)' },
      { transform: 'scale(104%, 104%)' },
      { transform: 'scale(103%, 103%)' },
      { transform: 'scale(102%, 102%)' },
      { transform: 'scale(101%, 101%)' },
      { transform: 'scale(100%, 100%)' },
    ],
    {
      duration: 100,
    }
  );
}

function AutoOff() {
  messageBoxHolder.style.display = 'none';
}
