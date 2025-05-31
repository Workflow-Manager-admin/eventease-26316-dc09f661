import React, { useState } from "react";
import "./App.css";

/**
 * Main Container for EventEase
 * Features: 
 *  - User Registration & Login
 *  - Browse Categories (Movies, Travel, Events, Sports, Concerts)
 *  - Search & Filtering
 *  - Event/Travel Details (card/modal)
 *  - Ticket booking & confirmation
 *  - Booking management
 *  - Payment Gateway integration (placeholder)
 *  - Separate Admin panel (entry point)
 */

const CATEGORY_LIST = [
  { key: "movies", label: "Movies" },
  { key: "travel", label: "Travel" },
  { key: "events", label: "Events" },
  { key: "sports", label: "Sports" },
  { key: "concerts", label: "Concerts" }
];

const FEATURED_MOCK_EVENTS = [
  {
    id: 1,
    type: "movie",
    name: "The Marvel Adventure",
    date: "2024-08-02",
    location: "City Center Cinemas",
    price: 12,
    tags: ["Action", "Blockbuster"],
    description: "An action-packed superhero movie for the whole family."
  },
  {
    id: 2,
    type: "concert",
    name: "Live at the Arena",
    date: "2024-07-18",
    location: "Grand Arena",
    price: 40,
    tags: ["Music", "Rock"],
    description: "Experience the biggest rock concert of the summer!"
  },
  {
    id: 3,
    type: "travel",
    name: "Train to Paris",
    date: "2024-07-22",
    location: "Central Station",
    price: 75,
    tags: ["Scenic", "Train"],
    description: "High-speed train to Paris with premium comfort."
  },
  {
    id: 4,
    type: "sports",
    name: "Champions Cup Final",
    date: "2024-09-09",
    location: "Stadium X",
    price: 60,
    tags: ["Football", "Final"],
    description: "Don't miss the thrilling football cup final!"
  },
  {
    id: 5,
    type: "event",
    name: "Food Festival",
    date: "2024-06-30",
    location: "Riverside Park",
    price: 8,
    tags: ["Family", "Food"],
    description: "Sample cuisines from around the world. Fun for all ages."
  }
];

