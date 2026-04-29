import PageHero from '../components/PageHero';
import useApiData from '../hooks/useApiData';

function GuidesPage() {
  const { data, isLoading, error } = useApiData('http://localhost:8000/api/content/guides', {
    items: [],
  });

  return (
    <div className="page-stack">
      <PageHero
        eyebrow="PC Reference Home Guides"
        title="Khu vực hướng dẫn được tách khỏi builder"
        description="Trang này đại diện cho nhóm nội dung tham khảo, phù hợp để mở rộng thành bài viết chi tiết hoặc bộ lọc theo chủ đề."
      />

      <section className="panel">
        {isLoading ? <p className="empty-state">Đang tải dữ liệu...</p> : null}
        {error ? <p className="empty-state">{error}</p> : null}
        <div className="card-grid card-grid--three">
          {data.items.map((guide) => (
            <article className="info-card" key={guide.title}>
              <span className="pill pill--muted">{guide.tag}</span>
              <h3>{guide.title}</h3>
              <p>{guide.description}</p>
              <a href={guide.href} className="inline-link">Đọc tiếp</a>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default GuidesPage;
