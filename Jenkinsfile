pipeline {
  agent any

  environment {
    // stub out real DB connections in tests
    NODE_ENV     = 'test'
    // your SonarCloud token
    SONAR_TOKEN  = credentials('sonarcloud-token')
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
        sh 'npm audit --audit-level=moderate || true'
      }
    }

    stage('SonarCloud Analysis') {
      when {
        expression { env.SONAR_TOKEN }
      }
      steps {
        withSonarQubeEnv('SonarCloud') {
          sh """
            npx sonar-scanner \
              -Dsonar.token=${env.SONAR_TOKEN} \
              -Dsonar.organization=hil-ilma \
              -Dsonar.projectKey=hil-ilma_8.2C-DevSecOps-Scan
          """
        }
      }
    }

    stage('Quality Gate') {
      steps {
        // requires "Pipeline: SonarQube" plugin
        timeout(time: 1, unit: 'HOURS') {
          waitForQualityGate abortPipeline: true
        }
      }
    }
  }
}
