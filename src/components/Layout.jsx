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
      name: "Dashboard",
      path: "/dashboard",
    },

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

          <h2 className="brand">
            QSHE PRO
          </h2>

          <p className="brand-subtitle">
            Industrial Safety Platform
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

            <p className="page-subtitle">
              QSHE Digital Management System
            </p>

          </div>

          <div className="topbar-user">

            <div className="user-avatar">
              QS
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