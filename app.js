// ClipNest - app.js

// list of folder names
var folders = ["AI Prompts", "Code Snippets", "Research", "Personal Notes"]

// list of clips (each clip has id, title, content, folder, date)
var clips = [
  {
    id: 1,
    title: "ChatGPT Rewrite Prompt",
    content: "Rewrite the following text in a clearer, more concise way while preserving the original meaning:",
    folder: "AI Prompts",
    date: Date.now() - 86400000   // 1 day ago in milliseconds
  },
  {
    id: 2,
    title: "React useEffect Template",
    content: "useEffect(() => {\n  // do something\n  return () => {\n    // cleanup\n  };\n}, []);",
    folder: "Code Snippets",
    date: Date.now() - 172800000  // 2 days ago
  },
  {
    id: 3,
    title: "Research Paper Structure",
    content: "Abstract → Introduction → Literature Review → Methodology → Results → Discussion → Conclusion",
    folder: "Research",
    date: Date.now() - 259200000  // 3 days ago
  }
]

var currentFolder = "All"       // which folder is open right now
var currentSearch = ""          // what user typed in search
var isEditing = false           // true if editing, false if new
var editingId = null            // id of clip being edited
var moveMenuOpenFor = null      // id of clip whose move menu is open
var nextId = 4                  // next id to give to a new clip


// get saved data from localStorage
var savedClips = localStorage.getItem("clipnest-clips")
var savedFolders = localStorage.getItem("clipnest-folders")

// if saved data exists, use it
if (savedClips) {
  clips = JSON.parse(savedClips)       // turn string back to array
}
if (savedFolders) {
  folders = JSON.parse(savedFolders)   // turn string back to array
}

// print how many clips loaded
console.log("clips loaded:", clips.length)



// takes a time and returns like "2h ago" or "3d ago"
function timeAgo(timestamp) {
  var diff = Date.now() - timestamp   // difference in milliseconds

  if (diff < 60000) {                              // less than 1 min
    return "just now"
  } else if (diff < 3600000) {                     // less than 1 hour
    return Math.floor(diff / 60000) + "m ago"      // show minutes
  } else if (diff < 86400000) {                    // less than 1 day
    return Math.floor(diff / 3600000) + "h ago"    // show hours
  } else {
    return Math.floor(diff / 86400000) + "d ago"   // show days
  }
}


// draw the sidebar with all folders and their counts
function renderSidebar() {
  // set total count next to "All Clips"
  document.getElementById("count-All").textContent = clips.length
  var folderList = document.getElementById("folderList")   // get folder list div
  folderList.innerHTML = ""                                // clear it

  // go through each folder
  for (var i = 0; i < folders.length; i++) {
    var folderName = folders[i]

    // count how many clips in this folder
    var count = 0
    for (var j = 0; j < clips.length; j++) {
      if (clips[j].folder == folderName) {
        count++
      }
    }

    // create a div for this folder
    var div = document.createElement("div")
    div.className = "sidebar-folder"

    // if this folder is selected, make it active
    if (currentFolder == folderName) {
      div.className = "sidebar-folder active"
    }

    // put folder name and count inside
    div.innerHTML = "<span>" + folderName + "</span><span class='folder-count'>" + count + "</span>"
    // when clicked, switch to this folder
    div.setAttribute("onclick", "changeFolder('" + folderName + "')")
    folderList.appendChild(div)   // add to page
  }

  // highlight "All Clips" if it's selected
  var allFolder = document.getElementById("count-All").parentElement
  if (currentFolder == "All") {
    allFolder.className = "sidebar-folder active"
  } else {
    allFolder.className = "sidebar-folder"
  }
}





