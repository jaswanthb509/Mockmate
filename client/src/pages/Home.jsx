import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Stats from "../components/landing/Stats";
import WhyMockmate from "../components/landing/WhyMockmate";
import Features from "../components/landing/Features";

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Stats />
      <WhyMockmate />
      <Features />
    </>
  );
};

export default Home;