"use strict";

function CalculateVh()
{
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', vh + 'px');
}

window.addEventListener('DOMContentLoaded', CalculateVh);
window.addEventListener('resize', CalculateVh);
window.addEventListener('orientationchange', CalculateVh);

const topControl = document.getElementById("topControl");
const controls = document.getElementById("controls");
const botControl = document.getElementById("botControl");
const textDiv = document.getElementById("textDiv");

const messageBoxHolder = document.getElementById("messageBoxHolder");
messageBoxHolder.onclick = function() { TogglePanel(messageBoxHolder); };
const messageBox = document.getElementById("messageBox");

const libraryButton = document.getElementById("libraryButton");
libraryButton.onclick = function(){ ToggleMenu(views, viewBs, 0); };
const libraryMenu = document.getElementById("libraryMenu");
libraryMenu.style.display = "none";

const optionsButton = document.getElementById("optionsButton");
optionsButton.onclick = function(){ ToggleMenu(views, viewBs, 1); };
const settingsMenu = document.getElementById("settingsMenu");
settingsMenu.style.display = "none";

const views = [libraryMenu, settingsMenu];
const viewBs = [libraryButton, optionsButton];

const playButton = document.getElementById("playButton");
playButton.onclick = function(){ PlayPauseResumeSpeech(); };
const iPlay: HTMLImageElement = <HTMLImageElement>document.getElementById("iPlay");
const stopButton = document.getElementById("stopButton");
stopButton.onclick = function(){ StopSpeech(); };
const locationNumber: HTMLInputElement = <HTMLInputElement>document.getElementById("locationNumber");
locationNumber.onchange = function(){ locationIndex = parseInt(locationNumber.value); };

const chapterSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById("chapterSelect");
const loadSelected: HTMLInputElement = <HTMLInputElement>document.getElementById("loadSelected");
loadSelected.onclick = function(){ 
  StopSpeech();
  textArea.scrollTop = 0; 
  LoadChapter("GETCHAPTER"); 
};
const lastChapter = document.getElementById("lastChapter");
lastChapter.onclick = function(){ 
  StopSpeech();
  textArea.scrollTop = 0; 
  LoadChapter("LASTCHAPTER"); };
const nextChapter = document.getElementById("nextChapter");
nextChapter.onclick = function(){ 
  StopSpeech()
  textArea.scrollTop = 0; 
  LoadChapter("NEXTCHAPTER"); 
};

const autoplayCheckbox = document.getElementById("autoplayCheckbox");
autoplayCheckbox.onchange = function(){ autoplay = !autoplay; if(autoplay) MessageBox("Autoplay on."); else MessageBox("Autoplay off."); };

const clearGenre = document.getElementById("clearGenre");
clearGenre.onclick = function(){ FilterGenre(-1); };
const clearAuthor = document.getElementById("clearAuthor");
clearAuthor.onclick = function(){ FilterAuthor(-1); };
let currentSourceDiv = document.getElementById("currentSourceDiv");
let sources: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName("source") as HTMLCollectionOf<HTMLElement>;
let genres: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName("genre") as HTMLCollectionOf<HTMLElement>;
let authors: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName("author") as HTMLCollectionOf<HTMLElement>;

const toggleLibrary = document.getElementById("toggleLibrary");
toggleLibrary.onclick = function(){ ToggleMenu(databasePanels, databasePanelBs, 0); };
const toggleGenre = document.getElementById("toggleGenre");
toggleGenre.onclick = function(){ ToggleMenu(databasePanels, databasePanelBs, 1); };
const toggleAuthor = document.getElementById("toggleAuthor");
toggleAuthor.onclick = function(){ ToggleMenu(databasePanels, databasePanelBs, 2); };

const selectDocumentPanel = document.getElementById("selectDocumentPanel");
const genreFilterPanel = document.getElementById("genreFilterPanel");
const genreAuthorPanel = document.getElementById("genreAuthorPanel");
const databasePanels = [selectDocumentPanel, genreFilterPanel, genreAuthorPanel];
const databasePanelBs = [toggleLibrary, toggleGenre, toggleAuthor];
genreFilterPanel.style.display = "none";
genreAuthorPanel.style.display = "none";

const loadFile = document.getElementById("loadFile");
loadFile.onclick = function(){ if(currentSourceDiv === null) { MessageBox("Please select a file."); return; } LoadNewText(currentSourceDiv.dataset.value); };

const volumeSlider: HTMLInputElement = <HTMLInputElement>document.getElementById("volumeSlider");
volumeSlider.onchange = function(){ ChangeVolume(volumeSlider.value); };

