pipeline {
  agent any

  environment {
    // so your app stub in app.js picks up the test-mode branch
    NODE_ENV = 'test'
  }

  stages {
    stage('Checkout') {
      steps {
        // the one and only checkout
        checkout scm: [
          $class: 'GitSCM',
          branches: [[name: '*/main']],
          doGenerateSubmoduleConfigurations: false,
          extensions: [],
          userRemoteConfigs: [[
            url: 'https://github.com/hil-ilma/8.2C-DevSecOps-Scan.git',
            credentialsId: 'github-pat'
          ]]
        ]
      }
    }

    stage('Install Dependencies') {
      steps {
        // use npm install so the lockfile stays in sync
        sh 'npm install'
      }
    }

    stage('Run Tests') {
      steps {
        sh 'npm test'
      }
    }

    stage('Coverage') {
      when {
        // only run if tests passed
        expression { currentBuild.currentResult == 'SUCCESS' }
      }
      steps {
        sh 'npm run coverage'
      }
    }

    stage('Security Scan') {
      when {
        expression { currentBuild.currentResult == 'SUCCESS' }
      }
      steps {
        // don’t fail the build on vulnerabilities, just report them
        sh 'npm audit --audit-level=moderate || true'
      }
    }
  }

  post {
    always {
      // archive your coverage output (adjust the pattern if needed)
      archiveArtifacts artifacts: 'coverage/**', allowEmptyArchive: true
    }
  }
}
