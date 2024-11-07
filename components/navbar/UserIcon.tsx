import { LuUser2 } from "react-icons/lu";
// import { fetchProfileImage } from '@/utils/actions';
async function UserIcon() {
  // TODO (@hudsonn): implement profile image fetching
  // const profileImage = await fetchProfileImage();
  const profileImage = "";
  if (profileImage) {
    return <img src={profileImage} className="w-6 h-6 rounded-full object-cover" />;
  }
  return <LuUser2 className="w-6 h-6 bg-primary rounded-full text-white" />;
}
export default UserIcon;
