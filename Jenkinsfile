pipeline {
  /* ── use the official Node 18 image for *every* stage ── */
  agent {
    docker {
      image 'node:18'
      args  '-u root:root' // run as root so npm can write to workspace
    }
  }

  environment {
    // if you need any env vars (e.g. for SonarCloud), declare them here
    // SONAR_TOKEN = credentials('sonarcloud-token')
  }

  stages {
    stage('Checkout SCM') {
      steps {
        checkout scm
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Run Tests') {
      steps {
        sh 'npm test'
      }
    }

    stage('Generate Coverage') {
      steps {
        sh 'npm run coverage'
      }
    }

    stage('Security Scan') {
      steps {
        sh 'npm audit --audit-level=moderate'
      }
    }
  }

  post {
    /* always archive coverage reports (adjust the path if your reports live somewhere else) */
    always {
      archiveArtifacts artifacts: 'coverage/**', fingerprint: true
    }
    /* on success, you could send email or Slack here */
    success {
      echo " All stages passed!"
      // mail to: 'team@example.com',
      //      subject: "Build ${currentBuild.fullDisplayName} succeeded",
      //      body: "See ${env.BUILD_URL} for details."
    }
    failure {
      echo " Build failed!"
      // mail to: 'team@example.com',
      //      subject: "Build ${currentBuild.fullDisplayName} failed",
      //      body: "See ${env.BUILD_URL} for details."
    }
  }
}
