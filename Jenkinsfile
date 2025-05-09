pipeline {
  agent any

  environment {
    NODE_ENV = 'test'
  }

  stages {
    stage('Checkout') {
      steps {
        // pull your GitHub repo using the job’s SCM configuration & credentials
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
      // archive anything under coverage/ plus npm logs
      archiveArtifacts artifacts: 'coverage/**,npm-debug.log', fingerprint: true
    }
  }
}
