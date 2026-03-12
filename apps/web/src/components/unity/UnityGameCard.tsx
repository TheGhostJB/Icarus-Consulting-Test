import UnityGameEmbed, { type UnityGameEmbedProps } from "./UnityGameEmbed";

interface UnityGameCardProps {
  unityConfig: UnityGameEmbedProps;
}

function UnityGameCard({ unityConfig }: UnityGameCardProps) {
  return (
    <section className="unity-game-card">
      <header className="unity-game-card-header">
        <p className="unity-game-card-kicker">UNITY WEBGL</p>
        <h2 className="unity-game-card-title">Off-Season Challenge</h2>
        <p className="unity-game-card-copy">
          Juego embebido con puente TypeScript para Joy-Con por WebHID
        </p>
      </header>

      <UnityGameEmbed {...unityConfig} />
    </section>
  );
}

export default UnityGameCard;
