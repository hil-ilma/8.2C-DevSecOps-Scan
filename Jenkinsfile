pipeline {
  agent any

  tools { nodejs 'NodeJS-16' }

  stages {
    stage('Checkout')   { steps { checkout scm } }
    stage('Install')    { steps { sh 'npm ci' } }
    stage('Test')       { steps { sh 'npm test' } }
    stage('Coverage') {
  environment { NODE_ENV = 'test' }
  steps {
    sh 'npm ci'  
    sh 'npx nyc --reporter=lcov --reporter=text-summary mocha --recursive'
    sh 'npx nyc report --reporter=html'
  }
  post {
    always {
      archiveArtifacts artifacts: 'coverage/**', fingerprint: true
    }
  }
}

    stage('Security')   { steps { sh 'npm audit --audit-level=moderate || true' } }
    // you can keep SonarCloud but make it non-blocking:
    stage('SonarCloud') {
      steps {
        withSonarQubeEnv('SonarCloud') {
          sh """npx sonar-scanner \
            -Dsonar.host.url=$SONAR_HOST_URL \
            -Dsonar.login=$SONAR_AUTH_TOKEN \
            -Dsonar.organization=hil-ilma \
            -Dsonar.projectKey=hil-ilma_8.2C-DevSecOps-Scan"""
        }
      }
      // do NOT fail the build if Sonar fails:
      post { always { echo 'Sonar finished (see logs), but build won’t abort.' } }
    }
  }

  post {
    success {
      emailext to:      'hilmaazmy@gmail.com',
               subject: " Build #${env.BUILD_NUMBER} succeeded",
               body:    "Good news! ${env.JOB_NAME} #${env.BUILD_NUMBER} passed."
    }
    failure {
      emailext to:      'you@yourdomain.com',
               subject: " Build #${env.BUILD_NUMBER} FAILED",
               body:    "Oops! ${env.JOB_NAME} #${env.BUILD_NUMBER} failed. See console: ${env.BUILD_URL}"
    }
  }
}
