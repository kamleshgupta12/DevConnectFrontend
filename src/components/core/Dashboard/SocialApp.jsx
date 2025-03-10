import { useEffect, useState } from "react";
import { RiEditBoxLine } from "react-icons/ri";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import IconBtn from "../../common/IconBtn";
import axios from "axios";

const socialPlatforms = {
  Facebook: { icon: <FaFacebook className="text-[#1877F2]" />, url: "https://www.facebook.com/" },  // Facebook Blue
  Twitter: { icon: <FaTwitter className="text-[#1DA1F2]" />, url: "https://twitter.com/" },        // Twitter Blue
  Instagram: { icon: <FaInstagram className="text-[#E4405F]" />, url: "https://www.instagram.com/" }, // Instagram Pink
  LinkedIn: { icon: <FaLinkedin className="text-[#0077B5]" />, url: "https://www.linkedin.com/in/" }, // LinkedIn Blue
};

export default function SocialApp({ userId, user, onSave = () => {} }) {
  const [editing, setEditing] = useState(false);
  const [socialLinks, setSocialLinks] = useState(user?.additionalDetails?.socialLinks || {});

//   const handleSave = () => {
//     onSave(socialLinks);
//     setEditing(false);
    
//   };

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/social/get-link/${userId}`);
        setSocialLinks(res.data.socialLinks);
      } catch (err) {
        console.log("Failed to load social links");
      } 
    };

    fetchSocialLinks();
  }, [userId]);

  // Save Updated Social Links
  const handleSave = async () => {
    setEditing(false);
    try {
      await axios.put(`${process.env.REACT_APP_BASE_URL}/social/update-link/${userId}`, { socialLinks });
    } catch (err) {
      console.log("Error updating social links");
    } 
}

  return (
    <div className="my-10 flex flex-col gap-y-10 rounded-md border border-richblack-700 bg-richblack-800 p-8 px-12">
      <div className="flex w-full items-center justify-between">
        <p className="text-lg font-semibold text-richblack-5">Social Media</p>
        <IconBtn text={editing ? "Save" : "Edit"} onclick={editing ? handleSave : () => setEditing(true)}>
          <RiEditBoxLine />
        </IconBtn>
      </div>
      <div className="space-y-4">
        {Object.entries(socialPlatforms).map(([platform, { icon, url }]) => (
          <div key={platform} className="flex items-center text-3xl gap-x-4">
            {icon}
            {editing ? (
              <input
                type="text"
                value={socialLinks[platform] || ""}
                onChange={(e) => setSocialLinks({ ...socialLinks, [platform]: e.target.value })}
                className="text-sm font-medium text-richblack-5 bg-transparent border border-richblack-600 p-2 rounded-md"
                placeholder={`Enter ${platform} username`}
              />
            ) : (
              socialLinks[platform] ? (
                <a
                  href={`${url}${socialLinks[platform]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm  font-bold text-blue-400"
                >
                  {platform}
                </a>
              ) : (
                <span className="text-[15px] font-bold text-richblack-100">{platform}</span>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
