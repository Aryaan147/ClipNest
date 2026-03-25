// ==============================
//  ClipNest - app.js
// ==============================


// --- starting data ---

var folders = ["AI Prompts", "Code Snippets", "Research", "Personal Notes"]

var clips = [
  {
    id: "1",
    title: "ChatGPT Rewrite Prompt",
    content: "Rewrite the following text in a clearer, more concise way while preserving the original meaning:",
    folder: "AI Prompts",
    date: Date.now() - 86400000
  },
  {
    id: "2",
    title: "React useEffect Template",
    content: "useEffect(() => {\n  // do something\n  return () => {\n    // cleanup\n  };\n}, []);",
    folder: "Code Snippets",
    date: Date.now() - 172800000
  },
  {
    id: "3",
    title: "Research Paper Structure",
    content: "Abstract → Introduction → Literature Review → Methodology → Results → Discussion → Conclusion",
    folder: "Research",
    date: Date.now() - 259200000
  }
]

var currentFolder = "All"
var currentSearch = ""
var editingId = null
var moveMenuOpenFor = null


// --- load saved data from localStorage ---

function loadData() {
  var savedClips = localStorage.getItem("clipnest-clips")
  var savedFolders = localStorage.getItem("clipnest-folders")

  if (savedClips) {
    clips = JSON.parse(savedClips)
  }
  if (savedFolders) {
    folders = JSON.parse(savedFolders)
  }
}

function saveData() {
  localStorage.setItem("clipnest-clips", JSON.stringify(clips))
  localStorage.setItem("clipnest-folders", JSON.stringify(folders))
}


// --- show a small toast message ---

function showToast(message) {
  var toast = document.getElementById("toast")
  toast.textContent = message
  toast.classList.remove("hidden")

  setTimeout(function() {
    toast.classList.add("hidden")
  }, 2000)
}


// --- get how long ago a date was ---

function timeAgo(timestamp) {
  var diff = Date.now() - timestamp

  if (diff < 60000) return "just now"
  if (diff < 3600000) return Math.floor(diff / 60000) + "m ago"
  if (diff < 86400000) return Math.floor(diff / 3600000) + "h ago"
  return Math.floor(diff / 86400000) + "d ago"
}


// --- make text safe to put in html ---

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}


// --- render the sidebar folder list ---

function renderSidebar() {
  // update "All" count
  document.getElementById("count-All").textContent = clips.length

  // clear old folders
  var folderList = document.getElementById("folderList")
  folderList.innerHTML = ""

  // add each folder
  for (var i = 0; i < folders.length; i++) {
    var folderName = folders[i]

    // count how many clips are in this folder
    var count = 0
    for (var j = 0; j < clips.length; j++) {
      if (clips[j].folder === folderName) count++
    }

    var div = document.createElement("div")
    div.className = "sidebar-folder"
    div.id = "folder-" + folderName

    if (currentFolder === folderName) {
      div.className += " active"
    }

    div.innerHTML = "<span>" + folderName + "</span><span class='folder-count'>" + count + "</span>"
    div.setAttribute("onclick", "changeFolder('" + folderName + "')")
    folderList.appendChild(div)
  }

  // highlight the correct active folder
  var allFolder = document.getElementById("folder-All")
  if (currentFolder === "All") {
    allFolder.className = "sidebar-folder active"
  } else {
    allFolder.className = "sidebar-folder"
  }
}


// --- render the clip cards ---

