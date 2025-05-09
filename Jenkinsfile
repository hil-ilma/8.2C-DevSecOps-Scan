pipeline {
  agent any

  // Ensure our test stub kicks in
  environment {
    NODE_ENV = 'test'
  }

  stages {
    stage('Install Dependencies') {
      steps {
        // install your app’s dependencies
        sh 'npm install'
      }
    }

    stage('Run Tests') {
      steps {
        // runs your Mocha suite under NODE_ENV=test
        sh 'npm test'
      }
    }

    stage('Generate Coverage Report') {
      steps {
        // runs nyc coverage under NODE_ENV=test
        sh 'npm run coverage'
      }
    }

    stage('Security Scan') {
      steps {
        // audit vulnerabilities but don’t fail the build
        sh 'npm audit || true'
      }
    }
  }

  post {
    always {
      // archive both the coverage output and any npm logs
      archiveArtifacts artifacts: 'coverage/**,npm-debug.log', fingerprint: true
    }
  }
}
