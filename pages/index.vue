<template>
  <div class="home-page">
    <section class="hero">
      <div class="hero-content">
        <h1>Master DBT Skills Through Practice</h1>
        <p>Learn Dialectical Behavior Therapy skills one step at a time with a Duolingo-inspired approach</p>
        <NuxtLink to="/modules" class="btn get-started-btn">Start Learning</NuxtLink>
      </div>
      <div class="hero-image">
        <div class="dbt-illustration">
          <div class="skill-circle mindfulness">
            <span>🧘</span>
          </div>
          <div class="skill-circle distress-tolerance">
            <span>🌊</span>
          </div>
          <div class="skill-circle emotion-regulation">
            <span>❤️</span>
          </div>
          <div class="skill-circle interpersonal-effectiveness">
            <span>🤝</span>
          </div>
          <div class="central-circle">
            <span>DBT</span>
          </div>
        </div>
      </div>
    </section>

    <section class="intro">
      <div class="card">
        <h2>What is DBT?</h2>
        <p>
          Dialectical Behavior Therapy (DBT) is a type of cognitive-behavioral therapy that helps people learn and use new skills and strategies to develop a life that they experience as worth living. DBT skills include mindfulness, emotion regulation, distress tolerance, and interpersonal effectiveness.
        </p>
      </div>
    </section>

    <section class="modules-preview">
      <h2>Core DBT Modules</h2>
      <div class="modules-grid">
        <div class="module-card card">
          <div class="module-icon mindfulness"></div>
          <h3>Mindfulness</h3>
          <p>Learn to be fully aware and present in the current moment, observing thoughts and feelings without judgment.</p>
          <NuxtLink to="/modules/mindfulness" class="module-link">Explore →</NuxtLink>
        </div>

        <div class="module-card card">
          <div class="module-icon distress-tolerance"></div>
          <h3>Distress Tolerance</h3>
          <p>Develop skills to accept and survive crisis situations without making them worse.</p>
          <NuxtLink to="/modules/distress-tolerance" class="module-link">Explore →</NuxtLink>
        </div>

        <div class="module-card card">
          <div class="module-icon emotion-regulation"></div>
          <h3>Emotion Regulation</h3>
          <p>Learn to understand, name, and manage your emotions effectively.</p>
          <NuxtLink to="/modules/emotion-regulation" class="module-link">Explore →</NuxtLink>
        </div>

        <div class="module-card card">
          <div class="module-icon interpersonal-effectiveness"></div>
          <h3>Interpersonal Effectiveness</h3>
          <p>Build skills to navigate relationships and communicate effectively while maintaining self-respect.</p>
          <NuxtLink to="/modules/interpersonal-effectiveness" class="module-link">Explore →</NuxtLink>
        </div>
      </div>
    </section>

    <section class="how-it-works">
      <h2>How It Works</h2>
      <div class="steps">
        <div class="step">
          <div class="step-number">1</div>
          <h3>Choose a Module</h3>
          <p>Start with the module that interests you most or follow our recommended path.</p>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <h3>Complete Bite-sized Lessons</h3>
          <p>Learn through short, engaging exercises that take just 2-5 minutes each.</p>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <h3>Practice Daily</h3>
          <p>Build a streak to reinforce your skills and track your progress over time.</p>
        </div>
        <div class="step">
          <div class="step-number">4</div>
          <h3>Apply to Real Life</h3>
          <p>Use what you've learned to handle real-world situations more effectively.</p>
        </div>
      </div>
    </section>

    <section class="cta">
      <div class="card cta-card">
        <h2>Ready to Begin?</h2>
        <p>Start your journey to better emotional well-being today.</p>
        <NuxtLink to="/modules" class="btn">Get Started Now</NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  padding-bottom: 2rem;
}

.hero {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin: 2rem 0 3rem;
}

.hero-content {
  flex: 1;
}

.hero-content h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.hero-content p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #666;
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
}

.hero-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.dbt-illustration {
  position: relative;
  width: 300px;
  height: 300px;
  background-color: rgba(91, 134, 229, 0.05);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.central-circle {
  width: 80px;
  height: 80px;
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  z-index: 2;
}

.skill-circle {
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.skill-circle.mindfulness {
  background: linear-gradient(45deg, #9C27B0, #673AB7);
  top: 40px;
  color: white;
}

.skill-circle.distress-tolerance {
  background: linear-gradient(45deg, #FF5722, #FF9800);
  right: 40px;
  color: white;
}

.skill-circle.emotion-regulation {
  background: linear-gradient(45deg, #4CAF50, #8BC34A);
  bottom: 40px;
  color: white;
}

.skill-circle.interpersonal-effectiveness {
  background: linear-gradient(45deg, #2196F3, #03A9F4);
  left: 40px;
  color: white;
}

.get-started-btn {
  font-size: 1.1rem;
  padding: 12px 30px;
}

.intro {
  margin-bottom: 3rem;
}

.intro .card {
  padding: 2rem;
}

.intro h2 {
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.intro p {
  font-size: 1.1rem;
  line-height: 1.7;
}

.modules-preview {
  margin-bottom: 3rem;
}

.modules-preview h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--primary-color);
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.module-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
}

.module-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 1rem;
  background-size: cover;
  background-position: center;
}

.module-icon.mindfulness {
  background: linear-gradient(45deg, #9C27B0, #673AB7);
}

.module-icon.distress-tolerance {
  background: linear-gradient(45deg, #FF5722, #FF9800);
}

.module-icon.emotion-regulation {
  background: linear-gradient(45deg, #4CAF50, #8BC34A);
}

.module-icon.interpersonal-effectiveness {
  background: linear-gradient(45deg, #2196F3, #03A9F4);
}

.module-card h3 {
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.module-link {
  margin-top: 1rem;
  color: var(--primary-color);
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.module-link:hover {
  color: var(--secondary-color);
}

.how-it-works {
  margin-bottom: 3rem;
}

.how-it-works h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--primary-color);
}

.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.step {
  text-align: center;
  padding: 1rem;
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 auto 1rem;
}

.step h3 {
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.cta {
  margin-top: 3rem;
}

.cta-card {
  text-align: center;
  padding: 3rem 2rem;
  background: linear-gradient(to right, rgba(91, 134, 229, 0.05), rgba(54, 209, 220, 0.05));
}

.cta h2 {
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.cta p {
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.cta .btn {
  padding: 12px 30px;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .hero {
    flex-direction: column;
  }
  
  .hero-content {
    text-align: center;
  }
  
  .hero-content h1 {
    font-size: 2rem;
  }
  
  .modules-grid {
    grid-template-columns: 1fr;
  }
}
</style>
