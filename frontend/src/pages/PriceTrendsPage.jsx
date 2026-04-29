import PageHero from '../components/PageHero';
import useApiData from '../hooks/useApiData';

function PriceTrendsPage() {
  const { data, isLoading, error } = useApiData('http://localhost:8000/api/content/price-trends', {
    items: [],
  });

  return (
    <div className="page-stack">
      <PageHero
        eyebrow="Component Specs & Price Trends"
        title="Theo dõi biến động giá linh kiện"
        description="Route riêng cho price trends giúp sau này gắn chart thật, lịch sử theo ngày và cảnh báo khi giá về ngưỡng mong muốn."
      />

      <section className="panel">
        {isLoading ? <p className="empty-state">Đang tải dữ liệu...</p> : null}
        {error ? <p className="empty-state">{error}</p> : null}
        <div className="stack-list">
          {data.items.map((item) => (
            <article className="info-card info-card--compact" key={item.name}>
              <div className="info-card__split">
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.note}</p>
                </div>
                <strong>{item.movement}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default PriceTrendsPage;
