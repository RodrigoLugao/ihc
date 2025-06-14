interface Props {
  imageUrl: string;
  title: string;
  text: string;
}

const Card = ({ imageUrl, title, text }: Props) => {
  return (
    <div className="card h-100 card-custom">
      <img src={imageUrl} className="card-img-top" alt={title} />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{text}</p>
      </div>
      {/* O overlay e o texto 'Ir' adicionados aqui */}
      <div className="card-overlay">
        <span className="card-overlay-text row">
            <span className="col-1 d-md-none"></span>
          <span className="col-9 col-md-12">
            Ir para "{title}" <i className="bi bi-chevron-right"></i>
          </span>
        </span>
      </div>
    </div>
  );
};

export default Card;
