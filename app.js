// main app code by aryaan
// my first project 

var myFolders = ["AI Prompts", "Code Snippets", "Research", "Personal Notes"];

var allMyClips = [
  {
    id: 1,
    title: "ChatGPT Rewrite Prompt",
    content: "Rewrite the following text in a clearer, more concise way while preserving the original meaning:",
    folder: "AI Prompts",
    isPinned: false,
    date: Date.now() - 86400000 // one day
  },
  {
    id: 2,
    title: "React useEffect Template",
    content: "useEffect(() => {\n  // do something\n  return () => {\n    // cleanup\n  };\n}, []);",
    folder: "Code Snippets",
    isPinned: false,
    date: Date.now() - 172800000 // two days
  },
  {
    id: 3,
    title: "Research Paper Structure",
    content: "Abstract → Introduction → Literature Review → Methodology → Results → Discussion → Conclusion",
    folder: "Research",
    isPinned: false,
    date: Date.now() - 259200000 // 3 days
  }
];

var theDeletedOnes = [];

var theFolderImIn = "All";
var whatImSearching = "";
var howToSort = "Newest";
var amIEditing = false; // true if editing
var myEditId = null;
var myMoveMenuOpen = null;
var nextClipId = 4;

// load from storage
var savedClips = localStorage.getItem("clipnest-clips");
var savedFolders = localStorage.getItem("clipnest-folders");
var savedSort = localStorage.getItem("clipnest-sort");
var savedDeleted = localStorage.getItem("clipnest-deleted");

if (savedClips != null) {
  allMyClips = JSON.parse(savedClips);
}
if (savedFolders != null) {
  myFolders = JSON.parse(savedFolders);
}
if (savedSort != null) {
  howToSort = savedSort;
}
if (savedDeleted != null) {
  theDeletedOnes = JSON.parse(savedDeleted);
}

console.log("clips loaded: " + allMyClips.length);

function timeAgo(timestamp) {
  var diff = Date.now() - timestamp; // math

  if (diff < 60000) {
    return "just now";
  } else if (diff < 3600000) {
    var min = diff / 60000;
    return Math.floor(min) + "m ago";
  } else if (diff < 86400000) {
    var hr = diff / 3600000;
    return Math.floor(hr) + "h ago";
  } else {
    var days = diff / 86400000;
    return Math.floor(days) + "d ago";
  }
}

function renderSidebar() {
  document.getElementById("count-All").innerHTML = allMyClips.length;
  document.getElementById("count-Trash").innerHTML = theDeletedOnes.length;
  
  var myFolderList = document.getElementById("folderList");
  myFolderList.innerHTML = ""; // clear

  for (var i = 0; i < myFolders.length; i++) {
    var fn = myFolders[i];
    
    // count how many clips in folder
    var count = 0;
    for (var j = 0; j < allMyClips.length; j++) {
      if (allMyClips[j].folder == fn) {
        count = count + 1;
      }
    }

    var div = document.createElement("div");
    if (theFolderImIn == fn) {
      div.className = "sidebar-folder active";
    } else {
      div.className = "sidebar-folder";
    }
    
    div.innerHTML = "<span>" + fn + "</span> <span class='folder-count'>(" + count + ")</span>";
    div.setAttribute("onclick", "changeFolder('" + fn + "')");
    myFolderList.appendChild(div);
  }

  // update all clips class
  if (theFolderImIn == "All") {
    document.getElementById("count-All").parentElement.className = "sidebar-folder active";
  } else {
    document.getElementById("count-All").parentElement.className = "sidebar-folder";
  }

  // update trash class
  if (theFolderImIn == "Trash") {
    document.getElementById("count-Trash").parentElement.className = "sidebar-folder active";
  } else {
    document.getElementById("count-Trash").parentElement.className = "sidebar-folder";
  }
}

