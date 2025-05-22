# Holidaze App

Modern responsive booking platform for venues built with React, Tailwind CSS, Vite and the Holidaze API.

## 🚀 Features

- 🔐 **Authentication** – Login & Register using JWT
- 🏨 **Venue Listings** – Full catalog of venues from API
- ✅ **Booking System** – Availability checking & date validation
- 🔍 **Smart Search** – Filter by location, venue name
- 📅 **Date Picker** – Select check-in/out dates with `react-datepicker`
- 🖼️ **Image Slideshow** – Fullscreen preview of venue media
- 📍 **Map Integration** – Embed Google Maps location per venue
- 🛠️ **Venue Manager Dashboard** – Manage owned venues (create/edit/delete)
- 👤 **User Profiles** – Avatar and banner customization
- 🎨 **Custom UI** – Fully responsive Tailwind UI with custom theme

---

## 🧰 Tech Stack

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [React Datepicker](https://www.npmjs.com/package/react-datepicker)
- [Lucide Icons](https://lucide.dev/)
- [React Toastify](https://fkhadra.github.io/react-toastify/) – Notifications
- [@fontsource/poppins](https://www.npmjs.com/package/@fontsource/poppins) – Typography

---

## 🛠️ Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/lynar13/holidaze.git
cd holidaze
```

### 2. Configure Environment Variables
Create a .env file at the root and add your API key:
```bash
VITE_NOROFF_API_KEY=your_api_key_here
```

## 📦 Installation

```bash
npm install
npm run dev
```

## 📁 Project Structure

```bash
src/
├── components/       # UI components (SearchBar, Header, VenueCard)
├── context/          # AuthContext
├── pages/             # Pages (Home, VenueDetail, Login, Register)
├── utils/            # API utils (getVenues etc.)
├── index.css         # Tailwind base + custom styles
└── main.jsx          # React entry
```

## 🔧 Tailwind Theme Customization

Located in `vite.config.js`:

```js
export default defineConfig({
  base: '/holidaze/',
  plugins: [react(), tailwindcss()], 
})
```

## 🌐 API Docs

Powered by [Noroff Holidaze API](https://docs.noroff.dev/docs/v2/holidaze/)

## ✨ Links

- 🔗 [GitHub Repo](https://github.com/lynar13/holidaze )

  - 🔗 [Demo Live URL](https://lynar13.github.io/holidaze/)

  - 🔗 [Figma Style Guide](https://shorturl.at/BHsSC)

  - 🔗 [Kanban/Project Board]( https://github.com/users/lynar13/projects/7)

## 📸 Screenshots

![Homepage](../assets/DesktopHome.png)
![Booking Page](../assets/MobileBookings1.png)

Made with ❤️ using React + Tailwind + Vite by Romelyn 

