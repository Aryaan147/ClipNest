<div align="center">

```
 ██████╗██╗     ██╗██████╗ ███╗   ██╗███████╗███████╗████████╗
██╔════╝██║     ██║██╔══██╗████╗  ██║██╔════╝██╔════╝╚══██╔══╝
██║     ██║     ██║██████╔╝██╔██╗ ██║█████╗  ███████╗   ██║   
██║     ██║     ██║██╔═══╝ ██║╚██╗██║██╔══╝  ╚════██║   ██║   
╚██████╗███████╗██║██║     ██║ ╚████║███████╗███████║   ██║   
 ╚═════╝╚══════╝╚═╝╚═╝     ╚═╝  ╚═══╝╚══════╝╚══════╝   ╚═╝   
```

**Your personal clipboard, organized.**  
Store anything you copy repeatedly — one tap away, always.

[![Made with Expo](https://img.shields.io/badge/Made%20with-Expo-000020?style=flat-square&logo=expo)](https://expo.dev)
[![Firebase](https://img.shields.io/badge/Backend-Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android%20%7C%20Web-blue?style=flat-square)](https://expo.dev)
[![Auth](https://img.shields.io/badge/Auth-Enabled-success?style=flat-square)]()
[![Offline](https://img.shields.io/badge/Offline-Ready-brightgreen?style=flat-square)]()

</div>

---

## What is ClipNest?

ClipNest is a smart clipboard manager built for people who copy the same things over and over again — and are tired of digging through notes, browser history, or Notion pages to find them.

Whether it's a YouTube channel you share with everyone, a research paper link, your social handles, a repo URL, or a code snippet you paste daily — **ClipNest stores it once, copies it in one tap.**

No friction. No searching. Just tap and move on.

---

## ✨ Features

- **One-tap copy** — Every item copies to clipboard instantly, no extra steps
- **Search** — Find any clip across all categories instantly
- **Categories** — Group your clips however you think: by project, type, context, or anything else
- **Universal content** — Links, code snippets, prompts, social IDs, research papers, repo URLs, anything text-based
- **Offline support** — Your clips are available even without internet; syncs automatically when back online
- **Sleek UI** — Clean, focused interface designed to stay out of your way
- **Authentication** — Your clips are yours; secure login keeps data private
- **Cloud sync via Firebase** — Access your clips from any device, always up to date
- **Cross-platform** — iOS, Android, and Web from a single codebase (Expo)

---

## 📦 Use Cases

| What you store | Example |
|---|---|
| YouTube links | Channels, playlists, tutorials you share often |
| Social handles | Your Twitter/X, LinkedIn, GitHub profile URLs |
| Research papers | arXiv links, DOIs, Google Scholar URLs |
| Code snippets | Boilerplate, regex patterns, bash one-liners |
| Repo links | GitHub/GitLab repos you reference constantly |
| Prompts | LLM prompts, templates, canned responses |
| Credentials / IDs | API base URLs, public keys, test credentials |
| Anything else | If you've copy-pasted it more than twice, it belongs in ClipNest |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Expo](https://expo.dev) (React Native) |
| Backend & Database | [Firebase](https://firebase.google.com) (Firestore) |
| Authentication | Firebase Auth |
| Offline Storage | Firestore offline persistence |
| Platform Support | iOS · Android · Web |

---

## 📁 Project Structure

```
ClipNest/
├── src/                        # All application source code
│   ├── screens/                # App screens (Home, Login, Category, etc.)
│   ├── components/             # Reusable UI components (ClipCard, SearchBar, etc.)
│   ├── firebase/               # Firebase config, auth helpers, Firestore queries
│   ├── hooks/                  # Custom React hooks (useClips, useAuth, etc.)
│   └── constants/              # Theme colors, layout constants
│
├── ClipNestApp.js              # Root app component
├── app.js                      # App entry with navigation setup
├── index.js                    # Expo entry point
├── index.html                  # Web entry point (Expo web)
├── style.css                   # Global styles (web)
├── app.json                    # Expo app configuration
├── babel.config.js             # Babel configuration
├── package.json                # Dependencies and scripts
└── package-lock.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (v18 or higher)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- A Firebase project with Firestore and Authentication enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/Aryaan147/ClipNest.git
cd ClipNest

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Firebase Setup

1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Firestore Database** and **Authentication** (Email/Password or your preferred provider)
3. In Firestore settings, enable **offline persistence** for offline support
4. Copy your Firebase config and create a `.env` file in the root:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

5. Run the app:

```bash
# Start development server
npx expo start

# iOS
npx expo run:ios

# Android
npx expo run:android

# Web
npx expo start --web
```

---

## 🗺 Roadmap

- [x] One-tap copy
- [x] Categories
- [x] Search across all clips
- [x] Offline support
- [x] Firebase cloud sync
- [x] Authentication
- [ ] Tags / multi-category support
- [ ] Import from browser bookmarks
- [ ] Share clips with other users
- [ ] Usage stats (most copied items)
- [ ] Widgets (iOS/Android home screen quick-copy)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to open an issue or submit a pull request.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

Built with focus, for focused people.  
**ClipNest** — *nest your clips, not your chaos.*

</div>
