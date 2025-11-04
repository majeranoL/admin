import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import '../css/LandingPage.css'
import logo from '../assets/animal911logo.png'
import heroBackground from '../assets/heropagebackground.png'

function LandingPage() {
  const navigate = useNavigate()
  const { theme, toggleTheme, isDark } = useTheme()
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Show/hide scroll to top button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <div className={`landing-page ${isDark ? 'dark-mode' : ''}`}>
      {/* Navigation Bar */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <img src={logo} alt="Animal 911 Logo" className="nav-logo-img" />
            <span>Animal 911</span>
          </div>
          <div className="nav-links">
            <a onClick={() => scrollToSection('about')}>About</a>
            <a onClick={() => scrollToSection('how-it-works')}>How It Works</a>
            <a onClick={() => scrollToSection('features')}>Features</a>
            <a onClick={() => scrollToSection('get-involved')}>Get Involved</a>
            <button 
              className="theme-toggle" 
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
            >
              <i className={isDark ? 'bi bi-sun-fill' : 'bi bi-moon-fill'}></i>
            </button>
            <button className="btn-login" onClick={() => navigate('/login')}>
              Shelter Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
             Animal 911 – Together, We Save Lives
          </h1>
          <p className="hero-subtitle">
            Your Partner in Animal Rescue and Welfare.
          </p>
          <p className="hero-description">
            Connect with shelters, volunteers, and compassionate individuals through Animal 911 — 
            a unified platform for reporting, rescuing, and adopting animals in need.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => scrollToSection('get-involved')}>
              <i className="bi bi-exclamation-circle"></i> Report an Animal in Distress
            </button>
            <button className="btn-secondary" onClick={() => navigate('/register-shelter')}>
              <i className="bi bi-building"></i> Join as a Partnering Shelter
            </button>
            <button className="btn-secondary" onClick={() => scrollToSection('for-volunteers')}>
              <i className="bi bi-people"></i> Become a Volunteer
            </button>
          </div>
        </div>
        <div className="hero-image">
          <i className="bi bi-heart-pulse hero-icon"></i>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="section-container">
          <h2 className="section-title">About Animal 911</h2>
          <p className="section-text">
            Animal 911 is a <strong>real-time animal rescue coordination system</strong> that bridges 
            the gap between the public, volunteers, and partnering shelters. Through mobile and web 
            platforms, it streamlines the process of reporting injured or abandoned animals, assigning 
            rescue volunteers, and managing adoptions — all in one connected ecosystem.
          </p>
          <div className="mission-vision">
            <div className="mission-card">
              <i className="bi bi-bullseye"></i>
              <h3>Mission</h3>
              <p>To save animal lives through technology, collaboration, and compassion.</p>
            </div>
            <div className="vision-card">
              <i className="bi bi-eye"></i>
              <h3>Vision</h3>
              <p>A community where every distressed animal receives the help it deserves.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="section-container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            A simple 4-step process ensures fast and effective rescue:
          </p>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon"><i className="bi bi-phone"></i></div>
              <h3>Report</h3>
              <p>Users report an injured or stray animal via the app or website.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon"><i className="bi bi-truck"></i></div>
              <h3>Rescue</h3>
              <p>The nearest partnering shelter assigns a volunteer to respond.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon"><i className="bi bi-heart-pulse"></i></div>
              <h3>Rehabilitate</h3>
              <p>The animal receives proper care and medical treatment.</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <div className="step-icon"><i className="bi bi-house-heart"></i></div>
              <h3>Adopt</h3>
              <p>Once healthy, the animal is listed for adoption to find a loving home.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-container">
          <h2 className="section-title">Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <i className="bi bi-clock-history"></i>
              <h3>Real-Time Rescue Updates</h3>
              <p>Stay informed with live notifications and case tracking.</p>
            </div>
            <div className="feature-card">
              <i className="bi bi-robot"></i>
              <h3>AI Assistance</h3>
              <p>Upload an image and get instant help identifying animal injuries and first-aid steps.</p>
            </div>
            <div className="feature-card">
              <i className="bi bi-geo-alt"></i>
              <h3>Volunteer Coordination</h3>
              <p>Smart GPS-based assignment ensures the fastest response time.</p>
            </div>
            <div className="feature-card">
              <i className="bi bi-house-heart"></i>
              <h3>Adoption Portal</h3>
              <p>Find your next furry friend! Browse available animals ready for adoption.</p>
            </div>
            <div className="feature-card">
              <i className="bi bi-shield-check"></i>
              <h3>Secure and Verified Shelters</h3>
              <p>All shelters undergo administrative review to ensure credibility and animal safety.</p>
            </div>
          </div>
        </div>
      </section>

      {/* For Shelters Section */}
      <section id="for-shelters" className="for-shelters-section">
        <div className="section-container">
          <div className="content-split">
            <div className="content-left">
              <h2 className="section-title">For Shelters</h2>
              <p className="section-text">
                Join our growing network of certified shelters. Manage rescue reports, volunteers, 
                and adoption listings in one secure dashboard.
              </p>
              <h3>Benefits for Shelters:</h3>
              <ul className="benefits-list">
                <li><i className="bi bi-check-circle-fill"></i> Streamlined rescue coordination</li>
                <li><i className="bi bi-check-circle-fill"></i> Real-time volunteer assignment</li>
                <li><i className="bi bi-check-circle-fill"></i> Secure data management via Firebase</li>
                <li><i className="bi bi-check-circle-fill"></i> Enhanced public visibility and trust</li>
              </ul>
              <button className="btn-primary" onClick={() => navigate('/register-shelter')}>
                <i className="bi bi-building"></i> Register Your Shelter
              </button>
            </div>
            <div className="content-right">
              <div className="illustration">
                <i className="bi bi-building"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Volunteers Section */}
      <section id="for-volunteers" className="for-volunteers-section">
        <div className="section-container">
          <div className="content-split reverse">
            <div className="content-left">
              <div className="illustration">
                <i className="bi bi-people-fill"></i>
              </div>
            </div>
            <div className="content-right">
              <h2 className="section-title">For Volunteers</h2>
              <p className="section-text">
                Be a hero to animals in need. Sign up as a volunteer and get rescue missions near your area.
              </p>
              <h3>You'll be able to:</h3>
              <ul className="benefits-list">
                <li><i className="bi bi-check-circle-fill"></i> Receive real-time rescue alerts</li>
                <li><i className="bi bi-check-circle-fill"></i> Track assignments and progress</li>
                <li><i className="bi bi-check-circle-fill"></i> Help shelters in need of extra hands</li>
              </ul>
              <button className="btn-primary">
                <i className="bi bi-person-plus"></i> Sign Up as Volunteer
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Get Involved Section */}
      <section id="get-involved" className="get-involved-section">
        <div className="section-container">
          <h2 className="section-title">Get Involved</h2>
          <p className="section-subtitle">
            Whether you're a pet lover, a shelter owner, or a first-time volunteer — 
            there's a place for you in Animal 911.
          </p>
          <div className="involvement-grid">
            <div className="involvement-card">
              <i className="bi bi-exclamation-triangle"></i>
              <h3>Report an Animal</h3>
              <p>Help save a life by reporting an animal in distress</p>
            </div>
            <div className="involvement-card">
              <i className="bi bi-person-badge"></i>
              <h3>Volunteer</h3>
              <p>Join rescue operations in your area</p>
            </div>
            <div className="involvement-card">
              <i className="bi bi-house-heart"></i>
              <h3>Adopt or Foster</h3>
              <p>Give a rescued pet a loving home</p>
            </div>
            <div className="involvement-card">
              <i className="bi bi-megaphone"></i>
              <h3>Spread Awareness</h3>
              <p>Share our mission in your community</p>
            </div>
          </div>
          <div className="cta-center">
            <button className="btn-large">
              <i className="bi bi-heart-fill"></i> Join the Movement
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-container">
          <h2 className="section-title">What People Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="quote-icon">"</div>
              <p className="testimonial-text">
                Animal 911 made it easy for our shelter to connect with volunteers and save 
                more animals in record time.
              </p>
              <div className="testimonial-author">
                <strong>Happy Paws Shelter</strong>
                <span>Cavite</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="quote-icon">"</div>
              <p className="testimonial-text">
                I was able to report an injured cat and saw it get rescued the same day. 
                Amazing system!
              </p>
              <div className="testimonial-author">
                <strong>Maria Santos</strong>
                <span>User</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-section">
            <img src={logo} alt="Animal 911 Logo" className="footer-logo" />
            <h3>Animal 911</h3>
            <p>Your Partner in Animal Rescue and Welfare</p>
            <div className="social-links">
              <a href="#"><i className="bi bi-facebook"></i></a>
              <a href="#"><i className="bi bi-twitter"></i></a>
              <a href="#"><i className="bi bi-instagram"></i></a>
            </div>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a onClick={() => scrollToSection('about')}>About Us</a></li>
              <li><a onClick={() => scrollToSection('how-it-works')}>How It Works</a></li>
              <li><a onClick={() => navigate('/login')}>Shelter Login</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Contact Support</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact Info</h4>
            <ul className="contact-info">
              <li>
                <i className="bi bi-envelope"></i>
                <a href="mailto:animal911.help@gmail.com">animal911.help@gmail.com</a>
              </li>
              <li>
                <i className="bi bi-geo-alt"></i>
                <span>St. Dominic College of Asia, Bacoor, Cavite</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Animal 911. All Rights Reserved.</p>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button 
          className="scroll-to-top"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <i className="bi bi-arrow-up"></i>
        </button>
      )}
    </div>
  )
}

export default LandingPage
