'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import Textbox from '../components/Textbox';
import { doc, setDoc } from 'firebase/firestore';
import { useSwipeable } from 'react-swipeable';
import RidePage from '../ride/page';

export default function Login() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');
  const [isNameSaved, setIsNameSaved] = useState(false);
  const [isYearSaved, setIsYearSaved] = useState(false);
  const [isMajorSaved, setIsMajorSaved] = useState(false);
  const [isDreamVacationSaved, setIsDreamVacationSaved] = useState(false);
  const [isInstagramSaved, setIsInstagramSaved] = useState(false);
  const [currentView, setCurrentView] = useState('name'); // 'name', 'year', 'major', 'dream-vacation', 'instagram', 'welcome', or 'ride'
  const [textboxKey, setTextboxKey] = useState(0);

  const handleGoogleAuth = async (isSignUp: boolean) => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log(isSignUp ? 'User signed up:' : 'User logged in:', user);
      setIsLoggedIn(true);
      setUserId(user.uid);
    } catch (error) {
      console.error('Error during Google authentication:', error);
    }
  };

  const handleSave = async (text: string): Promise<boolean> => {
    if (!userId) return false;
    try {
      await setDoc(doc(db, 'users', userId), {
        name: text,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      console.log('Name saved to Firestore');
      setIsNameSaved(true);
      return true;
    } catch (error) {
      console.error('Error saving name to Firestore:', error);
      return false;
    }
  };

  const handleYearSave = async (text: string): Promise<boolean> => {
    if (!userId) return false;
    try {
      await setDoc(doc(db, 'users', userId), {
        year: text,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      console.log('Year saved to Firestore');
      setIsYearSaved(true);
      return true;
    } catch (error) {
      console.error('Error saving year to Firestore:', error);
      return false;
    }
  };

  const handleMajorSave = async (text: string): Promise<boolean> => {
    if (!userId) return false;
    try {
      await setDoc(doc(db, 'users', userId), {
        major: text,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      console.log('Major saved to Firestore');
      setIsMajorSaved(true);
      return true;
    } catch (error) {
      console.error('Error saving major to Firestore:', error);
      return false;
    }
  };

  const handleDreamVacationSave = async (text: string): Promise<boolean> => {
    if (!userId) return false;
    try {
      await setDoc(doc(db, 'users', userId), {
        dreamVacation: text,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      console.log('Dream vacation saved to Firestore');
      setIsDreamVacationSaved(true);
      return true;
    } catch (error) {
      console.error('Error saving dream vacation to Firestore:', error);
      return false;
    }
  };

  const handleInstagramSave = async (text: string): Promise<boolean> => {
    if (!userId) return false;
    try {
      await setDoc(doc(db, 'users', userId), {
        instagram: text,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      console.log('Instagram handle saved to Firestore');
      setIsInstagramSaved(true);
      return true;
    } catch (error) {
      console.error('Error saving Instagram handle to Firestore:', error);
      return false;
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentView === 'name' && isNameSaved) {
        setCurrentView('year');
        setTextboxKey(prev => prev + 1);
      } else if (currentView === 'year' && isYearSaved) {
        setCurrentView('major');
        setTextboxKey(prev => prev + 1);
      } else if (currentView === 'major' && isMajorSaved) {
        setCurrentView('dream-vacation');
        setTextboxKey(prev => prev + 1);
      } else if (currentView === 'dream-vacation' && isDreamVacationSaved) {
        setCurrentView('instagram');
        setTextboxKey(prev => prev + 1);
      } else if (currentView === 'instagram' && isInstagramSaved) {
        setCurrentView('welcome');
      } else if (currentView === 'welcome') {
        setCurrentView('ride');
      }
    },
    onSwipedRight: () => {
      if (currentView === 'year') {
        setCurrentView('name');
        setTextboxKey(prev => prev + 1);
      } else if (currentView === 'major') {
        setCurrentView('year');
        setTextboxKey(prev => prev + 1);
      } else if (currentView === 'dream-vacation') {
        setCurrentView('major');
        setTextboxKey(prev => prev + 1);
      } else if (currentView === 'instagram') {
        setCurrentView('dream-vacation');
        setTextboxKey(prev => prev + 1);
      } else if (currentView === 'welcome') {
        setCurrentView('instagram');
      } else if (currentView === 'ride') {
        setCurrentView('welcome');
      }
    },
    trackMouse: true
  });

  useEffect(() => {
    // Reset the appropriate saved state when changing views
    if (currentView === 'name') {
      setIsYearSaved(false);
      setIsMajorSaved(false);
      setIsDreamVacationSaved(false);
      setIsInstagramSaved(false);
    } else if (currentView === 'year') {
      setIsNameSaved(false);
      setIsMajorSaved(false);
      setIsDreamVacationSaved(false);
      setIsInstagramSaved(false);
    } else if (currentView === 'major') {
      setIsNameSaved(false);
      setIsYearSaved(false);
      setIsDreamVacationSaved(false);
      setIsInstagramSaved(false);
    } else if (currentView === 'dream-vacation') {
      setIsNameSaved(false);
      setIsYearSaved(false);
      setIsMajorSaved(false);
      setIsInstagramSaved(false);
    } else if (currentView === 'instagram') {
      setIsNameSaved(false);
      setIsYearSaved(false);
      setIsMajorSaved(false);
      setIsDreamVacationSaved(false);
    }
  }, [currentView]);

  const handleManualScroll = () => {
    if (currentView === 'welcome') {
      setCurrentView('ride');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FBFEF9]">
      <div className="relative" {...handlers}>
        {!isLoggedIn ? (
          <>
            <Image src="/assets/sign-in.png" alt="Sign In" width={500} height={300} />
            <div className="absolute bottom-20 left-0 right-0 flex flex-col items-center">
              <button className="mb-3 scale-125 -translate-x-1 -translate-y-12" onClick={() => handleGoogleAuth(false)}>
                <Image src="/assets/continue-with-google.png" alt="Continue with Google" width={240} height={65} />
              </button>
              <button className="scale-125 -translate-x-1 translate-y-5" onClick={() => handleGoogleAuth(true)}>
                <Image src="/assets/sign-up-with-google.png" alt="Sign up with Google" width={240} height={65} />
              </button>
            </div>
          </>
        ) : (
          <>
            {currentView === 'name' && (
              <>
                <Image src="/assets/full-name.png" alt="Full Name" width={500} height={300} />
                <div className="absolute top-[59%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Textbox key={textboxKey} onSave={handleSave} placeholder="enter name here" isSaved={isNameSaved} />
                </div>
              </>
            )}
            {currentView === 'year' && (
              <>
                <Image src="/assets/year.png" alt="Year" width={500} height={300} />
                <div className="absolute top-[59%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Textbox key={textboxKey} onSave={handleYearSave} placeholder="enter year here" isSaved={isYearSaved} />
                </div>
              </>
            )}
            {currentView === 'major' && (
              <>
                <Image src="/assets/major.png" alt="Major" width={500} height={300} />
                <div className="absolute top-[59%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Textbox key={textboxKey} onSave={handleMajorSave} placeholder="enter major here" isSaved={isMajorSaved} />
                </div>
              </>
            )}
            {currentView === 'dream-vacation' && (
              <>
                <Image src="/assets/dream-vacation.png" alt="Dream Vacation" width={500} height={300} />
                <div className="absolute top-[59%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Textbox key={textboxKey} onSave={handleDreamVacationSave} placeholder="enter dream vacation here" isSaved={isDreamVacationSaved} />
                </div>
              </>
            )}
            {currentView === 'instagram' && (
              <>
                <Image src="/assets/instagram.png" alt="Instagram" width={500} height={300} />
                <div className="absolute top-[59%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Textbox key={textboxKey} onSave={handleInstagramSave} placeholder="enter Instagram handle here" isSaved={isInstagramSaved} />
                </div>
              </>
            )}
            {currentView === 'welcome' && (
              <div onClick={handleManualScroll}>
                <Image src="/assets/welcome.png" alt="Welcome" width={500} height={300} />
              </div>
            )}
            {currentView === 'ride' && (
              <RidePage />
            )}
          </>
        )}
      </div>
    </div>
  );
}