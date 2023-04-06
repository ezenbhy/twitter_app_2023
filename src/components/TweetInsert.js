import { db, storage } from 'fbase';
import { addDoc, collection } from 'firebase/firestore';
import { ref,uploadString,getDownloadURL } from 'firebase/storage';
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "styles/tweetInsert.scss";

function TweetInsert({userObj}) {
  const [tweet, setTweet] = useState("");
  const [attachment, setAttachment] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      let attachmentUrl = "";
      if(attachment !== ""){
        const storageRef = ref(storage, `${userObj.uid}/${uuidv4()}`);
        const response = await uploadString(storageRef, attachment, 'data_url');
        console.log('response ->',response);
        attachmentUrl = await getDownloadURL(ref(storage, response.ref)); //https:
      }
      const docRef = await addDoc(collection(db, "tweets"), {
        text: tweet,
        createdAt: Date.now(),
        creatorId: userObj.uid,
        attachmentUrl
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    setTweet("");
    setAttachment("");
  }

  const onChange = e => {
    e.preventDefault();
    const {target: {value}} = e;
    setTweet(value);
  }

  const onFilechange = (e) => {
    console.log('e->',e);
    const {target: {files}} = e;
    
    const theFile = files[0];
    console.log('theFile->',theFile);//jpg
    
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      console.log('finishedEvent->',finishedEvent);
      const {currentTarget:{result}} = finishedEvent; //data:image
      setAttachment(result);
    }
    reader.readAsDataURL(theFile);
  }

  const onclearAttachment = () => {
    setAttachment("");
  }

  return (
    <form onSubmit={onSubmit} className="InsertForm">
      <div className='InsertInput__container'>
        <input type='text' placeholder="What's on your mind" value={tweet} onChange={onChange}
        maxLength={120} className='InsertInput__input'/>
        <input type='submit' value='&rarr;' className='InsertInput__arrow' />
      </div>
      <label htmlFor="attach-file" className='InsetInput__label'>
        <span>Add photos</span>
        <FontAwesomeIcon icon="fa-solid fa-plus" />
      </label>
      <input type='file' accept='image/*' onChange={onFilechange} 
            id='attach-file' style={{opacity:0}}/>
      {attachment && (
        <div className='Insertform__attachment'>
          <img src={attachment} style={{backgroundImage:attachment}} alt="" />
          <div className='Insertform__clear' onClick={onclearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon="fa-solid fa-xmark" />
          </div>
        </div>
      )}
    </form>
  )
}

export default TweetInsert