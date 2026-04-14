import { useEffect, useState } from "react";
import { Card, Input, Button, Avatar } from "@heroui/react";
import { Icon } from "@iconify/react";
import { SignOutButton } from "../auth/Signout";

type ProfileData = {
  first_name: string;
  last_name: string;
  username: string;
};

type PersonalInfoProps = {
  profile: ProfileData | null;
  onSave?: (data: ProfileData) => void;
  onSignOut?: () => void;
};

export default function PersonalInfo({
  profile,
  onSave,
  onSignOut,
}: PersonalInfoProps) {
  const [formData, setFormData] = useState<ProfileData>({
    first_name: "",
    last_name: "",
    username: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        username: profile.username || "",
      });
    }
  }, [profile]);

  const handleChange = (field: keyof ProfileData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    await onSave?.(formData);
    };

  return (
    <div className="personal-info-section">
      <div className="personal-info-header">
        <h2>PERSONAL INFORMATION</h2>
        <p>Update your personal details and profile</p>
      </div>

      <Card className="personal-info-card">
        <div className="personal-info-card-body">
          <div className="profile-photo-row">
            <div className="photo-wrapper">
              <Avatar
                className="profile-avatar"
                size="lg"
              />
              <button className="photo-edit-btn" type="button">
                <Icon icon="solar:camera-bold" width={16} />
              </button>
            </div>

            <div className="photo-text">
              <h4>Change Photo</h4>
              <p>JPG, PNG or GIF. Max size 2MB</p>
            </div>
          </div>

          <div className="personal-divider" />

          <div className="personal-info-form">
            <div className="input-group">
                <label className="input-label">FIRST NAME</label>
                <Input
                className="personal-input"
                placeholder="First name"
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData((prev) => ({ ...prev, first_name: e.target.value }))}
                />
            </div>

            <div className="input-group">
                <label className="input-label">LAST NAME</label>
                <Input
                className="personal-input"
                placeholder="Last name"
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData((prev) => ({ ...prev, last_name: e.target.value }))}
                />
            </div>

            <div className="input-group full-width">
                <label className="input-label">USERNAME</label>
                <Input
                className="personal-input"
                placeholder="Username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                />
            </div>
            </div>

          <div className="personal-info-actions">
            <Button className="save-btn" onPress={handleSubmit}>
                <Icon icon="solar:diskette-bold" width={18} />
                <span>Save Changes</span>
            </Button>

            <div className="signout-wrapper">
                <SignOutButton />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}