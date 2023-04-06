import React, { useEffect, useState } from 'react';
import { collection, addDoc , getDocs, onSnapshot , query , orderBy} from "firebase/firestore";
import { db, storage} from 'fbase';
import Tweet from 'components/Tweet';
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import TweetInsert from 'components/TweetInsert';

function Home({userObj}) {
  console.log('userObj ->', userObj);
  const [tweets, setTweets] = useState([]);

  /* const getTweets = async () => {
    const querySnapshot = await getDocs(collection(db, "tweets"));
    querySnapshot.forEach((doc) => {
      //console.log(`${doc.id} => ${doc.data()}`);
      const tweetObject = {...doc.data(), id:doc.id }
      setTweets(prev => [tweetObject, ...prev]);//새 트윗을 가장 먼저 보여준다.
    });
  } */
  
  useEffect(() => {
    //getTweets();
    const q = query(collection(db, "tweets"),
                  orderBy("createdAt","desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newArray = [];
      querySnapshot.forEach((doc) => {
        newArray.push({...doc.data(), id:doc.id });
        console.log(newArray); 
      });
      setTweets(newArray);
    });
  },[]);

  return (
    <div className='container'>
      <TweetInsert userObj={userObj}/>
      <div>
        {tweets.map(tweet => (
          // <div key={tweet.id}>
          //   <h4>{tweet.text}</h4>
          // </div> 
          <Tweet key={tweet.id} tweetObj={tweet} isOwner={tweet.creatorId  === userObj.uid} />
        ))}
      </div>
      <footer>&copy; {new Date().getFullYear()} Twitter app</footer>
    </div>
  )
}

export default Home