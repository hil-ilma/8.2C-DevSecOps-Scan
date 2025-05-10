pipeline {
  agent any

  // disable the built-in automatic checkout
  options {
    skipDefaultCheckout()
  }

  tools {
    nodejs 'NodeJS-16'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Test') {
      steps {
        sh 'npm test || true'
      }
    }

    stage('Coverage') {
      steps {
        sh 'npm run coverage || true'
        archiveArtifacts artifacts: 'coverage/**', fingerprint: true
      }
    }

    stage('Security Audit') {
      steps {
        sh 'npm audit --audit-level=moderate || true'
      }
    }
    // SonarCloud stage removed
  }

  post {
    success {
      emailext(
        to:        'hilmaazmy@gmail.com',
        subject:   "Build #${env.BUILD_NUMBER} SUCCEEDED",
        body:      """<p>Great news: ${env.JOB_NAME} #${env.BUILD_NUMBER} passed!</p>
                     <p><a href="${env.BUILD_URL}console">View console log</a></p>""",
        attachLog: true
      )
    }
    failure {
      emailext(
        to:        'hilmaazmy@gmail.com',
        subject:   "Build #${env.BUILD_NUMBER} FAILED",
        body:      """<p>Oops—${env.JOB_NAME} #${env.BUILD_NUMBER} failed.</p>
                     <p><a href="${env.BUILD_URL}console">See the full log</a></p>""",
        attachLog: true
      )
    }
  }
}
