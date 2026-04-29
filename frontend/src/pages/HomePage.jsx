import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import useApiData from '../hooks/useApiData';

function HomePage() {
  const { data, isLoading, error } = useApiData('http://localhost:8000/api/content/home', {
    featuredBuilds: [],
    guideCards: [],
  });

  return (
    <div className="page-stack">
      <PageHero
        eyebrow="PC Build Reference Home"
        title="Tách các màn tham chiếu thành app nhiều route rõ ràng"
        description="Trang chủ này gom các hướng dẫn, công cụ builder và dashboard tham khảo thành một luồng điều hướng thống nhất thay vì dồn toàn bộ UI vào một file."
        actions={
          <>
            <Link className="button button--primary" to="/builder">
              Mở builder
            </Link>
            <Link className="button button--ghost" to="/guides">
              Xem guides
            </Link>
          </>
        }
      />

      <section className="panel">
        <div className="section-heading">
          <h2>Popular configurations</h2>
          <Link to="/comparison" className="inline-link">
            So sánh GPU
          </Link>
        </div>
        {isLoading ? <p className="empty-state">Đang tải dữ liệu...</p> : null}
        {error ? <p className="empty-state">{error}</p> : null}
        <div className="card-grid card-grid--three">
          {data.featuredBuilds.map((build) => (
            <article className="info-card" key={build.name}>
              <span className="pill">{build.category}</span>
              <h3>{build.name}</h3>
              <p>{build.description}</p>
              <strong>{build.budget}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="panel panel--accent">
        <div className="section-heading">
          <h2>Reference guides</h2>
          <Link to="/guides" className="inline-link">
            Xem tất cả
          </Link>
        </div>
        <div className="card-grid card-grid--three">
          {data.guideCards.map((guide) => (
            <article className="info-card" key={guide.title}>
              <span className="pill pill--muted">{guide.tag}</span>
              <h3>{guide.title}</h3>
              <p>{guide.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
