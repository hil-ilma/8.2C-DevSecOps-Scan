pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        git url: 'https://github.com/<your-username>/8.2C-DevSecOps-Scan.git', branch: 'main'
      }
    }
    stage('Install Dependencies') {
      steps {
        sh 'npm install'
      }
    }
    stage('Run Tests') {
      steps {
        // allow test failures to see audit/coverage regardless
        sh 'npm test || true'
      }
    }
    stage('Coverage') {
      steps {
        sh 'npm run coverage || true'
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
      // archive coverage reports and npm audit logs
      archiveArtifacts artifacts: 'coverage/**,npm-debug.log', fingerprint: true
    }
  }
}
