pipeline {
  agent any

  tools {
    nodejs 'NodeJS'            // your NodeJS installation name
  }

  environment {
    // SONAR_TOKEN must be defined in Jenkins Credentials (as a Secret Text)
    SONAR_TOKEN        = credentials('sonar-cloud-token')  
    SONAR_ORGANIZATION = 'hil-ilma'
    SONAR_PROJECT_KEY  = 'hil-ilma_8.2C-DevSecOps-Scan'
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

    stage('Test & Coverage') {
      steps {
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
        // don’t fail the build on audit issues
        sh 'npm audit --audit-level=moderate || true'
      }
    }

    stage('SonarCloud Analysis') {
      steps {
        withSonarQubeEnv('SonarCloud') {
          // use sonar.token (sonar.login is deprecated)
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
          // abortPipeline: true will fail the build if the gate is RED
          waitForQualityGate abortPipeline: true
        }
      }
    }
  }
}
