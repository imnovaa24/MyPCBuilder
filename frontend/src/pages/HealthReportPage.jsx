import PageHero from '../components/PageHero';
import useApiData from '../hooks/useApiData';

function HealthReportPage() {
  const { data, isLoading, error } = useApiData('http://localhost:8000/api/content/health-report', {
    items: [],
  });

  return (
    <div className="page-stack">
      <PageHero
        eyebrow="Detailed Compatibility Health Report"
        title="Báo cáo tương thích tách riêng khỏi builder"
        description="Builder nên tập trung vào thao tác chọn linh kiện; còn route này dành cho phân tích sâu, cảnh báo và gợi ý nâng cấp."
      />

      <section className="panel">
        {isLoading ? <p className="empty-state">Đang tải dữ liệu...</p> : null}
        {error ? <p className="empty-state">{error}</p> : null}
        <div className="stack-list">
          {data.items.map((check) => (
            <article className="info-card info-card--compact" key={check.title}>
              <div className="info-card__split">
                <div>
                  <h3>{check.title}</h3>
                  <p>{check.detail}</p>
                </div>
                <span className={`status-badge ${check.status === 'Pass' ? 'status-badge--ok' : 'status-badge--warn'}`}>
                  {check.status}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HealthReportPage;
