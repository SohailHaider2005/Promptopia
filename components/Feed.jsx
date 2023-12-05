'use client'
import React from 'react'
import { useState, useEffect } from 'react';
import PromptCard from './PromptCard';
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";



const PromptCardList = ({ data, handleTagClick}) => {
  return (
    <div className='mt-16 prompt_layout'>
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}   
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const router = useRouter();
  const [allPosts, setAllPosts] = useState([]);
  const { data: session } = useSession();

    // Search states
    const [searchText, setSearchText] = useState("");
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [searchedResults, setSearchedResults] = useState([]);

  const fetchAllPosts = async() =>{
    try {
      const response = await fetch('/api/prompt')
      const data = await response.json()
      setAllPosts(data)
      console.log(data);
    } catch (error) {
    }
  }

  useEffect(() => {
    fetchAllPosts()
  }, [])

  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext, "i"); // 'i' flag for case-insensitive search
    return allPosts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    );
  };
   
  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value);
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  const handleTagClick = (tag) => {
    setSearchText(tag);
    const searchResult = filterPrompts(tag);
    setSearchedResults(searchResult);
  };

 

  return (
    <section className='feed'>
      <form className='relative w-full flex-center'>
        <input
          type='text'
          placeholder='Search for a tag or a username'
          value={searchText}
          onChange={handleSearchChange}
          required
          className='search_input peer'
        />
      </form>

      {/* All Prompts */}
      {session?.user ? (
  searchText ? (
    <PromptCardList
      data={searchedResults}
      handleTagClick={handleTagClick}
    />
  ) : (
    <PromptCardList data={allPosts} />
  )
) : (
  null // or any other fallback, e.g., an empty string or another component
)}

    </section>
  )
}

export default Feed
