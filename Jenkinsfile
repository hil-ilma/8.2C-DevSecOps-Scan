pipeline {
  agent any

  stages {
    stage('Checkout') {
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

    stage('Coverage') {
      steps {
        sh 'npm run coverage'
      }
    }

    stage('Security Scan') {
      steps {
        sh 'npm audit --audit-level=moderate || true'
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: '**/coverage/*.txt', allowEmptyArchive: true
    }
  }
}