// draw all clip cards on the page
function renderClips() {
  var grid = document.getElementById("clipsGrid")        // cards go here
  var emptyState = document.getElementById("emptyState")  // shown when no clips

  // filter clips by folder and search
  var filtered = []

  for (var i = 0; i < clips.length; i++) {
    var clip = clips[i]

    // check if clip is in the right folder
    var folderMatch = false
    if (currentFolder == "All") {
      folderMatch = true                           // "All" shows everything
    } else if (clip.folder == currentFolder) {
      folderMatch = true                           // clip is in selected folder
    }

    // check if clip matches search text
    var searchMatch = false
    if (clip.title.toLowerCase().includes(currentSearch) || clip.content.toLowerCase().includes(currentSearch)) {
      searchMatch = true
    }

    // add to list if both match
    if (folderMatch && searchMatch) {
      filtered.push(clip)
    }
  }

  // update heading and clip count text
  document.getElementById("sectionTitle").textContent = currentFolder
  document.getElementById("clipCountLabel").textContent = filtered.length + " clips"

  // if no clips found, show empty message
  if (filtered.length == 0) {
    grid.innerHTML = ""
    grid.classList.add("hidden")              // hide the grid
    emptyState.classList.remove("hidden")      // show empty message

    // different message for search vs no clips
    if (currentSearch != "") {
      document.getElementById("emptyMsg").textContent = "No clips match your search"
      document.getElementById("emptySub").textContent = "Try a different keyword"
    } else {
      document.getElementById("emptyMsg").textContent = "No clips here yet"
      document.getElementById("emptySub").textContent = "Click + New Clip to get started"
    }
    return   // stop here
  }

  // show grid, hide empty message
  grid.classList.remove("hidden")
  emptyState.classList.add("hidden")
  grid.innerHTML = ""   // clear old cards

  // make a card for each clip
  for (var i = 0; i < filtered.length; i++) {
    var clip = filtered[i]

    var card = document.createElement("div")   // create card div
    card.className = "clip-card"

    // put the card content inside
    card.innerHTML = `
      <div class="clip-card-top">
        <div class="clip-title">${clip.title}</div>
        <span class="clip-tag">${clip.folder}</span>
      </div>
      <div class="clip-preview">${clip.content}</div>
      <div class="clip-footer">
        <span class="clip-time">${timeAgo(clip.date)}</span>
        <div class="clip-actions">
          <button class="action-btn" onclick="openMoveMenu('${clip.id}', this)" title="Move">⇄</button>
          <button class="action-btn" onclick="editClip('${clip.id}')" title="Edit">✎</button>
          <button class="action-btn" id="copybtn-${clip.id}" onclick="copyClip('${clip.id}')" title="Copy">⎘</button>
          <button class="action-btn danger" onclick="deleteClip('${clip.id}')" title="Delete">⌫</button>
        </div>
      </div>
    `

    grid.appendChild(card)   // add card to grid
  }
}


// when user clicks a folder
function changeFolder(name) {
  currentFolder = name   // change selected folder
  renderSidebar()        // redraw sidebar
  renderClips()          // redraw clips
}


// when user types in search bar
function searchClips() {
  currentSearch = document.getElementById("searchInput").value.toLowerCase()   // get text
  renderClips()   // redraw clips with filter
}


// open modal to add a new clip
function openNewModal() {
  isEditing = false      // not editing
  editingId = null

  document.getElementById("modalTitle").textContent = "New Clip"     // set title
  document.getElementById("saveBtn").textContent = "Save Clip"       // set button text
  document.getElementById("clipTitle").value = ""                    // clear title input
  document.getElementById("clipContent").value = ""                  // clear content input

  updateFolderDropdown()   // fill folder options
  document.getElementById("modalOverlay").classList.remove("hidden")  // show modal
}


// open modal to edit an existing clip
function editClip(id) {
  openNewModal()   // open modal first

  isEditing = true   // now in edit mode
  editingId = id

  // find the clip and fill in its data
  for (var i = 0; i < clips.length; i++) {
    if (clips[i].id == id) {
      document.getElementById("clipTitle").value = clips[i].title      // fill title
      document.getElementById("clipContent").value = clips[i].content  // fill content
      document.getElementById("clipFolder").value = clips[i].folder    // fill folder
    }
  }

  document.getElementById("modalTitle").textContent = "Edit Clip"     // change heading
  document.getElementById("saveBtn").textContent = "Update Clip"      // change button
}


// close the modal
function closeModal() {
  document.getElementById("modalOverlay").classList.add("hidden")   // hide modal
  isEditing = false
  editingId = null
}


// save button - works for both new and edit
function saveClip() {
  var title = document.getElementById("clipTitle").value       // get title
  var content = document.getElementById("clipContent").value   // get content
  var folder = document.getElementById("clipFolder").value     // get folder

  title = title.trim()       // remove spaces from start/end
  content = content.trim()

  // don't save if empty
  if (title == "" || content == "") {
    return
  }

  if (isEditing == true) {
    // update the existing clip
    for (var i = 0; i < clips.length; i++) {
      if (clips[i].id == editingId) {
        clips[i].title = title
        clips[i].content = content
        clips[i].folder = folder
      }
    }
  } else {
    // make a new clip
    var newClip = {
      id: nextId,
      title: title,
      content: content,
      folder: folder,
      date: Date.now()   // current time
    }
    nextId = nextId + 1        // increase id for next time
    clips.unshift(newClip)     // add to start of array
  }

  // save to localStorage so it stays after refresh
  localStorage.setItem("clipnest-clips", JSON.stringify(clips))
  localStorage.setItem("clipnest-folders", JSON.stringify(folders))

  closeModal()       // close the modal
  renderSidebar()    // redraw sidebar
  renderClips()      // redraw clips
}


// delete a clip
function deleteClip(id) {
  // make new array without the deleted clip
  var newClips = []
  for (var i = 0; i < clips.length; i++) {
    if (clips[i].id != id) {       // keep all except the one to delete
      newClips.push(clips[i])
    }
  }
  clips = newClips   // replace old array

  // save to localStorage
  localStorage.setItem("clipnest-clips", JSON.stringify(clips))
  localStorage.setItem("clipnest-folders", JSON.stringify(folders))

  renderSidebar()
  renderClips()
}


