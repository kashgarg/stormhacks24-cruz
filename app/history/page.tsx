"use client";

import Image from 'next/image';

const HistoryPage: React.FC = () => {
  return (
    <div className="relative w-full h-screen">
      <Image
        src="/assets/iPhone 16 Plus - 1.png"
        alt="History Page Background"
        layout="fill"
        objectFit="cover"
        priority
      />
    </div>
  );
};

export default HistoryPage;
