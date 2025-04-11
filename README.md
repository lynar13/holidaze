# Holidaze Frontend

Modern responsive booking platform for venues built with React, Tailwind CSS, Vite and the Holidaze API.

## 🚀 Features

- 🔐 Authentication (Login/Register)
- ✅ Availability check and booking form
- 🔍 Venue search with filters (location, date range, guests)
- 🎨 Custom UI with TailwindCSS and Lucide icons
- 🖼️ Image slideshows + fullscreen preview
- 📍 Google Map embed per venue



## 🧰 Tech Stack

- React
- Vite
- Tailwind CSS (with custom theme)
- React Router
- React Datepicker
- Lucide React Icons
- @fontsource for Poppins font

## 📦 Installation

```bash
npm install
npm run dev
```

## 📁 Project Structure

```bash
src/
├── components/       # UI components (SearchBar, Header, VenueCard)
├── pages/            # Pages (Home, VenueDetail, Login, Register)
├── utils/            # API utils (getVenues etc.)
├── index.css         # Tailwind base + custom styles
└── main.jsx          # React entry
```

## 🔧 Tailwind Theme Customization

Located in `tailwind.config.js`:

```js
extend: {
  colors: {
    brand: { DEFAULT: '#ff7e5f', dark: '#e06b50', light: '#ffc2b3' },
    surface: '#fefefe',
  },
  fontFamily: {
    sans: ['Poppins', 'sans-serif']
  }
}
```

## 🌐 API Docs

Powered by [Noroff Holidaze API](https://docs.noroff.dev/docs/v2/holidaze/venues#all-venues)

## ✨ Customization Ideas

- Dark mode support
- Pagination or infinite scroll
- Favorite/like venue feature
- Admin dashboard for venue hosts

## 📸 Screenshots

_Add screenshots/gifs in this section to show off the UI_

---

Made with ❤️ using React + Tailwind + Vite by Romelyn 