const showVolume: HTMLInputElement = <HTMLInputElement>document.getElementById("showVolume");
showVolume.onchange = function(){ ChangeVolume(showVolume.value); };

const rateSlider: HTMLInputElement = <HTMLInputElement>document.getElementById("rateSlider");
rateSlider.onchange = function(){ ChangeRate(rateSlider.value); };

const showRate: HTMLInputElement = <HTMLInputElement>document.getElementById("showRate");
showRate.onchange = function(){ ChangeRate(showRate.value); };

const voiceSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById("voiceSelect");
voiceSelect.onchange = function(){ ChangeVoice(); };

const fontSize: HTMLInputElement = <HTMLInputElement>document.getElementById("fontSize");
fontSize.onchange = function(){ textArea.style.fontSize  = fontSize.value + "px"; };

const fontStyle: HTMLInputElement = <HTMLInputElement>document.getElementById("fontStyle");
fontStyle.onchange = function(){ textArea.style.fontFamily  = fontStyle.value; };

const textArea: HTMLInputElement = <HTMLInputElement>document.getElementById("textArea");
textArea.onkeyup = function(){ FindTextEndNumber(); NewText(); }
textArea.onblur = function(){ FindTextEndNumber(); NewText(); }
textArea.ondblclick = function(){ ChangeLocationIndex(GetCaretPosition(textArea)); }

const hiddenText = document.getElementById("hiddenText");

const speech = new SpeechSynthesisUtterance();

let voices = [];
let playing = false;
let locationIndex: number = 0;
let savedText = '';
let formattedText = '';
let offset = 0;
let currentSource = "";
let autoplay = false;

let timeOut = undefined;
let toggleView = false;

ToggleMenu(databasePanels, databasePanelBs, 0);

const makecurrents: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName("makecurrents") as HTMLCollectionOf<HTMLElement>;
for(let i = 0; i < makecurrents.length; i++) { makecurrents[i].onclick = function() { MakeCurrent(makecurrents[i]) } }

const filtergenres: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName("filtergenres") as HTMLCollectionOf<HTMLElement>;
for(let i = 0; i < filtergenres.length; i++) { filtergenres[i].onclick = function() { FilterGenre(filtergenres[i]) } }

const filterauthors: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName("filterauthors") as HTMLCollectionOf<HTMLElement>;
for(let i = 0; i < filterauthors.length; i++) { filterauthors[i].onclick = function() { FilterAuthor(filterauthors[i]) } }

function ToggleView()
{
  toggleView = !toggleView;
  if(toggleView)
  {
    topControl.style.display = "none";
    controls.style.display = "none";
    botControl.style.display = "none";

    textDiv.style.height = "calc(var(--vh) * 92)";
    textDiv.style.maxHeight = "calc(var(--vh) * 92)";

    libraryMenu.style.height = "calc(var(--vh) * 92)";
    libraryMenu.style.maxHeight = "calc(var(--vh) * 92)";

    settingsMenu.style.height = "calc(var(--vh) * 92)";
    settingsMenu.style.maxHeight = "calc(var(--vh) * 92)";
  }
  else
  {
    topControl.style.display = "";
    controls.style.display = "";
    botControl.style.display = "";

    textDiv.style.height = "calc(var(--vh) * 77)";
    textDiv.style.maxHeight = "calc(var(--vh) * 77)";

    libraryMenu.style.height = "calc(var(--vh) * 77)";
    libraryMenu.style.maxHeight = "calc(var(--vh) * 77)";

    settingsMenu.style.height = "calc(var(--vh) * 77)";
    settingsMenu.style.maxHeight = "calc(var(--vh) * 77)";
  }
}

function ToggleMenu(array, buttons, number)
{
  for(let i = 0; i < array.length; i++)
  {
    if(i === number)
    {
      if(array === databasePanels)
      {
        buttons[i].style.backgroundColor = "var(--foregroundLight)";
        buttons[i].style.color = "var(--grey)";
      }
      else if(array === views)
      {
        buttons[i].style.backgroundColor = "var(--grey)";
      }
      if(array[i].style.display === "" && array !== databasePanels)
      {
        buttons[i].style.backgroundColor = "var(--background)";
        array[i].style.display = "none";
      }
      else
      {
        array[i].style.display = "";
      }
    }
    else
    {
      if(array === databasePanels)
      {
        buttons[i].style.backgroundColor = "var(--grey)";
        buttons[i].style.color = "var(--foregroundLight)";
      }
      else if(array === views)
      {
        buttons[i].style.backgroundColor = "var(--background)";
      }
      array[i].style.display = "none";
    }
  }
}

