import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { ArtistSection } from '../components/home/ArtistSection';
import { FloorGuideSection } from '../components/home/FloorGuideSection';
import { FeaturedSection } from '../components/home/FeaturedSection';
import { AboutSection } from '../components/home/AboutSection';
import { GoodsSection } from '../components/home/GoodsSection';

const LandingPage: React.FC = () => {
    return (
        <div className="w-full">
            <div className="snap-start snap-always w-full"><HeroSection /></div>
            <div className="snap-start snap-always w-full"><FloorGuideSection /></div>
            <div className="snap-start snap-always w-full"><ArtistSection /></div>
            <div className="snap-start snap-always w-full"><FeaturedSection /></div>
            <div className="snap-start snap-always w-full"><GoodsSection /></div>
            <div className="snap-start snap-always w-full"><AboutSection /></div>
        </div>
    );
};

export default LandingPage;
