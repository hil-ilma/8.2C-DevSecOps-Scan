pipeline {
  agent any
  environment {
    NODE_ENV = 'test'
  }
  options {
    skipDefaultCheckout()
  }
  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    stage('Install Dependencies') {
      steps {
        sh 'npm install'
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
        sh 'npm audit || true'
      }
    }
  }
  post {
    always {
      archiveArtifacts artifacts: 'coverage/**,npm-debug.log', fingerprint: true
    }
  }
}