// copy clip text to clipboard
function copyClip(id) {
  var clip = null

  // find the clip
  for (var i = 0; i < clips.length; i++) {
    if (clips[i].id == id) {
      clip = clips[i]
    }
  }

  if (clip == null) return   // if not found, stop

  navigator.clipboard.writeText(clip.content)   // copy to clipboard

  // change button to checkmark
  var btn = document.getElementById("copybtn-" + id)
  btn.textContent = "✓"
  btn.classList.add("success")       // make it green

  // change back after 1.5 seconds
  setTimeout(function() {
    btn.textContent = "⎘"
    btn.classList.remove("success")
  }, 1500)
}


// open the move menu (pick which folder to move to)
function openMoveMenu(id, btn) {
  var menu = document.getElementById("moveMenu")

  // if same menu is already open, close it
  if (moveMenuOpenFor == id) {
    menu.classList.add("hidden")
    moveMenuOpenFor = null
    return
  }

  moveMenuOpenFor = id

  // find the clip
  var clip = null
  for (var i = 0; i < clips.length; i++) {
    if (clips[i].id == id) {
      clip = clips[i]
    }
  }

  menu.innerHTML = ""   // clear old items

  // add all folders except the one clip is already in
  for (var i = 0; i < folders.length; i++) {
    if (folders[i] != clip.folder) {
      var item = document.createElement("div")
      item.className = "move-menu-item"
      item.textContent = folders[i]
      item.setAttribute("onclick", "moveClip('" + id + "', '" + folders[i] + "')")
      menu.appendChild(item)
    }
  }

  // if no other folders exist
  if (menu.innerHTML == "") {
    var item = document.createElement("div")
    item.className = "move-menu-item"
    item.textContent = "No other folders"
    item.style.color = "#555"
    menu.appendChild(item)
  }

  // put menu below the button
  var rect = btn.getBoundingClientRect()   // get button position
  menu.style.top = (rect.bottom + 6) + "px"
  menu.style.left = (rect.right - 160) + "px"
  menu.classList.remove("hidden")   // show menu
}


// move clip to another folder
function moveClip(id, targetFolder) {
  // find clip and change its folder
  for (var i = 0; i < clips.length; i++) {
    if (clips[i].id == id) {
      clips[i].folder = targetFolder
    }
  }

  // save to localStorage
  localStorage.setItem("clipnest-clips", JSON.stringify(clips))
  localStorage.setItem("clipnest-folders", JSON.stringify(folders))

  document.getElementById("moveMenu").classList.add("hidden")   // hide menu
  moveMenuOpenFor = null
  renderSidebar()
  renderClips()
}


// close move menu if clicking outside
document.addEventListener("click", function(e) {
  var menu = document.getElementById("moveMenu")
  var onclickVal = e.target.getAttribute("onclick")
  var clickedMoveBtn = onclickVal && onclickVal.includes("openMoveMenu")

  // if click is not on menu and not on move button, close it
  if (!menu.contains(e.target) && !clickedMoveBtn) {
    menu.classList.add("hidden")
    moveMenuOpenFor = null
  }
})


// show folder name input
function showFolderInput() {
  document.getElementById("addFolderBtn").classList.add("hidden")        // hide button
  document.getElementById("folderInputBox").classList.remove("hidden")   // show input
  document.getElementById("folderNameInput").focus()                     // put cursor in input
}

// hide folder name input
function hideFolderInput() {
  document.getElementById("addFolderBtn").classList.remove("hidden")     // show button
  document.getElementById("folderInputBox").classList.add("hidden")      // hide input
  document.getElementById("folderNameInput").value = ""                  // clear input
}

// add a new folder
function addNewFolder() {
  var name = document.getElementById("folderNameInput").value.trim()   // get name

  if (name == "") {
    return
  }

  // check if folder name already taken
  var alreadyExists = false
  for (var i = 0; i < folders.length; i++) {
    if (folders[i] == name) {
      alreadyExists = true
    }
  }

  if (alreadyExists) {
    return
  }

  folders.push(name)   // add to list

  // save to localStorage
  localStorage.setItem("clipnest-clips", JSON.stringify(clips))
  localStorage.setItem("clipnest-folders", JSON.stringify(folders))

  hideFolderInput()
  renderSidebar()
  updateFolderDropdown()
}


// fill folder options in the modal dropdown
function updateFolderDropdown() {
  var select = document.getElementById("clipFolder")
  select.innerHTML = ""   // clear old options

  // add each folder as an option
  for (var i = 0; i < folders.length; i++) {
    var option = document.createElement("option")
    option.value = folders[i]
    option.textContent = folders[i]
    select.appendChild(option)
  }
}


// close modal when clicking the dark area behind it
document.getElementById("modalOverlay").addEventListener("click", function(e) {
  if (e.target == document.getElementById("modalOverlay")) {
    closeModal()
  }
})

// keyboard shortcuts for folder input
document.getElementById("folderNameInput").addEventListener("keydown", function(e) {
  if (e.key == "Enter") {     // press enter to add
    addNewFolder()
  }
  if (e.key == "Escape") {    // press escape to cancel
    hideFolderInput()
  }
})


// start the app
renderSidebar()
renderClips()
updateFolderDropdown()