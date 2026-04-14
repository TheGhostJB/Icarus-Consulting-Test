import { useEffect, useState } from "react";
import { Auth } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";
import SidebarMenu from "../components/Profile/SidebarMenu";
import PersonalInfo from "../components/Profile/PersonalInfo";
import Addresses from "../components/Profile/Addresses";
import Badges from "../components/Profile/Badges";
import "../styles/profile.css";
import AddressModal from "../components/Profile/AddressModal";

import {
  getMyAddresses,
  createMyAddress,
  updateMyAddress,
  deleteMyAddress,
  updateMyProfile,
  getMyBadges,
  type Address,
  type AddressPayload,
  type UpdateProfilePayload,
  type UserBadge,
} from "../services/profile";


function ProfilePage() {
  const { session } = Auth();
  
  const [activeTab, setActiveTab] = useState<string>("personal");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [isLoadingBadges, setIsLoadingBadges] = useState(false);
  const [badgesError, setBadgesError] = useState<string | null>(null);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [addressesError, setAddressesError] = useState<string | null>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await fetch("http://localhost:8081/profile/me", {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      const data = await res.json();

      if (data.status === "success") {
        setProfile(data.profile);
      } else {
        console.error(data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadAddresses = async () => {
    try {
      setIsLoadingAddresses(true);
      setAddressesError(null);

      const data = await getMyAddresses();
      setAddresses(data);
    } catch (error) {
      console.error("Error loading addresses:", error);
      setAddressesError("Could not load addresses");
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const handleRemoveAddress = async (addressId: number) => {
    try {
        const confirmDelete = confirm("Are you sure you want to delete this address?");
        if (!confirmDelete) return;

        console.log("Deleting address with id:", addressId);

        const deletedId = await deleteMyAddress(addressId);
        console.log("Deleted successfully:", deletedId);

        setAddresses((prev) =>
        prev.filter((address) => address.address_id !== deletedId)
        );
    } catch (error) {
        console.error("Error deleting address:", error);
    }
    };

  const handleCreateAddress = async (payload: AddressPayload) => {
    try {
        const newAddress = await createMyAddress(payload);

        if (newAddress.is_default) {
        setAddresses((prev) => [
            newAddress,
            ...prev.map((address) => ({
            ...address,
            is_default: false,
            })),
        ]);
        } else {
        setAddresses((prev) => [...prev, newAddress]);
        }
    } catch (error) {
        console.error("Error creating address:", error);
        throw error;
    }
    };

  const handleSaveProfile = async (formData: {
    first_name: string;
    last_name: string;
    username: string;
    }) => {
    try {
        const payload: UpdateProfilePayload = {
        first_name: formData.first_name?.trim() || null,
        last_name: formData.last_name?.trim() || null,
        username: formData.username?.trim() || null,
        country: profile?.country || null,
        avatar_url: profile?.avatar_url || null,
        };

        const updatedProfile = await updateMyProfile(payload);
        setProfile(updatedProfile);

        console.log("Profile updated successfully");
    } catch (error) {
        console.error("Error updating profile:", error);
        alert("Could not update profile.");
    }
    };

  const handleUpdateAddress = async (
    addressId: number,
    payload: AddressPayload
  ) => {
    try {
      const updatedAddress = await updateMyAddress(addressId, payload);

      setAddresses((prev) =>
        prev.map((address) => {
          if (updatedAddress.is_default) {
            if (address.address_id === updatedAddress.address_id) {
              return updatedAddress;
            }

            return {
              ...address,
              is_default: false,
            };
          }

          return address.address_id === updatedAddress.address_id
            ? updatedAddress
            : address;
        })
      );
    } catch (error) {
      console.error("Error updating address:", error);
    }
  };

  const loadBadges = async () => {
    try {
        setIsLoadingBadges(true);
        setBadgesError(null);

        const data = await getMyBadges();
        setBadges(data);
    } catch (error) {
        console.error("Error loading badges:", error);
        setBadgesError("Could not load badges");
    } finally {
        setIsLoadingBadges(false);
    }
    };

  useEffect(() => {
    if (session) {
      fetchProfile();
      loadAddresses();
      loadBadges();
    } else {
      setLoading(false);
    }
  }, [session]);

  const openAddModal = () => {
    setIsAddressModalOpen(true);
    };

  const closeAddModal = () => {
    setIsAddressModalOpen(false);
    };

  if (loading) {
    return (
      <div className="profile-page">
        <main className="profile-container">
          <Navbar />
          <div className="profile-page-wrapper">
            <p>Loading profile...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <main className="profile-container">
        <Navbar />

        <section className="profile-header">
          <h1 className="profile-title">MY PROFILE</h1>
          <p className="profile-subtitle">
            Manage your account, preferences, and fan achievements
          </p>
        </section>

        <section className="profile-layout">
          <SidebarMenu
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <div className="profile-content">
            {activeTab === "personal" && (
              <PersonalInfo profile={profile}
                            onSave={handleSaveProfile} />
            )}

            {activeTab === "addresses" && (
              <Addresses
                addresses={addresses}
                onAddAddress={openAddModal}
                onRemoveAddress={handleRemoveAddress}
              />
              
            )}

            {activeTab === "badges" && <Badges
                badges={badges}
                isLoading={isLoadingBadges}
                error={badgesError}
            />}
          </div>
        </section>
      </main>
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={closeAddModal}
        onSubmit={handleCreateAddress}
        />
    </div>
  );
}

export default ProfilePage;