function formatDate(dateStr) {
  // Simple date formatting for display.
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// PUBLIC_INTERFACE
function App() {
  // App-wide state
  const [user, setUser] = useState(null); // if null, show login/register
  const [activeCategory, setActiveCategory] = useState(CATEGORY_LIST[0].key);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({ price: "", date: "", time: "" });
  const [showDetail, setShowDetail] = useState(null); // Holds event/travel object for modal/card
  const [myBookings, setMyBookings] = useState([]);
  const [showBooking, setShowBooking] = useState(null); // event/travel id user wants to book
  const [adminPanel, setAdminPanel] = useState(false); // Admin Section toggle
  const [adminTab, setAdminTab] = useState("events"); // "events" | "bookings"

  // PUBLIC_INTERFACE
  function handleLoginRegister(fakeAsAdmin = false) {
    // Demo user/auth/admin toggle
    setUser(fakeAsAdmin ? { name: "Admin", admin: true } : { name: "Demo User", admin: false });
    setAdminPanel(fakeAsAdmin);
  }

  // PUBLIC_INTERFACE
  function handleLogout() {
    setUser(null);
    setAdminPanel(false);
    setAdminTab("events");
  }

  // PUBLIC_INTERFACE
  function filteredEvents() {
    // Filter & search featured mock events by tab/category only
    let arr = [...FEATURED_MOCK_EVENTS];
    if (activeCategory) arr = arr.filter(e => e.type === activeCategory.slice(0, -1)); // crude match ("movies" -> "movie")
    if (searchTerm)
      arr = arr.filter(
        e =>
          e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    if (filter.price) arr = arr.filter(e => e.price <= Number(filter.price));
    if (filter.date) arr = arr.filter(e => e.date === filter.date);
    // filter.time omitted (mock data), would need a time field in real app
    return arr;
  }

  // PUBLIC_INTERFACE
  function handleBook(event) {
    setShowBooking(event);
  }

  // PUBLIC_INTERFACE
  function completeBooking(data) {
    setMyBookings(prev =>
      [...prev, {
        event: data,
        date: new Date().toISOString(),
        id: Math.random().toString(36).slice(2, 11)
      }]
    );
    setShowBooking(null);
  }

  // PUBLIC_INTERFACE
  function handleCancelBooking(bookId) {
    setMyBookings(curr => curr.filter(b => b.id !== bookId));
  }

  // PUBLIC_INTERFACE
  function renderEventCard(evt) {
    return (
      <div
        key={evt.id}
        className="card"
        tabIndex="0"
        role="button"
        aria-label={`Open details for ${evt.name}`}
        style={{
          border: "1px solid var(--border-color)",
          borderRadius: 8,
          padding: 16,
          background: "#232323",
          marginBottom: 18,
          marginRight: 16,
          minWidth: 260,
          maxWidth: 285,
          boxShadow: "0 2px 7px 0 rgba(0,0,0,0.07)",
          cursor: "pointer",
          transition: "transform 0.09s"
        }}
        onClick={() => setShowDetail(evt)}
        onKeyPress={e => { if (e.key === "Enter") setShowDetail(evt); }}
      >
        <div style={{ color: "#FFA500", fontWeight: 600, marginBottom: 6 }}>
          {evt.name}
        </div>
        <div style={{ fontSize: 14, color: "#aaa", marginBottom: 5 }}>
          {evt.location}
        </div>
        <div style={{ fontSize: 13, color: "#888", marginBottom: 3 }}>
          {formatDate(evt.date)}
        </div>
        <div style={{
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap",
          maxWidth: "100%"
        }}>
          <span style={{
            background: "#FF660012",
            color: "#FF8800",
            borderRadius: 4,
            padding: "1.5px 8px",
            fontSize: 12
          }}>{evt.type.toUpperCase()}</span>
        </div>
        <div style={{ fontSize: 15, fontWeight: 400, marginTop: 8, minHeight: 30, color: "#ddd" }}>
          {evt.description}
        </div>
        <div style={{ marginTop: 8, fontWeight: 600, color: "#FF8B4D" }}>
          ${evt.price}
        </div>
      </div>
    );
  }

  // PUBLIC_INTERFACE
  function renderEventDetailModal(evt) {
    if (!evt) return null;
    return (
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 2000,
          background: "rgba(0,0,0,0.65)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
        onClick={() => setShowDetail(null)}
      >
        <div
          className="modal-content"
          style={{
            background: "#191919",
            padding: 36,
            borderRadius: 12,
            minWidth: 350,
            maxWidth: "92vw",
            boxShadow: "0 2px 16px 0 #000",
            position: "relative"
          }}
          onClick={e => e.stopPropagation()}
        >
          <button
            aria-label="close details"
            style={{
              position: "absolute",
              right: 16,
              top: 10,
              border: "none",
              background: "transparent",
              color: "#ddd",
              fontSize: 22,
              cursor: "pointer"
            }}
            onClick={() => setShowDetail(null)}
          >×</button>

          <h2 style={{ margin: 0, color: "#FF6600" }}>{evt.name}</h2>
          <div style={{ fontSize: 16, color: "#bbb", margin: "8px 0" }}>
            {evt.location} | {formatDate(evt.date)}
          </div>
          <div style={{ margin: "10px 0", color: "#ccc" }}>{evt.description}</div>
          <div>
            <span style={{
              background: "#FFA50012",
              color: "#FFA500",
              borderRadius: 4,
              padding: "2px 10px",
              fontSize: 13,
              marginRight: 8
            }}>{evt.type.toUpperCase()}</span>
            {evt.tags.map(t =>
              <span key={t} style={{
                margin: "0 3px",
                background: "#383838",
                color: "#FF6600",
                fontSize: 12,
                borderRadius: 4,
                padding: "1.5px 7px"
              }}>{t}</span>
            )}
          </div>
          <div style={{ marginTop: 16, fontWeight: 700, fontSize: 18, color: "#FF8B4D" }}>
            ${evt.price}
          </div>
          {user && !user.admin && (
            <button className="btn btn-large" style={{ marginTop: 28 }} onClick={() => handleBook(evt)}>
              Book Ticket
            </button>
          )}
        </div>
      </div>
    );
  }

  // PUBLIC_INTERFACE
  function renderBookingModal(bookEvent) {
    if (!bookEvent) return null;
    return (
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 2050,
          background: "rgba(0,0,0,0.65)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
        onClick={() => setShowBooking(null)}
      >
        <div
          className="modal-content"
          style={{
            background: "#191919",
            padding: 32,
            borderRadius: 12,
            minWidth: 340,
            maxWidth: "92vw",
            boxShadow: "0 2px 16px 0 #000",
            position: "relative",
            textAlign: "center"
          }}
          onClick={e => e.stopPropagation()}
        >
          <button
            aria-label="close booking"
            style={{
              position: "absolute",
              right: 16,
              top: 10,
              border: "none",
              background: "transparent",
              color: "#ddd",
              fontSize: 22,
              cursor: "pointer"
            }}
            onClick={() => setShowBooking(null)}
          >×</button>
          <div style={{ fontSize: 24, color: "#FF6600", fontWeight: 600 }}>
            Book Ticket
          </div>
          <div style={{ color: "#fff", margin: "18px 0 7px 0", fontWeight: 500 }}>
            {bookEvent.name} @ <span style={{ color: "#FFA500" }}>{bookEvent.location}</span>
          </div>
          <div style={{ color: "#eea", marginBottom: 12 }}>{formatDate(bookEvent.date)}</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#FF8B4D" }}>${bookEvent.price}</div>
          <form onSubmit={e => { e.preventDefault(); completeBooking(bookEvent); }}>
            {/* Simple static form as placeholder */}
            <div style={{ margin: "20px 0" }}>
              <input required type="text" placeholder="Full Name"
                     style={{
                       padding: "9px 12px", borderRadius: 4, border: "1px solid #444",
                       background: "#242424", color: "#fff", fontSize: 15, width: "95%"
                     }} />
            </div>
            <div style={{ marginBottom: 18 }}>
              <input required type="email" placeholder="Email"
                     style={{
                       padding: "9px 12px", borderRadius: 4, border: "1px solid #444",
                       background: "#242424", color: "#fff", fontSize: 15, width: "95%"
                     }} />
            </div>
            {/* Payment fields placeholder */}
            <div
              style={{
                background: "#313131",
                borderRadius: 4,
                padding: "8px 10px",
                color: "#ffae5c",
                fontSize: 13,
                marginBottom: 12
              }}>
              Payment gateway integration coming soon! (demo only)
            </div>
            <button className="btn btn-large" type="submit">Confirm Booking</button>
          </form>
        </div>
      </div>
    );
  }

  // PUBLIC_INTERFACE
  function renderUserBookings() {
    if (!myBookings || myBookings.length === 0) {
      return (
        <div style={{ color: "#aaa", marginTop: 28 }}>You have no bookings yet.</div>
      );
    }
    return (
      <div style={{ marginTop: 18 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: "#ff8400", marginBottom: 10 }}>My Bookings</div>
        <div>
          {myBookings.map(b => (
            <div key={b.id}
              style={{
                background: "#232323",
                borderRadius: 6,
                padding: "15px 18px",
                marginBottom: 10,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10
              }}>
              <span>
                <span style={{ fontWeight: 600 }}>{b.event.name}</span>
                <span style={{ marginLeft: 10, color: "#ffa500" }}>${b.event.price}</span>
                <span style={{ marginLeft: 12, color: "#bbb" }}>{formatDate(b.event.date)}</span>
                <span style={{
                  marginLeft: 10,
                  background: "#383838",
                  borderRadius: 4,
                  color: "#FF6600",
                  fontSize: 11,
                  padding: "1.5px 7px"
                }}>{b.event.type.toUpperCase()}</span>
              </span>
              <button className="btn" style={{ background: "#E83941", fontSize: 14, padding: "7px 14px" }} onClick={() => handleCancelBooking(b.id)}>
                Cancel
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // PUBLIC_INTERFACE
  function renderAdminPanel() {
    return (
      <div style={{ background: "#101010", borderRadius: 12, padding: 38, margin: "58px auto", maxWidth: 650 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ fontSize: 25, fontWeight: 700, color: "#ff6600" }}>Admin Panel</div>
          <button className="btn" onClick={handleLogout}>Logout</button>
        </div>
        {/* Tabs */}
        <div style={{
          display: "flex", gap: 24, marginBottom: 14
        }}>
          <span
            style={{
              fontWeight: adminTab === "events" ? 600 : 400,
              color: adminTab === "events" ? "#FFA500" : "#fff",
              borderBottom: adminTab === "events" ? "2.5px solid #FFA500" : "none",
              paddingBottom: 3,
              cursor: "pointer"
            }}
            onClick={() => setAdminTab("events")}
          >Events/Travel Listings</span>
          <span
            style={{
              fontWeight: adminTab === "bookings" ? 600 : 400,
              color: adminTab === "bookings" ? "#FFA500" : "#fff",
              borderBottom: adminTab === "bookings" ? "2.5px solid #FFA500" : "none",
              paddingBottom: 3,
              cursor: "pointer"
            }}
            onClick={() => setAdminTab("bookings")}
          >All Bookings</span>
        </div>
        <div style={{ marginTop: 12 }}>
          {adminTab === "events" && (
            <div>
              {/* Event & Travel Listings Management (CRUD not implemented—placeholder only) */}
              <div style={{ fontSize: 17, color: "#ffe6a0", marginBottom: 7 }}>
                Create & manage event/travel listings (feature coming soon)
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 0, margin: "12px 0 0 0" }}>
                {FEATURED_MOCK_EVENTS.map(renderEventCard)}
              </div>
            </div>
          )}
          {adminTab === "bookings" && (
            <div>
              {/* Admin Booking Overview—Demo with user's current bookings */}
              <div style={{ fontSize: 17, color: "#ffe6a0", marginBottom: 7 }}>
                All user bookings (sample data)
              </div>
              <div>
                {myBookings.length === 0 ? (
                  <div style={{ color: "#aaa", marginTop: 15 }}>No bookings made.</div>
                ) : (
                  <ul>
                    {myBookings.map(b => (
                      <li key={b.id} style={{ marginBottom: 9, color: "#ff9a44", fontSize: 15 }}>
                        <b>{b.event.name}</b> ({b.event.type.toUpperCase()}) by DemoUser — {formatDate(b.event.date)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // MAIN RENDER
  if (!user) {
    // User not logged in: show login/register UI
    return (
      <div className="app">
        <nav className="navbar">
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <div className="logo">
                <img
                  src={require('./assets/logo.svg')}
                  alt="EventEase Logo"
                  className="logo-img"
                  style={{
                    width: 28,
                    height: 28,
                    marginRight: 8,
                    verticalAlign: "middle"
                  }}
                />
                EventEase
              </div>
              <div>
                <button className="btn" onClick={() => handleLoginRegister(false)}>Login / Register</button>
                <button className="btn" style={{ marginLeft: 14, background: "#333" }} onClick={() => handleLoginRegister(true)}>Admin</button>
              </div>
            </div>
          </div>
        </nav>
        <main>
          <div className="container">
            <div className="hero">
              <div className="subtitle">Modern Ticket Booking App</div>
              <h1 className="title" style={{ color: "#FF6600", fontWeight: 700 }}>EventEase</h1>
              <div className="description" style={{ color: "#bbb" }}>
                Streamline tickets for movies, travel, sports, concerts & events. Register or login to get started!
              </div>
              <button className="btn btn-large" onClick={() => handleLoginRegister(false)}>
                Try as Guest
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Admin Panel
  if (user.admin && adminPanel) {
    return (
      <div className="app">
        {renderAdminPanel()}
      </div>
    );
  }

  // Main User Panel
  return (
    <div className="app">
      {/* Navbar with category selection and profile menu */}
      <nav className="navbar">
        <div className="container">
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between"
          }}>
            <div className="logo" tabIndex={0} role="button" aria-label="Go Home" style={{ fontSize: 20 }}>
              <img
                src={require('./assets/logo.svg')}
                alt="EventEase Logo"
                className="logo-img"
                style={{
                  width: 28,
                  height: 28,
                  marginRight: 8,
                  verticalAlign: "middle"
                }}
              />
              EventEase
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              {CATEGORY_LIST.map(c => (
                <span
                  key={c.key}
                  className="nav-link"
                  aria-label={`Browse ${c.label}`}
                  onClick={() => setActiveCategory(c.key)}
                  style={{
                    color: activeCategory === c.key ? "#FFA500" : "#fff",
                    fontWeight: activeCategory === c.key ? 600 : 400,
                    fontSize: 17,
                    cursor: "pointer",
                    borderBottom: activeCategory === c.key ? "2px solid #FFA500" : "none",
                    marginRight: 4,
                    paddingBottom: 2
                  }}
                  tabIndex={0}
                  onKeyPress={e => {
                    if (e.key === "Enter") setActiveCategory(c.key);
                  }}
                >
                  {c.label}
                </span>
              ))}
            </div>
            <div style={{ marginLeft: 18 }}>
              <span style={{ color: "#FFA500", marginRight: 8 }}>Hi, {user.name}</span>
              <button className="btn" style={{ fontSize: 14, padding: "6px 12px" }} onClick={handleLogout}>
                Logout
              </button>
              {user && user.admin && (
                <button className="btn" style={{ marginLeft: 9, background: "#333" }}
                        onClick={() => setAdminPanel(true)}>Admin Panel</button>
              )}
            </div>
          </div>
        </div>
      </nav>
      {/* Main Content */}
      <main style={{ marginTop: 80, minHeight: "80vh" }}>
        <div className="container">
          {/* Search Bar and Filters */}
          <div style={{ display: "flex", gap: 12, margin: "8px 0 18px 0", alignItems: "center" }}>
            <input
              type="text"
              aria-label="Search events or travel"
              placeholder={`🔍 Search by name, location...`}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                padding: "10px 15px",
                borderRadius: 5,
                border: "1px solid #444",
                fontSize: 16,
                background: "#222",
                color: "#fff",
                width: 210
              }}
            />
            <input
              type="number"
              min="0"
              aria-label="Filter by maximum price"
              placeholder="Max Price ($)"
              style={{
                padding: "10px 10px",
                borderRadius: 5,
                border: "1px solid #444",
                fontSize: 15,
                background: "#222",
                color: "#fff",
                width: 105
              }}
              value={filter.price}
              onChange={e => setFilter(f => ({ ...f, price: e.target.value }))}
            />
            <input
              type="date"
              aria-label="Filter by date"
              style={{
                padding: "8px 8px",
                borderRadius: 5,
                border: "1px solid #444",
                fontSize: 15,
                background: "#222",
                color: "#fff"
              }}
              value={filter.date}
              onChange={e => setFilter(f => ({ ...f, date: e.target.value }))}
            />
            <button className="btn"
              style={{ padding: "9px 15px", marginLeft: 10 }}
              onClick={() => { setFilter({ price: "", date: "", time: "" }); setSearchTerm(""); }}
            >Clear</button>
          </div>
          {/* Featured Events */}
          <div style={{
            margin: "22px 0 12px 2px",
            fontSize: 22,
            fontWeight: 700,
            color: "#FFA500",
            letterSpacing: 0.2
          }}>
            Featured {CATEGORY_LIST.find(c => c.key === activeCategory)?.label}
          </div>
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            marginLeft: -5,
            gap: 0
          }}>
            {filteredEvents().length === 0
              ? (<div style={{ color: "#bbb", marginTop: 20, fontWeight: 500 }}>
                No results. Try another search or category.
              </div>)
              : filteredEvents().map(renderEventCard)}
          </div>
          {/* Details Modal/Card */}
          {renderEventDetailModal(showDetail)}
          {/* Booking Modal */}
          {renderBookingModal(showBooking)}
          {/* My Bookings Management */}
          {renderUserBookings()}
        </div>
      </main>
    </div>
  );
}

export default App;