function renderClips() {
  var grid = document.getElementById("clipsGrid");
  var emptyState = document.getElementById("emptyState");

  var sourceArray;
  if (theFolderImIn == "Trash") {
    sourceArray = theDeletedOnes;
  } else {
    sourceArray = allMyClips;
  }

  var myFilteredArray = [];

  for (var i = 0; i < sourceArray.length; i++) {
    var clip = sourceArray[i];

    var fMatch = false;
    if (theFolderImIn == "All" || theFolderImIn == "Trash") {
      fMatch = true;
    } else if (clip.folder == theFolderImIn) {
      fMatch = true;
    }

    var sMatch = false;
    var t1 = clip.title.toLowerCase();
    var t2 = clip.content.toLowerCase();
    if (t1.includes(whatImSearching) || t2.includes(whatImSearching)) {
      sMatch = true;
    }

    if (fMatch == true && sMatch == true) {
      myFilteredArray.push(clip);
    }
  }

  // sorting stuff with bubble sort!
  for (var i = 0; i < myFilteredArray.length; i++) {
    for (var j = 0; j < myFilteredArray.length - 1; j++) {
      var a = myFilteredArray[j];
      var b = myFilteredArray[j + 1];
      var swap = false;

      if (howToSort == "Newest") {
        if (b.date > a.date) swap = true;
      } else if (howToSort == "Oldest") {
        if (a.date > b.date) swap = true;
      } else if (howToSort == "A-Z") {
        if (a.title.toLowerCase() > b.title.toLowerCase()) swap = true;
      }

      if (swap == true) {
        var temp = myFilteredArray[j];
        myFilteredArray[j] = myFilteredArray[j + 1];
        myFilteredArray[j + 1] = temp;
      }
    }
  }

  // do pins
  var pins = [];
  var unpins = [];
  for (var i = 0; i < myFilteredArray.length; i++) {
    if (myFilteredArray[i].isPinned == true) {
      pins.push(myFilteredArray[i]);
    } else {
      unpins.push(myFilteredArray[i]);
    }
  }
  
  // combine
  myFilteredArray = [];
  for (var i = 0; i < pins.length; i++) myFilteredArray.push(pins[i]);
  for (var i = 0; i < unpins.length; i++) myFilteredArray.push(unpins[i]);

  document.getElementById("sectionTitle").innerHTML = theFolderImIn;
  document.getElementById("clipCountLabel").innerHTML = myFilteredArray.length + " clips";

  if (myFilteredArray.length == 0) {
    grid.innerHTML = "";
    grid.classList.add("hidden");
    emptyState.classList.remove("hidden");

    if (whatImSearching != "") {
      document.getElementById("emptyMsg").innerHTML = "No clips match your search";
      document.getElementById("emptySub").innerHTML = "Try a different keyword";
    } else {
      document.getElementById("emptyMsg").innerHTML = "No clips here yet";
      document.getElementById("emptySub").innerHTML = "Click + New Clip to get started";
    }
    return;
  }

  grid.classList.remove("hidden");
  emptyState.classList.add("hidden");
  grid.innerHTML = ""; // clear out old clips

  // draw the cards using strings!
  for (var i = 0; i < myFilteredArray.length; i++) {
    var c = myFilteredArray[i];
    var div = document.createElement("div");
    div.className = "clip-card";
    
    var isT = false;
    if (theFolderImIn == "Trash") isT = true;
    
    var myhtml = "<div class='clip-card-top'><div class='clip-title'>";
    if (c.isPinned == true) {
      myhtml = myhtml + "<span style='color:orange;'>PINNED: </span>";
    }
    myhtml = myhtml + c.title + "</div><span class='clip-tag'>" + c.folder + "</span></div>";
    myhtml = myhtml + "<div class='clip-preview'>" + c.content + "</div>";
    myhtml = myhtml + "<div class='clip-footer'><span class='clip-time'>" + timeAgo(c.date) + "</span><div class='clip-actions'>";
    
    if (isT == true) {
      myhtml = myhtml + "<button class='action-btn' onclick='restoreClip(\"" + c.id + "\")'>Restore</button>";
      myhtml = myhtml + "<button class='action-btn danger' onclick='permanentlyDeleteClip(\"" + c.id + "\")'>Delete</button>";
    } else {
      myhtml = myhtml + "<button class='action-btn' onclick='togglePin(\"" + c.id + "\")'>Pin</button>";
      myhtml = myhtml + "<button class='action-btn' onclick='openMoveMenu(\"" + c.id + "\", this)'>Move</button>";
      myhtml = myhtml + "<button class='action-btn' onclick='editClip(\"" + c.id + "\")'>Edit</button>";
      myhtml = myhtml + "<button class='action-btn' id='copybtn-" + c.id + "' onclick='copyClip(\"" + c.id + "\")'>Copy</button>";
      myhtml = myhtml + "<button class='action-btn danger' onclick='deleteClip(\"" + c.id + "\")'>Delete</button>";
    }
    
    myhtml = myhtml + "</div></div>";
    div.innerHTML = myhtml;
    grid.appendChild(div);
  }
}

function changeSort() {
  howToSort = document.getElementById("sortSelect").value;
  localStorage.setItem("clipnest-sort", howToSort);
  renderClips();
}

function changeFolder(n) {
  theFolderImIn = n;
  renderSidebar();
  renderClips();
}

function searchClips() {
  whatImSearching = document.getElementById("searchInput").value.toLowerCase();
  renderClips();
}

