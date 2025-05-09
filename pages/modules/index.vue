<template>
  <div class="modules-page">
    <h1 class="page-title">DBT Skill Modules</h1>
    <p class="page-description">
      Choose a module to begin learning. Each module contains a series of lessons focused on different DBT skills.
    </p>

    <div class="progress-overview">
      <div class="progress-card card">
        <div class="progress-stats">
          <div class="stat">
            <span class="stat-value">0</span>
            <span class="stat-label">Skills Learned</span>
          </div>
          <div class="stat">
            <span class="stat-value">0</span>
            <span class="stat-label">Days Streak</span>
          </div>
          <div class="stat">
            <span class="stat-value">0%</span>
            <span class="stat-label">Overall Progress</span>
          </div>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: 0%"></div>
        </div>
      </div>
    </div>

    <div class="modules-container">
      <!-- Mindfulness Module -->
      <div class="module-card card">
        <div class="module-header">
          <div class="module-icon mindfulness"></div>
          <h2>Mindfulness</h2>
        </div>
        <div class="module-content">
          <p>Learn skills to focus on the present moment and observe thoughts and emotions without judgment.</p>
          <div class="skills-list">
            <div class="skill-item">
              <div class="skill-icon"></div>
              <span>Wise Mind</span>
            </div>
            <div class="skill-item">
              <div class="skill-icon"></div>
              <span>What Skills</span>
            </div>
            <div class="skill-item">
              <div class="skill-icon"></div>
              <span>How Skills</span>
            </div>
          </div>
          <div class="module-progress">
            <span class="progress-text">0% Complete</span>
            <div class="progress-bar">
              <div class="progress-fill" style="width: 0%"></div>
            </div>
          </div>
        </div>
        <div class="module-footer">
          <NuxtLink to="/modules/mindfulness" class="btn">Start Learning</NuxtLink>
        </div>
      </div>

      <!-- Distress Tolerance Module -->
      <div class="module-card card">
        <div class="module-header">
          <div class="module-icon distress-tolerance"></div>
          <h2>Distress Tolerance</h2>
        </div>
        <div class="module-content">
          <p>Develop skills to tolerate and survive crisis situations without making the situation worse.</p>
          <div class="skills-list">
            <div class="skill-item">
              <div class="skill-icon"></div>
              <span>STOP Skill</span>
            </div>
            <div class="skill-item">
              <div class="skill-icon"></div>
              <span>TIPP Skills</span>
            </div>
            <div class="skill-item">
              <div class="skill-icon"></div>
              <span>Self-Soothing</span>
            </div>
          </div>
          <div class="module-progress">
            <span class="progress-text">0% Complete</span>
            <div class="progress-bar">
              <div class="progress-fill" style="width: 0%"></div>
            </div>
          </div>
        </div>
        <div class="module-footer">
          <NuxtLink to="/modules/distress-tolerance" class="btn">Start Learning</NuxtLink>
        </div>
      </div>

      <!-- Emotion Regulation Module -->
      <div class="module-card card">
        <div class="module-header">
          <div class="module-icon emotion-regulation"></div>
          <h2>Emotion Regulation</h2>
        </div>
        <div class="module-content">
          <p>Learn to identify, understand, and change emotional responses to be more effective in daily life.</p>
          <div class="skills-list">
            <div class="skill-item">
              <div class="skill-icon"></div>
              <span>Identifying Emotions</span>
            </div>
            <div class="skill-item">
              <div class="skill-icon"></div>
              <span>Opposite Action</span>
            </div>
            <div class="skill-item">
              <div class="skill-icon"></div>
              <span>PLEASE Skills</span>
            </div>
          </div>
          <div class="module-progress">
            <span class="progress-text">0% Complete</span>
            <div class="progress-bar">
              <div class="progress-fill" style="width: 0%"></div>
            </div>
          </div>
        </div>
        <div class="module-footer">
          <NuxtLink to="/modules/emotion-regulation" class="btn">Start Learning</NuxtLink>
        </div>
      </div>

      <!-- Interpersonal Effectiveness Module -->
      <div class="module-card card">
        <div class="module-header">
          <div class="module-icon interpersonal-effectiveness"></div>
          <h2>Interpersonal Effectiveness</h2>
        </div>
        <div class="module-content">
          <p>Develop skills to navigate relationships and interact with others in ways that are effective and respectful.</p>
          <div class="skills-list">
            <div class="skill-item">
              <div class="skill-icon"></div>
              <span>DEAR MAN</span>
            </div>
            <div class="skill-item">
              <div class="skill-icon"></div>
              <span>GIVE Skills</span>
            </div>
            <div class="skill-item">
              <div class="skill-icon"></div>
              <span>FAST Skills</span>
            </div>
          </div>
          <div class="module-progress">
            <span class="progress-text">0% Complete</span>
            <div class="progress-bar">
              <div class="progress-fill" style="width: 0%"></div>
            </div>
          </div>
        </div>
        <div class="module-footer">
          <NuxtLink to="/modules/interpersonal-effectiveness" class="btn">Start Learning</NuxtLink>
        </div>
      </div>
    </div>

    <div class="learning-path card">
      <h2>Recommended Learning Path</h2>
      <div class="path-steps">
        <div class="path-step">
          <div class="step-icon mindfulness"></div>
          <div class="step-content">
            <h3>1. Mindfulness</h3>
            <p>Start with mindfulness skills as they form the foundation for all other DBT skills.</p>
          </div>
        </div>
        <div class="path-step">
          <div class="step-icon distress-tolerance"></div>
          <div class="step-content">
            <h3>2. Distress Tolerance</h3>
            <p>Learn to survive crisis situations without making them worse.</p>
          </div>
        </div>
        <div class="path-step">
          <div class="step-icon emotion-regulation"></div>
          <div class="step-content">
            <h3>3. Emotion Regulation</h3>
            <p>Develop skills to understand and change your emotional responses.</p>
          </div>
        </div>
        <div class="path-step">
          <div class="step-icon interpersonal-effectiveness"></div>
          <div class="step-content">
            <h3>4. Interpersonal Effectiveness</h3>
            <p>Build skills for effective communication and relationship management.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modules-page {
  padding-bottom: 3rem;
}

