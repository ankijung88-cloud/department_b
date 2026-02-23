import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { ArtistSection } from '../components/home/ArtistSection';
import { FloorGuideSection } from '../components/home/FloorGuideSection';
import { FeaturedSection } from '../components/home/FeaturedSection';
import { AboutSection } from '../components/home/AboutSection';

const LandingPage: React.FC = () => {
    return (
        <>
            <HeroSection />
            <ArtistSection />
            <FloorGuideSection />
            <FeaturedSection />
            <AboutSection />
        </>
    );
};

export default LandingPage;
