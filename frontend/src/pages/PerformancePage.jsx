import PageHero from '../components/PageHero';
import useApiData from '../hooks/useApiData';

function PerformancePage() {
  const { data, isLoading, error } = useApiData('http://localhost:8000/api/content/performance', {
    items: [],
  });

  return (
    <div className="page-stack">
      <PageHero
        eyebrow="PC Performance Simulation Dashboard"
        title="Dashboard mô phỏng hiệu năng"
        description="Trang này dành cho benchmark, FPS và các kịch bản workload, tách biệt khỏi phần chọn linh kiện để điều hướng rõ ràng hơn."
      />

      <section className="panel">
        {isLoading ? <p className="empty-state">Đang tải dữ liệu...</p> : null}
        {error ? <p className="empty-state">{error}</p> : null}
        <div className="card-grid card-grid--three">
          {data.items.map((scenario) => (
            <article className="info-card" key={scenario.title}>
              <span className="pill">{scenario.title}</span>
              <h3>{scenario.fps}</h3>
              <p>{scenario.note}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default PerformancePage;
