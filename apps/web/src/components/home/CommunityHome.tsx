import { Avatar, Card } from "@heroui/react";
import { FiHeart, FiMessageCircle, FiShare2 } from "react-icons/fi";
import "../../styles/home.css";

interface CommunityHomeProps {
  name?: string;
  comment?: string;
  likes?: number;
  comments?: number;
  avatarLetter?: string;
}

function CommunityHome({
  name = "TitanFan2024",
  comment = "Can't wait for the next game! Who else is predicting a win?",
  likes = 234,
  comments = 45,
  avatarLetter = "T",
}: CommunityHomeProps) {
  return (
    <section className="community-home-wrapper" aria-label="Community preview">
      <Card className="community-home-card">
        <Card.Content className="community-home-content">
          <Avatar
            className="community-home-avatar"
            name={avatarLetter}
            showFallback
          />

          <div className="community-home-copy">
            <h3 className="community-home-name">{name}</h3>
            <p className="community-home-comment">{comment}</p>

            <div className="community-home-actions" aria-label="Post actions">
              <button type="button" className="community-home-action">
                <FiHeart className="community-home-action-icon" aria-hidden="true" />
                <span>{likes}</span>
              </button>

              <button type="button" className="community-home-action">
                <FiMessageCircle className="community-home-action-icon" aria-hidden="true" />
                <span>{comments}</span>
              </button>

              <button type="button" className="community-home-action community-home-action-share">
                <FiShare2 className="community-home-action-icon" aria-hidden="true" />
              </button>
            </div>
          </div>
        </Card.Content>
      </Card>
    </section>
  );
}

export default CommunityHome;