function PlayPauseResumeSpeech()
{
  if(!playing)
  {
    speech.lang = "en";

    if(hiddenText.innerText === null || hiddenText.innerText === "" || hiddenText.innerText === undefined)
    {
      MessageBox("Please provide text to play.");
      return;
    }

    speech.text = hiddenText.innerText.substring(locationIndex);
    textArea.disabled = true;

    window.speechSynthesis.speak(speech);
    iPlay.src = "/play.svg";
    playing = true;
  }
  else if(playing && !window.speechSynthesis.paused)
  {
    window.speechSynthesis.pause();
    textArea.value = formattedText;
    textArea.disabled = false;
    iPlay.src = "/play.svg";
  }
  else if(playing && window.speechSynthesis.paused)
  {
    speech.text = hiddenText.innerText.substring(locationIndex);
    window.speechSynthesis.resume();
    textArea.disabled = true;
    iPlay.src = "/pause.svg";
  }
}

function ChangeLocationIndex(newValue)
{
  locationIndex = newValue;
  locationNumber.value = locationIndex.toString();
}

function GetCaretPosition(ctrl)
{
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
  
  if(ctrl.selectionStart || ctrl.selectionStart == '0')
  {
    return ctrl.selectionEnd;
  }
  else
  {
    return 0;
  }
}

function FindTextEndNumber()
{
  locationNumber.max = hiddenText.innerText.length.toString();
}

function NewText()
{
  if(!playing)
  {
    savedText = textArea.value;
    formattedText = textArea.value;
    hiddenText.innerText = savedText;
    locationIndex = 0;
    locationNumber.value = locationIndex.toString();
  }
}

function StopSpeech()
{
  playing = false;
  window.speechSynthesis.cancel();
  textArea.value = formattedText.toString();
  locationIndex = 0;
  locationNumber.value = locationIndex.toString();
  textArea.disabled = false;
  iPlay.src = "/play.svg";
}

function ChangeVolume(volume)
{
  speech.volume = volume;
  volumeSlider.value = volume;
  showVolume.value = volume;
}

function ChangeRate(rate)
{
  speech.rate = rate;
  rateSlider.value = rate;
  showRate.value = rate;
}

function ChangeVoice()
{
  speech.voice = voices[voiceSelect.options.selectedIndex];
}

window.speechSynthesis.onvoiceschanged = () => {

  voices.length = 0;
  voices = speechSynthesis.getVoices();
  speech.voice = voices[0];

  if(voices.length == 0) return;

  for(let i = 0; i < voices.length; i++)
  {
    let newOption = document.createElement("option");
    newOption.innerHTML = voices[i].name;
    newOption.id = i.toString();
    voiceSelect.appendChild(newOption);
  }
};

window.onbeforeunload = function () {
  StopSpeech();
}

speech.onboundary = function(event)
{
  let wordPos = GetWordPos(hiddenText.innerText, event.charIndex);
  if(isFinite(wordPos[0]))
  {
    let wordLen = formattedText.length;
    let wordPerCent = ( 100 / wordLen ) * wordPos[0];
    locationIndex = wordPos[0];
    locationNumber.value = wordPerCent.toFixed(2);
  }

  if(!window.speechSynthesis.paused)
  {
    textArea.value = formattedText.substring(0, (wordPos[0] + wordPos[1]));
    textArea.scrollTop = textArea.scrollHeight;
  }
};

speech.addEventListener('end', function(event)
{
  StopSpeech();
});

function GetWordPos(str, pos)
{
  str = String(str);
  pos = Number(pos) >>> 0;

  let result = [];
  let left = str.slice(0, pos + 1).search(/\S+$/);
  let right = str.slice(pos).search(/\s/);
  result.push(left);
  if(right < 0)
  {
    return str.slice(left);
  }
  result.push(right);
  return result;
}

function FilterGenre(filter)
{
  let genreFilter = "";
  if(filter !== -1) genreFilter = filter.innerHTML;
  for(let i = 0; i < sources.length; i++)
  {
    if(filter === -1) { sources[i].style.display = ""; continue; }
    if(genreFilter != sources[i].dataset.genre)
    {
      sources[i].style.display = "none";
      if(currentSourceDiv === sources[i]) currentSourceDiv = null;
    }
    else sources[i].style.display = "";
  }
  for(let i = 0; i < genres.length; i++)
  {
    if(filter === -1)
    { 
      genres[i].style.backgroundColor = "var(--white)";
      genres[i].style.color = "";
      continue;
    }
    if(filter === genres[i])
    {
      genres[i].style.backgroundColor = "var(--foregroundLight)";
      genres[i].style.color = "var(--background)";
    }
    else
    {
      genres[i].style.backgroundColor = "var(--white)";
      genres[i].style.color = "";
    }
  }
}

