import {
  Link,
  useLocation,
} from "react-router-dom";

function Layout({
  children,
  title,
}) {

  const location =
    useLocation();

  const menuItems = [

    {
      name: "Collecte de données",
      path: "/create-audit",
    },

    {
      name: "Données Collectées",
      path: "/saved-audits",
    },

    {
      name: "Générer APR",
      path: "/apr",
    },

    {
      name: "Rapports APR",
      path: "/apr-reports",
    },

  ];

  const logout = () => {

    localStorage.removeItem(
      "token"
    );

    window.location.href = "/";
  };

  return (

    <div className="app-layout">

      {/* SIDEBAR */}

      <div className="sidebar">

        <div className="sidebar-top">

  <img
    src="/best.png"
    alt="BEST Logo"
    className="sidebar-logo"
  />

  <h1 className="brand">
    BEST SARL
  </h1>

  <p className="brand-subtitle">
    Digital Audit Platform
  </p>

</div>

        <div className="sidebar-menu">

          {menuItems.map(
            (item) => (

              <Link
                key={item.path}
                to={item.path}
                className={
                  location.pathname === item.path
                    ? "sidebar-link active-sidebar-link"
                    : "sidebar-link"
                }
              >

                {item.name}

              </Link>
            )
          )}

        </div>

        <div className="sidebar-bottom">

          <button
            className="logout-btn"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </div>

      {/* MAIN CONTENT */}

      <div className="main-layout">

        {/* TOPBAR */}

        <div className="topbar">

          <div>

            <h1 className="page-title">
              {title}
            </h1>
          </div>

          <div className="topbar-user">

            <div className="user-avatar">
              best.png
            </div>

          </div>

        </div>

        {/* PAGE CONTENT */}

        <div className="layout-content">

          {children}

        </div>

      </div>

    </div>
  );
}

export default Layout;