function openNewModal() {
  amIEditing = false;
  myEditId = null;

  document.getElementById("modalTitle").innerHTML = "New Clip";
  document.getElementById("saveBtn").innerHTML = "Save Clip";
  document.getElementById("clipTitle").value = "";
  document.getElementById("clipContent").value = "";

  updateFolderDropdown();
  updateCounters();
  document.getElementById("modalOverlay").classList.remove("hidden");
}

function editClip(myid) {
  openNewModal();
  amIEditing = true;
  myEditId = myid;

  var theclip = null;
  for (var i = 0; i < allMyClips.length; i++) {
    if (allMyClips[i].id == myEditId) {
      theclip = allMyClips[i];
    }
  }
  if (theclip != null) {
    document.getElementById("clipTitle").value = theclip.title;
    document.getElementById("clipContent").value = theclip.content;
    document.getElementById("clipFolder").value = theclip.folder;
  }

  document.getElementById("modalTitle").innerHTML = "Edit Clip";
  document.getElementById("saveBtn").innerHTML = "Update Clip";
  updateCounters();
}

function closeModal() {
  document.getElementById("modalOverlay").classList.add("hidden");
  amIEditing = false;
  myEditId = null;
}

function saveClip() {
  var t = document.getElementById("clipTitle").value;
  var c = document.getElementById("clipContent").value;
  var f = document.getElementById("clipFolder").value;

  if (t == "" || c == "") {
    return; // do nothing
  }

  if (amIEditing == true) {
    for (var i = 0; i < allMyClips.length; i++) {
      if (allMyClips[i].id == myEditId) {
        allMyClips[i].title = t;
        allMyClips[i].content = c;
        allMyClips[i].folder = f;
      }
    }
  } else {
    var newObj = {
      id: nextClipId,
      title: t,
      content: c,
      folder: f,
      isPinned: false,
      date: Date.now()
    };
    nextClipId = nextClipId + 1;
    
    // add to front manually
    var tempArr = [newObj];
    for (var i = 0; i < allMyClips.length; i++) {
      tempArr.push(allMyClips[i]);
    }
    allMyClips = tempArr;
  }

  localStorage.setItem("clipnest-clips", JSON.stringify(allMyClips));
  localStorage.setItem("clipnest-folders", JSON.stringify(myFolders));

  closeModal();
  renderSidebar();
  renderClips();
}

function updateCounters() {
  var myText = document.getElementById("clipContent").value;
  var chars = myText.length;
  
  // count words 
  var words = 0;
  if (myText != "") {
    var splitted = myText.split(" ");
    for(var i = 0; i < splitted.length; i++) {
      if (splitted[i] != "") {
        words = words + 1;
      }
    }
  }
  document.getElementById("counterLabel").innerHTML = words + " words | " + chars + " characters";
}

function deleteClip(id) {
  var newAll = [];
  for (var i = 0; i < allMyClips.length; i++) {
    if (allMyClips[i].id == id) {
      var d = [];
      d.push(allMyClips[i]);
      for(var x = 0; x < theDeletedOnes.length; x++) {
        d.push(theDeletedOnes[x]);
      }
      theDeletedOnes = d;
    } else {
      newAll.push(allMyClips[i]);
    }
  }
  allMyClips = newAll;

  localStorage.setItem("clipnest-clips", JSON.stringify(allMyClips));
  localStorage.setItem("clipnest-deleted", JSON.stringify(theDeletedOnes));
  renderSidebar();
  renderClips();
}

function permanentlyDeleteClip(id) {
  var d = [];
  for (var i = 0; i < theDeletedOnes.length; i++) {
    if (theDeletedOnes[i].id != id) {
      d.push(theDeletedOnes[i]);
    }
  }
  theDeletedOnes = d;

  localStorage.setItem("clipnest-deleted", JSON.stringify(theDeletedOnes));
  renderSidebar();
  renderClips();
}

function restoreClip(id) {
  var d = [];
  for (var i = 0; i < theDeletedOnes.length; i++) {
    if (theDeletedOnes[i].id == id) {
      var a = [];
      a.push(theDeletedOnes[i]);
      for (var y = 0; y < allMyClips.length; y++) {
        a.push(allMyClips[y]);
      }
      allMyClips = a;
    } else {
      d.push(theDeletedOnes[i]);
    }
  }
  theDeletedOnes = d;

  localStorage.setItem("clipnest-clips", JSON.stringify(allMyClips));
  localStorage.setItem("clipnest-deleted", JSON.stringify(theDeletedOnes));
  renderSidebar();
  renderClips();
}

function togglePin(id) {
  for (var i = 0; i < allMyClips.length; i++) {
    if (allMyClips[i].id == id) {
      if (allMyClips[i].isPinned == true) {
        allMyClips[i].isPinned = false;
      } else {
        allMyClips[i].isPinned = true;
      }
    }
  }
  localStorage.setItem("clipnest-clips", JSON.stringify(allMyClips));
  renderClips();
}