function FilterAuthor(filter)
{
  let authorFilter = "";
  if(filter !== -1) authorFilter = filter.innerHTML;
  for(let i = 0; i < sources.length; i++)
  {
    if(filter === -1) { sources[i].style.display = ""; continue; }
    if(authorFilter != sources[i].dataset.author)
    {
      sources[i].style.display = "none";
      if(currentSourceDiv === sources[i]) currentSourceDiv = null;
    }
    else sources[i].style.display = "";
  }
  for(let i = 0; i < authors.length; i++)
  {
    if(filter === -1)
    { 
      authors[i].style.backgroundColor = "var(--white)";
      authors[i].style.color = "";
      continue;
    }
    if(filter === authors[i])
    {
      authors[i].style.backgroundColor = "var(--foregroundLight)";
      authors[i].style.color = "var(--background)";
    }
    else
    {
      authors[i].style.backgroundColor = "var(--white)";
      authors[i].style.color = "";
    }
  }
}

function MakeCurrent(source)
{
  currentSourceDiv = source;
  for(let i = 0; i < sources.length; i++)
  {
    if(source === sources[i])
    {
      sources[i].style.backgroundColor = "var(--foregroundLight)";
      sources[i].style.color = "var(--background)";
    }
    else
    {
      sources[i].style.backgroundColor = "var(--white)";
      sources[i].style.color = "";
    }
  }
}

function LoadNewText(source)
{
  ToggleMenu(views, viewBs, -1);
  LoadText(source, "GETTEXT");
}

function LoadText(source, trigger)
{
  currentSource = source;
  $.ajax(
  {
    method: "POST",
    url: trigger,
    headers:
    {

    },
    data:
    {
      currentSource
    },
    success:function(result)
    {
      if(trigger === "GETTEXT")
      {
        let volumes = result[0];
        let chapters = result[1];

        if(chapters.length != volumes.length) return;
        chapterSelect.options.length = 0;
        chapterSelect.dataset.total = (chapters.length - 1).toString();
        for(let i = 0; i < chapters.length; i++)
        {
          let opt = document.createElement('option');
          opt.dataset.number = i.toString();
          opt.dataset.volume = volumes[i];
          opt.dataset.chapter = chapters[i];
          opt.innerHTML = volumes[i] + '-' + chapters[i];
          chapterSelect.appendChild(opt);
        }
      }
    },
    error:function(result)
    {

    }
  });
}

function LoadChapter(trigger)
{
  if(currentSource === null || currentSource === "" || currentSource === undefined)
  {
    MessageBox("Please select a text to load.");
    return;
  }
  let data = [currentSource, 
    chapterSelect.options[chapterSelect.selectedIndex].dataset.number,
    chapterSelect.dataset.total
  ];
  $.ajax(
  {
    method: "POST",
    url: trigger,
    headers:
    {

    },
    data:
    {
      data:data
    },
    success:function(result)
    {
      formattedText = result[0][0];
      savedText = result[0][1];
      textArea.value = formattedText;
      hiddenText.innerText = savedText;
      chapterSelect.selectedIndex = result[1];
      if(autoplay)
      {
        PlayPauseResumeSpeech();
      }
    },
    error:function(result)
    {

    }
  });
}

function TogglePanel(panel)
{
  if(panel.style.display == "none") panel.style.display = "";
  else panel.style.display = "none";
}

function MessageBox(message)
{
  messageBox.innerHTML = message;
  if(messageBoxHolder.style.display === "none") TogglePanel(messageBoxHolder);
  AnimatePop(messageBox);
  if(timeOut != null) clearTimeout(timeOut);
  timeOut = setTimeout(AutoOff, 2500);
}

function AnimatePop(panel)
{
  panel.animate([
    { transform: 'scale(110%, 110%)'},
    { transform: 'scale(109%, 109%)'},
    { transform: 'scale(108%, 108%)'},
    { transform: 'scale(107%, 107%)'},
    { transform: 'scale(106%, 106%)'},
    { transform: 'scale(105%, 105%)'},
    { transform: 'scale(104%, 104%)'},
    { transform: 'scale(103%, 103%)'},
    { transform: 'scale(102%, 102%)'},
    { transform: 'scale(101%, 101%)'},
    { transform: 'scale(100%, 100%)'}],
    {
      duration: 100,
    }
  );
}

function AutoOff()
{
  messageBoxHolder.style.display = "none";
}