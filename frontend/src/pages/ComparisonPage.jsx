import PageHero from '../components/PageHero';
import useApiData from '../hooks/useApiData';

function ComparisonPage() {
  const { data, isLoading, error } = useApiData('http://localhost:8000/api/content/comparison', {
    left: { brand: '', name: '' },
    right: { brand: '', name: '' },
    rows: [],
  });

  return (
    <div className="page-stack">
      <PageHero
        eyebrow="Technical Component Comparison"
        title="Trang so sánh linh kiện chuyên biệt"
        description="Tách riêng route so sánh giúp bạn phát triển bảng benchmark, filter và chia sẻ link cho từng cặp linh kiện."
      />

      <section className="panel">
        {isLoading ? <p className="empty-state">Đang tải dữ liệu...</p> : null}
        {error ? <p className="empty-state">{error}</p> : null}
        <div className="comparison-header">
          <div>
            <span className="pill">{data.left.brand}</span>
            <h2>{data.left.name}</h2>
          </div>
          <div className="comparison-versus">vs</div>
          <div>
            <span className="pill pill--muted">{data.right.brand}</span>
            <h2>{data.right.name}</h2>
          </div>
        </div>

        <div className="comparison-table">
          {data.rows.map((row) => (
            <div className="comparison-table__row" key={row.label}>
              <strong>{row.left}</strong>
              <span>{row.label}</span>
              <strong>{row.right}</strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ComparisonPage;