.page-title {
  font-size: 2.2rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.page-description {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
}

.progress-overview {
  margin-bottom: 2rem;
}

.progress-card {
  padding: 1.5rem;
}

.progress-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1.5rem;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

.progress-bar {
  height: 8px;
  background-color: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
  transition: width 0.5s ease;
}

.modules-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.module-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.module-header {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  gap: 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.module-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  flex-shrink: 0;
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

.module-header h2 {
  margin: 0;
  font-size: 1.3rem;
}

.module-content {
  padding: 1.5rem;
  flex-grow: 1;
}

.module-content p {
  margin-bottom: 1.5rem;
}

.skills-list {
  margin-bottom: 1.5rem;
}

.skill-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.8rem;
}

.skill-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #e9ecef;
  margin-right: 0.8rem;
  flex-shrink: 0;
}

.module-progress {
  margin-top: 1rem;
}

.progress-text {
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.module-footer {
  padding: 1.5rem;
  border-top: 1px solid #e9ecef;
  text-align: center;
}

.learning-path {
  padding: 2rem;
}

.learning-path h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--primary-color);
}

.path-steps {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.path-step {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.step-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
}

.step-icon.mindfulness {
  background: linear-gradient(45deg, #9C27B0, #673AB7);
}

.step-icon.distress-tolerance {
  background: linear-gradient(45deg, #FF5722, #FF9800);
}

.step-icon.emotion-regulation {
  background: linear-gradient(45deg, #4CAF50, #8BC34A);
}

.step-icon.interpersonal-effectiveness {
  background: linear-gradient(45deg, #2196F3, #03A9F4);
}

.step-content h3 {
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .progress-stats {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .path-step {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>