function copyClip(id) {
  var c = null;
  for (var i = 0; i < allMyClips.length; i++) {
    if (allMyClips[i].id == id) {
      c = allMyClips[i];
    }
  }

  if (c != null) {
    navigator.clipboard.writeText(c.content);
    var b = document.getElementById("copybtn-" + id);
    b.innerHTML = "Copied!";
    b.style.color = "green";

    setTimeout(function() {
      b.innerHTML = "Copy";
      b.style.color = "";
    }, 1500);
  }
}

function openMoveMenu(id, myBtn) {
  var m = document.getElementById("moveMenu");
  
  if (myMoveMenuOpen == id) {
    m.classList.add("hidden");
    myMoveMenuOpen = null;
    return;
  }

  myMoveMenuOpen = id;
  var c = null;
  for (var i = 0; i < allMyClips.length; i++) {
    if (allMyClips[i].id == id) c = allMyClips[i];
  }

  if (c == null) return;

  m.innerHTML = ""; // clear old menu

  var countFold = 0;
  for (var i = 0; i < myFolders.length; i++) {
    if (myFolders[i] != c.folder) {
      var it = document.createElement("div");
      it.className = "move-menu-item";
      it.innerHTML = myFolders[i];
      it.setAttribute("onclick", "moveClip(\"" + id + "\", \"" + myFolders[i] + "\")");
      m.appendChild(it);
      countFold++;
    }
  }

  if (countFold == 0) {
    var it = document.createElement("div");
    it.className = "move-menu-item";
    it.innerHTML = "No other folders";
    m.appendChild(it);
  }

  var r = myBtn.getBoundingClientRect();
  m.style.top = (r.bottom + 6) + "px";
  m.style.left = (r.right - 160) + "px";
  m.classList.remove("hidden");
}

function moveClip(id, fol) {
  for (var i = 0; i < allMyClips.length; i++) {
    if (allMyClips[i].id == id) {
      allMyClips[i].folder = fol;
    }
  }
  localStorage.setItem("clipnest-clips", JSON.stringify(allMyClips));
  localStorage.setItem("clipnest-folders", JSON.stringify(myFolders));

  document.getElementById("moveMenu").classList.add("hidden");
  myMoveMenuOpen = null;
  
  renderSidebar();
  renderClips();
}

document.addEventListener("click", function(e) {
  var m = document.getElementById("moveMenu");
  var o = e.target.getAttribute("onclick");
  var cl = false;
  if (o != null) {
    if (o.includes("openMoveMenu")) {
      cl = true;
    }
  }

  if (m.contains(e.target) == false && cl == false) {
    m.classList.add("hidden");
    myMoveMenuOpen = null;
  }
});

function showFolderInput() {
  document.getElementById("addFolderBtn").classList.add("hidden");
  document.getElementById("folderInputBox").classList.remove("hidden");
  document.getElementById("folderNameInput").focus();
}

function hideFolderInput() {
  document.getElementById("addFolderBtn").classList.remove("hidden");
  document.getElementById("folderInputBox").classList.add("hidden");
  document.getElementById("folderNameInput").value = "";
}

function addNewFolder() {
  var n = document.getElementById("folderNameInput").value;
  if (n == "") return;

  var exists = false;
  for(var i = 0; i < myFolders.length; i++) {
    if (myFolders[i] == n) exists = true;
  }
  if (exists == true) return;

  myFolders.push(n);

  localStorage.setItem("clipnest-clips", JSON.stringify(allMyClips));
  localStorage.setItem("clipnest-folders", JSON.stringify(myFolders));

  hideFolderInput();
  renderSidebar();
  updateFolderDropdown();
}

function updateFolderDropdown() {
  var s = document.getElementById("clipFolder");
  s.innerHTML = "";
  for (var i = 0; i < myFolders.length; i++) {
    var o = document.createElement("option");
    o.value = myFolders[i];
    o.innerHTML = myFolders[i];
    s.appendChild(o);
  }
}

document.getElementById("modalOverlay").addEventListener("click", function(e) {
  if (e.target == document.getElementById("modalOverlay")) {
    closeModal();
  }
});

document.getElementById("folderNameInput").addEventListener("keydown", function(e) {
  if (e.key == "Enter") {
    addNewFolder();
  } else if (e.key == "Escape") {
    hideFolderInput();
  }
});

if (document.getElementById("sortSelect")) {
  document.getElementById("sortSelect").value = howToSort;
}
renderSidebar();
renderClips();
updateFolderDropdown();