function renderClips() {
  var grid = document.getElementById("clipsGrid")
  var emptyState = document.getElementById("emptyState")

  // filter clips by folder and search
  var filtered = []
  for (var i = 0; i < clips.length; i++) {
    var clip = clips[i]

    var matchesFolder = currentFolder === "All" || clip.folder === currentFolder
    var matchesSearch = clip.title.toLowerCase().includes(currentSearch) || clip.content.toLowerCase().includes(currentSearch)

    if (matchesFolder && matchesSearch) {
      filtered.push(clip)
    }
  }

  // update heading
  document.getElementById("sectionTitle").textContent = currentFolder
  document.getElementById("clipCountLabel").textContent = filtered.length + " clip" + (filtered.length !== 1 ? "s" : "")

  // show empty state if no clips
  if (filtered.length === 0) {
    grid.innerHTML = ""
    grid.classList.add("hidden")
    emptyState.classList.remove("hidden")

    if (currentSearch !== "") {
      document.getElementById("emptyMsg").textContent = "No clips match your search"
      document.getElementById("emptySub").textContent = "Try a different keyword"
    } else {
      document.getElementById("emptyMsg").textContent = "No clips here yet"
      document.getElementById("emptySub").textContent = 'Click "+ New Clip" to get started'
    }
    return
  }

  grid.classList.remove("hidden")
  emptyState.classList.add("hidden")
  grid.innerHTML = ""

  // make a card for each clip
  for (var i = 0; i < filtered.length; i++) {
    var clip = filtered[i]

    var card = document.createElement("div")
    card.className = "clip-card"

    card.innerHTML = `
      <div class="clip-card-top">
        <div class="clip-title">${escapeHtml(clip.title)}</div>
        <span class="clip-tag">${escapeHtml(clip.folder)}</span>
      </div>
      <div class="clip-preview">${escapeHtml(clip.content)}</div>
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

    grid.appendChild(card)
  }
}


// --- change active folder ---

function changeFolder(name) {
  currentFolder = name
  renderSidebar()
  renderClips()
}


// --- search ---

function searchClips() {
  currentSearch = document.getElementById("searchInput").value.toLowerCase()
  renderClips()
}


// --- open modal for new clip ---

function openNewModal() {
  editingId = null
  document.getElementById("modalTitle").textContent = "New Clip"
  document.getElementById("saveBtn").textContent = "Save Clip"
  document.getElementById("clipTitle").value = ""
  document.getElementById("clipContent").value = ""
  updateFolderDropdown()
  document.getElementById("modalOverlay").classList.remove("hidden")
}


// --- open modal to edit a clip ---

function editClip(id) {
  var clip = null
  for (var i = 0; i < clips.length; i++) {
    if (clips[i].id === id) clip = clips[i]
  }
  if (!clip) return

  editingId = id
  document.getElementById("modalTitle").textContent = "Edit Clip"
  document.getElementById("saveBtn").textContent = "Update Clip"
  document.getElementById("clipTitle").value = clip.title
  document.getElementById("clipContent").value = clip.content
  updateFolderDropdown()
  document.getElementById("clipFolder").value = clip.folder
  document.getElementById("modalOverlay").classList.remove("hidden")
}


// --- close modal ---

function closeModal() {
  document.getElementById("modalOverlay").classList.add("hidden")
  editingId = null
}


// --- save or update a clip ---

function saveClip() {
  var title = document.getElementById("clipTitle").value.trim()
  var content = document.getElementById("clipContent").value.trim()
  var folder = document.getElementById("clipFolder").value

  if (title === "" || content === "") {
    showToast("Please fill in title and content.")
    return
  }

  if (editingId !== null) {
    // update existing clip
    for (var i = 0; i < clips.length; i++) {
      if (clips[i].id === editingId) {
        clips[i].title = title
        clips[i].content = content
        clips[i].folder = folder
      }
    }
    showToast("Clip updated!")
  } else {
    // add new clip at the top
    var newClip = {
      id: Date.now().toString(),
      title: title,
      content: content,
      folder: folder,
      date: Date.now()
    }
    clips.unshift(newClip)
    showToast("Clip saved!")
  }

  saveData()
  closeModal()
  renderSidebar()
  renderClips()
}


// --- delete a clip ---

function deleteClip(id) {
  var newClips = []
  for (var i = 0; i < clips.length; i++) {
    if (clips[i].id !== id) {
      newClips.push(clips[i])
    }
  }
  clips = newClips

  saveData()
  showToast("Clip deleted.")
  renderSidebar()
  renderClips()
}


// --- copy a clip's content ---

function copyClip(id) {
  var clip = null
  for (var i = 0; i < clips.length; i++) {
    if (clips[i].id === id) clip = clips[i]
  }
  if (!clip) return

  navigator.clipboard.writeText(clip.content)

  var btn = document.getElementById("copybtn-" + id)
  btn.textContent = "✓"
  btn.classList.add("success")
  showToast("Copied to clipboard!")

  setTimeout(function() {
    btn.textContent = "⎘"
    btn.classList.remove("success")
  }, 1500)
}


// --- open move menu ---

function openMoveMenu(id, btn) {
  var menu = document.getElementById("moveMenu")

  // close menu if clicking the same button again
  if (moveMenuOpenFor === id) {
    menu.classList.add("hidden")
    moveMenuOpenFor = null
    return
  }

  moveMenuOpenFor = id

  // find current folder of this clip
  var clip = null
  for (var i = 0; i < clips.length; i++) {
    if (clips[i].id === id) clip = clips[i]
  }

  menu.innerHTML = ""

  // add a button for each other folder
  var hasOptions = false
  for (var i = 0; i < folders.length; i++) {
    if (folders[i] !== clip.folder) {
      hasOptions = true
      var item = document.createElement("div")
      item.className = "move-menu-item"
      item.textContent = folders[i]
      item.setAttribute("onclick", "moveClip('" + id + "', '" + folders[i] + "')")
      menu.appendChild(item)
    }
  }

  if (!hasOptions) {
    var item = document.createElement("div")
    item.className = "move-menu-item"
    item.textContent = "No other folders"
    item.style.color = "#555"
    menu.appendChild(item)
  }

  // position the menu below the button
  var btnRect = btn.getBoundingClientRect()
  menu.style.top = (btnRect.bottom + 6) + "px"
  menu.style.left = (btnRect.right - 160) + "px"
  menu.classList.remove("hidden")
}


// --- move a clip to a different folder ---

function moveClip(id, targetFolder) {
  for (var i = 0; i < clips.length; i++) {
    if (clips[i].id === id) {
      clips[i].folder = targetFolder
    }
  }

  saveData()
  showToast("Moved to " + targetFolder)
  document.getElementById("moveMenu").classList.add("hidden")
  moveMenuOpenFor = null
  renderSidebar()
  renderClips()
}


// --- close move menu if clicking outside ---

document.addEventListener("click", function(e) {
  var menu = document.getElementById("moveMenu")
  var clickedMoveBtn = e.target.getAttribute("onclick") && e.target.getAttribute("onclick").includes("openMoveMenu")

  if (!menu.contains(e.target) && !clickedMoveBtn) {
    menu.classList.add("hidden")
    moveMenuOpenFor = null
  }
})


// --- add new folder ---

function showFolderInput() {
  document.getElementById("addFolderBtn").classList.add("hidden")
  document.getElementById("folderInputBox").classList.remove("hidden")
  document.getElementById("folderNameInput").focus()
}

function hideFolderInput() {
  document.getElementById("addFolderBtn").classList.remove("hidden")
  document.getElementById("folderInputBox").classList.add("hidden")
  document.getElementById("folderNameInput").value = ""
}

function addNewFolder() {
  var name = document.getElementById("folderNameInput").value.trim()

  if (name === "") {
    showToast("Please enter a folder name.")
    return
  }

  if (folders.includes(name)) {
    showToast("That folder already exists.")
    return
  }

  folders.push(name)
  saveData()
  showToast("Folder \"" + name + "\" created!")
  hideFolderInput()
  renderSidebar()
  updateFolderDropdown()
}


// --- fill the folder dropdown in the modal ---

function updateFolderDropdown() {
  var select = document.getElementById("clipFolder")
  select.innerHTML = ""

  for (var i = 0; i < folders.length; i++) {
    var option = document.createElement("option")
    option.value = folders[i]
    option.textContent = folders[i]
    select.appendChild(option)
  }
}


// --- close modal when clicking outside it ---

document.getElementById("modalOverlay").addEventListener("click", function(e) {
  if (e.target === document.getElementById("modalOverlay")) {
    closeModal()
  }
})


// --- press Enter in folder input to confirm ---

document.getElementById("folderNameInput").addEventListener("keydown", function(e) {
  if (e.key === "Enter") addNewFolder()
  if (e.key === "Escape") hideFolderInput()
})


// --- start the app ---

loadData()
renderSidebar()
renderClips()
updateFolderDropdown()