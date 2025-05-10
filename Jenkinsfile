pipeline {
  agent any

  environment {
    SONAR_TOKEN        = credentials('sonar-cloud-token')
    SONAR_ORGANIZATION = 'hil-ilma'
    SONAR_PROJECT_KEY  = 'hil-ilma_8.2C-DevSecOps-Scan'
  }

  tools {
    nodejs 'NodeJS-16'
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Install') {
      steps { sh 'npm ci' }
    }

stage('Test & Coverage') {
  environment { NODE_ENV = 'test' }
  steps {
    sh 'npm ci'
    sh 'npm test'
    sh 'npx nyc --reporter=lcov --reporter=text-summary mocha --recursive'
    sh 'npx nyc report --reporter=html'
  }
  post {
    always {
      archiveArtifacts artifacts: 'coverage/**', fingerprint: true
    }
  }
}

    stage('Security Audit') {
      steps {
        sh 'npm audit --audit-level=moderate || true'
      }
    }

    stage('SonarCloud Analysis') {
      steps {
        withSonarQubeEnv('SonarCloud') {
          sh """
            npx sonar-scanner \
              -Dsonar.token=$SONAR_TOKEN \
              -Dsonar.organization=$SONAR_ORGANIZATION \
              -Dsonar.projectKey=$SONAR_PROJECT_KEY
          """
        }
      }
    }

    stage('Quality Gate') {
      steps {
        timeout(time: 1, unit: 'HOURS') {
          waitForQualityGate abortPipeline: true
        }
      }
    }
  }
}
