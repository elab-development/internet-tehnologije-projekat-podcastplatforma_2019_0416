import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

const testimonials = [
  {
    text: "This platform has revolutionized how I consume podcasts. The premium content is top-notch!",
    author: "Alex R."
  },
  {
    text: "As a creator, I love how easy it is to upload and share my podcasts. The community is fantastic.",
    author: "Jamie L."
  },
  {
    text: "An amazing platform with a variety of content. The user interface is so smooth and intuitive.",
    author: "Sam K."
  },
  // Add more testimonials as needed
];

const Home = () => {
  return (
    <div className='home'>
      <section className='hero'>
        <div className='hero__content'>
          <h1>Welcome to Podcast Platform</h1>
          <p>Discover exclusive podcasts and join a vibrant community of creators!</p>
          <div className='hero__cta'>
            <Link to='/login' className='btn btn--primary'>Sign Up for Premium Podcasts</Link>
            <Link to='/login' className='btn btn--secondary'>Join Our Creators Family</Link>
          </div>
        </div>
      </section>
      <section className='features'>
        <div className='features__item'>
          <h2>Exclusive Premium Content</h2>
          <p>Enjoy access to the latest and greatest podcasts that you won’t find anywhere else.</p>
        </div>
        <div className='features__item'>
          <h2>Become a Creator</h2>
          <p>Share your voice with the world. Sign up to create and share your own podcasts with our community.</p>
        </div>
        <div className='features__item'>
          <h2>Join a Vibrant Community</h2>
          <p>Connect with other podcast enthusiasts and creators. Exchange ideas, collaborate, and grow together.</p>
        </div>
      </section>
      <section className='testimonials'>
        <h2>What Our Users Say</h2>
        <div className='testimonials__container'>
          {testimonials.map((testimonial, index) => (
            <div key={index} className='testimonials__item'>
              <p>"{testimonial.text}"</p>
              <span>- {testimonial.author}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
