import Layout from "../components/Layout";

function DashboardPage() {

  const stats = [
  ];

  return (

    <Layout title="Dashboard">

      <div className="dashboard-grid">

        {stats.map(
          (
            item,
            index
          ) => (

            <div
              key={index}
              className="stats-card"
            >

              <h3>
                {item.title}
              </h3>

              <h1>
                {item.value}
              </h1>

            </div>
          )
        )}

      </div>

      <div className="welcome-card">

        <h2>
          QSHE Industrial Platform
        </h2>

        <p>

          Manage industrial audits,
          equipment inspections,
          APR generation,
          safety monitoring
          and compliance reporting
          from a centralized platform.

        </p>

      </div>

    </Layout>
  );
}

export default DashboardPage;