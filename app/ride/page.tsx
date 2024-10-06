'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { auth, db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import BlueTextbox from '../components/BlueTextbox';
import { Loader } from "@googlemaps/js-api-loader";
import { useRouter } from 'next/navigation';

export default function RidePage() {
  const [userName, setUserName] = useState('');
  const [destination, setDestination] = useState('');
  const [currentView, setCurrentView] = useState('home');
  const [currentLocation, setCurrentLocation] = useState('');
  const destinationInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserName = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserName(userDoc.data().name || '');
        }
      }
    };

    fetchUserName();

    // Initialize Google Places Autocomplete
    const initAutocomplete = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        version: "weekly",
        libraries: ["places"],
      });

      const { Autocomplete } = await loader.importLibrary("places");

      if (destinationInputRef.current) {
        const autocomplete = new Autocomplete(destinationInputRef.current, {
          fields: ["place_id", "geometry", "name"],
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          setDestination(place.name || '');
        });
      }
    };

    initAutocomplete();
  }, []);

  useEffect(() => {
    if (currentView === 'finding') {
      const timer = setTimeout(() => {
        setCurrentView('alan');
      }, 3000);

      return () => clearTimeout(timer);
    }

    if (currentView === 'alan') {
      const timer = setTimeout(() => {
        setCurrentView('progress');
      }, 3000);

      return () => clearTimeout(timer);
    }

    if (currentView === 'progress') {
      const timer = setTimeout(() => {
        setCurrentView('arrival');
      }, 2000);

      return () => clearTimeout(timer);
    }

    if (currentView === 'location') {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const currentPosition = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            console.log('Current position:', currentPosition);
            
            // Use Google Maps Geocoding API to get a human-readable address
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: currentPosition }, (results, status) => {
              if (status === 'OK' && results && results[0]) {
                setCurrentLocation(results[0].formatted_address);
              } else {
                console.error('Geocoder failed due to: ' + status);
                setCurrentLocation(`${currentPosition.lat}, ${currentPosition.lng}`);
              }
            });
          },
          (error) => {
            console.error('Error getting current position:', error);
            setCurrentLocation('Unable to get current location');
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
        setCurrentLocation('Geolocation not supported');
      }
    }
  }, [currentView]);

  const handleDestinationSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setCurrentView('location');
    }
  };

  const handleCheckButtonClick = () => {
    setCurrentView('mode');
  };

  const handleBikeButtonClick = () => {
    setCurrentView('confirm');
  };

  const handleConfirmRideClick = () => {
    setCurrentView('finding');
  };

  const handleConfirmArrivalClick = () => {
    router.push('/swipe');
  };

  return (
    <div className="relative w-[393px] h-[852px]">
      <Image
        src={
          currentView === 'home'
            ? "/assets/home.png"
            : currentView === 'location'
            ? "/assets/location.png"
            : currentView === 'mode'
            ? "/assets/mode.png"
            : currentView === 'confirm'
            ? "/assets/confirm.png"
            : currentView === 'finding'
            ? "/assets/finding.png"
            : currentView === 'alan'
            ? "/assets/alan.png"
            : currentView === 'progress'
            ? "/assets/progress.png"
            : "/assets/arrived.png"
        }
        alt={
          currentView === 'home'
            ? "Home"
            : currentView === 'location'
            ? "Location"
            : currentView === 'mode'
            ? "Mode"
            : currentView === 'confirm'
            ? "Confirm"
            : currentView === 'finding'
            ? "Finding"
            : currentView === 'alan'
            ? "Alan"
            : currentView === 'progress'
            ? "Progress"
            : "Arrival"
        }
        layout="fill"
        objectFit="cover"
        priority
      />
      {currentView === 'home' && (
        <>
          <div className="absolute top-[62px] left-6 text-black text-3xl font-bold z-10">
            hi {userName}!
          </div>
          <div className="absolute top-[110px] left-6 z-10">
            <div className="relative">
              <Image
                src="/assets/where-to.png"
                alt="Where to?"
                width={340}
                height={50}
              />
              <input
                ref={destinationInputRef}
                type="text"
                placeholder="where to?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onKeyPress={handleDestinationSubmit}
                className="absolute inset-0 bg-transparent border-none outline-none pl-12 text-white placeholder-white"
              />
            </div>
          </div>
        </>
      )}
      {currentView === 'location' && (
        <>
          <div className="absolute top-[53%] left-[55%] transform -translate-x-1/2 flex flex-col items-center space-y-4 z-10">
            <BlueTextbox
              givenText={currentLocation}
              onChange={(value) => setCurrentLocation(value)}
            />
            <BlueTextbox
              givenText={destination}
              onChange={(value) => setDestination(value)}
            />
          </div>
          <div className="absolute bottom-[16%] right-[10%] z-10">
            <button onClick={handleCheckButtonClick}>
              <Image
                src="/assets/checkbutton.png"
                alt="Check Button"
                width={70}
                height={70}
              />
            </button>
          </div>
        </>
      )}
      {(currentView === 'mode' || currentView === 'confirm' || currentView === 'finding') && (
        <>
          <div className={`absolute ${currentView === 'finding' ? 'top-[52.5%]' : 'top-[8.5%]'} left-[55%] transform -translate-x-1/2 ${currentView === 'finding' ? '-translate-y-1/2' : ''} flex flex-col items-center space-y-4 z-10`}>
            <BlueTextbox
              givenText={currentLocation}
              onChange={(value) => setCurrentLocation(value)}
            />
            <BlueTextbox
              givenText={destination}
              onChange={(value) => setDestination(value)}
            />
          </div>
          {currentView === 'mode' && (
            <div className="absolute top-[67%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center space-y-12">
              <button className="scale-[1.75]" onClick={handleBikeButtonClick}>
                <Image
                  src="/assets/bike.png"
                  alt="Bike"
                  width={600}
                  height={360}
                />
              </button>
              <button className="scale-[1.75]">
                <Image
                  src="/assets/e-scooter.png"
                  alt="E-Scooter"
                  width={600}
                  height={360}
                />
              </button>
              <button className="scale-[1.75]">
                <Image
                  src="/assets/skateboard.png"
                  alt="Skateboard"
                  width={600}
                  height={360}
                />
              </button>
            </div>
          )}
          {currentView === 'confirm' && (
            <div className="absolute bottom-[27.5%] left-1/2 transform -translate-x-1/2 z-10">
              <button className="scale-[1.75]" onClick={handleConfirmRideClick}>
                <Image
                  src="/assets/confirm-ride-orange.png"
                  alt="Confirm Ride"
                  width={350}
                  height={70}
                />
              </button>
            </div>
          )}
        </>
      )}
      {currentView === 'arrival' && (
        <div className="absolute bottom-[20%] left-1/2 transform -translate-x-1/2 z-10">
          <button className="scale-[1.75]" onClick={handleConfirmArrivalClick}>
            <Image
              src="/assets/confirm-arrival.png"
              alt="Confirm Arrival"
              width={350}
              height={70}
            />
          </button>
        </div>
      )}
    </div>
  );
}
