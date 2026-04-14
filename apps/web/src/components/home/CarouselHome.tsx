import { useEffect, useState } from "react";
import { Button, Card } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import "../../styles/home.css";

export interface CarouselSlide {
  id: string;
  title: string;
  subtitle: string;
  buttonLabel: string;
  route: string;
  backgroundImage: string;
}

const DEFAULT_SLIDES: CarouselSlide[] = [
  {
    id: "community",
    title: "Conecta Con La Comunidad",
    subtitle:
      "Descubre conversaciones, novedades y espacios para compartir la pasion por el equipo con otros fans.",
    buttonLabel: "Ir a Comunidad",
    route: "/community",
    backgroundImage:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "cards",
    title: "Explora Tus Cartas",
    subtitle:
      "Accede a la coleccion del equipo, revisa jugadores destacados y vive una experiencia visual mas inmersiva.",
    buttonLabel: "Ver Cartas",
    route: "/team",
    backgroundImage:
      "https://images.unsplash.com/photo-1508098682722-e99c643e7485?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "voice-agent",
    title: "Habla Con El Agente De Voz",
    subtitle:
      "Inicia una experiencia conversacional para recibir ayuda, informacion del equipo y respuestas en tiempo real.",
    buttonLabel: "Abrir Agente",
    route: "/voice-agent",
    backgroundImage:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
  },
];

interface CarouselHomeProps {
  slides?: CarouselSlide[];
  autoPlayInterval?: number;
}

function CarouselHome({
  slides = DEFAULT_SLIDES,
  autoPlayInterval = 5000,
}: CarouselHomeProps) {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length);
    }, autoPlayInterval);

    return () => window.clearInterval(intervalId);
  }, [autoPlayInterval, slides.length]);

  if (slides.length === 0) {
    return null;
  }

  const activeSlide = slides[activeIndex];

  function goToSlide(index: number) {
    setActiveIndex(index);
  }

  function showPreviousSlide() {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? slides.length - 1 : currentIndex - 1,
    );
  }

  function showNextSlide() {
    setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length);
  }

  return (
    <section className="carousel-home-wrapper" aria-label="Carrusel principal del inicio">
      <Card
        className="carousel-home-card"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(6, 16, 35, 0.88), rgba(11, 42, 85, 0.55)), url(${activeSlide.backgroundImage})`,
        }}
      >
        <Card.Content className="carousel-home-card-body">

          <div className="carousel-home-middle-row">
            <button
              type="button"
              aria-label="Slide anterior"
              onClick={showPreviousSlide}
              className="carousel-home-arrow-button"
            >
              {"<"}
            </button>

            <div className="carousel-home-content">
              <p className="carousel-home-kicker">Experiencias Titans</p>
              <h2 className="carousel-home-title">{activeSlide.title}</h2>
              <p className="carousel-home-subtitle">{activeSlide.subtitle}</p>

              <Button
                size="lg"
                onPress={() => navigate(activeSlide.route)}
                className="carousel-home-cta-button"
              >
                {activeSlide.buttonLabel}
              </Button>
            </div>

            <button
              type="button"
              aria-label="Siguiente slide"
              onClick={showNextSlide}
              className="carousel-home-arrow-button"
            >
              {">"}
            </button>
          </div>
          <div className="carousel-home-top-row">
            <div className="carousel-home-dots-row" aria-label="Navegacion del carrusel">
              {slides.map((slide, index) => {
                const isActive = index === activeIndex;

                return (
                  <button
                    key={slide.id}
                    type="button"
                    aria-label={`Ir a ${slide.title}`}
                    aria-pressed={isActive}
                    onClick={() => goToSlide(index)}
                    className={`carousel-home-dot ${isActive ? "carousel-home-dot-active" : ""}`}
                  />
                );
              })}
            </div>
          </div>
        </Card.Content>
      </Card>
    </section>
  );
}

export default CarouselHome;
