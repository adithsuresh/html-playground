function debounce(func, wait = 250, immediate = false) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

function toggle(el, index) {
  var cdEd = document.querySelectorAll(".con");
  if (document.querySelectorAll(".active").length !== 1) {
    el.classList.contains("active") ? el.classList.remove("active") : el.classList.add("active");
    cdEd[index].style.display == "none" ? (cdEd[index].style.display = "flex") : (cdEd[index].style.display = "none");
    triggerResize();
  } else {
    !el.classList.contains("active") ? el.classList.add("active") : null;
    cdEd[index].style.display = "flex";
    triggerResize();
  }
}

function repl() {
  document.querySelectorAll(".bigscreen")[0].style.display = "none";
  document.querySelectorAll(".smallscreen")[0].style.display = "flex";
}

function triggerResize() {
  var resizeEvent = window.document.createEvent("UIEvents");
  resizeEvent.initUIEvent("resize", true, false, window, 0);
  window.dispatchEvent(resizeEvent);
}
var codeEditor = document.querySelectorAll(".editor");
window.addEventListener("DOMContentLoaded", (event) => {
  document.querySelectorAll(".con")[1].style.display = "none";
  document.querySelectorAll(".con")[2].style.display = "none";
  // window.innerWidth <= 768 ? navToggle() : null;

  codeEditor.forEach.call(codeEditor, function (editor, index) {
    makeEditor(editor, ["html", "css", "javascript"][index]);
  });
  triggerResize();
  updateiFrame();
});

window.addEventListener("resize", (event) => {
  window.innerWidth > 768 ? navToggle(true) : navToggle(false);
  updateiFrame();
});

var ariahidden = document.querySelectorAll(".ariahidden");

for (let i = 0; i < ariahidden.length; i++) {
  var fragment = document.createDocumentFragment();
  for (let j = 0; j < 20; j++) {
    ariahidden[i].innerHTML += "<i aria-hidden=true></i>";
  }
  while (ariahidden[i].firstChild) {
    fragment.appendChild(ariahidden[i].firstChild);
  }

  ariahidden[i].parentNode.replaceChild(fragment, ariahidden[i]);
}

let nav_display = false;

function navToggle(val = null) {
  if (val !== null) {
    nav_display = val;
  }
  var navitems = document.querySelectorAll(".navitem");
  for (let i = 0; i < navitems.length; i++) {
    if (nav_display || val) {
      navitems[i].style.display = "block";
    } else {
      navitems[i].style.display = "none";
      nav_display = false;
    }
  }
  nav_display = !nav_display;

  return false;
}

let editorTheme, themeBg;
const changeTheme = () => {
  // var darkThemes = [
  // "ambiance",
  // "dracula",
  // "terminal",
  // "twilight",
  // "cobalt",
  // "gruvbox",
  // "merbivore_soft",
  // "mono_industrial",
  // "monokai",
  // "tomorrow_night_bright"
  // ];

  var themes = ["monokai", "crimson_editor"];
  editorTheme == "crimson_editor"
    ? ((editorTheme = "monokai"), (themeBg = "#272822"))
    : ((editorTheme = "crimson_editor"), (themeBg = "#FFFFFF"));
  // var randomDarkTheme =
  // darkThemes[Math.floor(Math.random() * darkThemes.length)];
  // document.querySelector("#chTheme").innerHTML = randomDarkTheme;
  for (var t = 0; t < aceEditor.length; t++) {
    aceEditor[t].setTheme(`ace/theme/${editorTheme}`);
    document.querySelectorAll(".editor")[t].style.background = themeBg;
  }
};
var aceEditor = [],
  x = 0;
const makeEditor = (editor, editorMode) => {
  let editorContent = editor.innerHTML;
  aceEditor[x] = ace.edit(editor);
  aceEditor[x].setFontSize("16px");
  aceEditor[x].setTheme("ace/theme/monokai");
  aceEditor[x].session.setMode({
    path: `ace/mode/${editorMode}`,
  });
  aceEditor[x].setShowPrintMargin(false);
  aceEditor[x].session.setUseWrapMode(true);
  aceEditor[x].session.setValue(editorContent);
  for (let y = 0; y < aceEditor.length; y++) {
    aceEditor[y].session.on("change", function () {
      editorOnChange(aceEditor[y], y);
    });
  }
  x++;
};

const editorOnChange = debounce(function (ed, index) {
  updateiFrame(index);
});

const updateiFrame = debounce(function (index) {
  // aceEditor[index].focus();
  // aceEditor[index].navigateFileEnd();
  let htmlTextArea, cssTextArea, jsTextArea, iframeResult;
  let bigscreen = document.querySelector(".bigscreen");
  bigscreen.style.display !== "none" ? (htmlTextArea = aceEditor[0].getSession().getValue()) : null;
  bigscreen.style.display !== "none"
    ? (cssTextArea = aceEditor[1].getSession().getValue())
    : (cssTextArea = aceEditor[4].getSession().getValue());
  bigscreen.style.display !== "none"
    ? (jsTextArea = aceEditor[2].getSession().getValue())
    : (jsTextArea = aceEditor[5].getSession().getValue());
  bigscreen.style.display !== "none"
    ? (iframeResult = document.querySelectorAll(".fi-2-column-4")[0])
    : (iframeResult = document.querySelectorAll(".fi-2-column-4")[1]);
  const iframeDoc = iframeResult.contentDocument || iframeResult.contentWindow.document;
  const iframeHead = iframeDoc.head;
  const iframeBody = iframeDoc.body;

  iframeHead.innerHTML = "\n<style>\n" + cssTextArea + "\n</style>\n";
  iframeBody.innerHTML = "\n" + htmlTextArea + "\n";
  const script = iframeDoc.createElement("script");
  script.innerHTML = "\n" + jsTextArea + "\n";
  iframeBody.appendChild(script);
});
