pipeline {
  agent any

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
        // allow failures so we still get coverage + email
        sh 'npm test || true'
      }
    }

    stage('Coverage') {
      steps {
        sh 'npx nyc --reporter=lcov --reporter=text-summary mocha --recursive'
        archiveArtifacts artifacts: 'coverage/**', fingerprint: true
      }
    }

    stage('Security Audit') {
      steps {
        // audit-level=moderate to only show moderate+ issues
        sh 'npm audit --audit-level=moderate || true'
      }
    }
  }

  post {
    success {
      emailext(
        to:       'hilmaazmy@gmail.com',
        subject:  " Build Success: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
        body:     """
          <p>Hi there,</p>
          <p>Your Jenkins job <b>${env.JOB_NAME} #${env.BUILD_NUMBER}</b> completed successfully.</p>
          <p>🔗 Console output: <a href="${env.BUILD_URL}console">${env.BUILD_URL}console</a></p>
        """,
        attachLog: true
      )
    }
    failure {
      emailext(
        to:       'hilmaazmy@gmail.com',
        subject:  " Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
        body:     """
          <p>Hi there,</p>
          <p>Your Jenkins job <b>${env.JOB_NAME} #${env.BUILD_NUMBER}</b> has <b>failed</b>.</p>
          <p>🔗 Console output: <a href="${env.BUILD_URL}console">${env.BUILD_URL}console</a></p>
        """,
        attachLog: true
      )
    }
  }
}
