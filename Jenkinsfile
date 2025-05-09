pipeline {
  agent any

  // Avoid Jenkins’s built-in checkout: we’ll do it ourselves
  options {
    skipDefaultCheckout()
  }

  // Tell the app it’s in test mode
  environment {
    NODE_ENV = 'test'
  }

  stages {
    stage('Checkout') {
      steps {
        // This uses the job’s SCM config + credentials
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

    stage('Generate Coverage Report') {
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
      // Archive your coverage folder and any npm-debug.log
      archiveArtifacts artifacts: 'coverage/**,npm-debug.log', fingerprint: true
    }
  }
}
