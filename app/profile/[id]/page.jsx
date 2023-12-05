"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Profile from '@components/Profile'

const MyProfile = () => {
    const params = useParams()
    const router = useRouter();
  const { data: session } = useSession();
  const [myPosts, setMyPosts] = useState([]);

  const handleEdit = (post) =>{
    router.push(`/update-prompt?id=${post._id}`)
  }

  const handleDelete = async (post) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompt?"
    );
    if (hasConfirmed) {
      try {
        //Delete from backend database
        await fetch(`/api/prompt/${post._id.toString()}`, {
          method: "DELETE",
        });
        //Delete from frontend 
        const filteredPosts = myPosts.filter((item) => item._id !== post._id);

        setMyPosts(filteredPosts);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${params?.id}/posts`);
      const data = await response.json();
      setMyPosts(data);
    };

    if (params?.id) fetchPosts();
  }, [params?.id]);
  
  return (
    <>
      <Profile
      name= {myPosts[0]?.creator?.username}
      desc='Welcome to your personalized profile page. Share your exceptional prompts and inspire others with the power of your imagination'
      data={myPosts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
    </>
  )
}

export default MyProfile
